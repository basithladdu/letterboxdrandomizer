import { proxyFetch } from './corsProxy.js'
import { LB_BASE, LB_PAGE_SIZE } from '../utils/constants.js'
import { normalizeLetterboxdUsername } from '../utils/letterboxdInput.js'

// How many pages to request at once. Letterboxd is fine with this and it keeps
// a 3000-film watchlist to a few seconds instead of a minute.
const CONCURRENCY = 5
const PAGE_RETRIES = 3
const filmMetadataCache = new Map()

function parseDocument(html) {
  if (typeof DOMParser === 'undefined') {
    throw new Error('This environment cannot parse Letterboxd pages.')
  }

  return new DOMParser().parseFromString(html, 'text/html')
}

function toAssetUrl(path) {
  if (!path) return null

  const absoluteUrl = path.startsWith('http') ? path : `${LB_BASE}${path}`
  if (!absoluteUrl.startsWith(LB_BASE)) return absoluteUrl

  return import.meta.env.DEV
    ? absoluteUrl.replace(LB_BASE, '/lb-proxy')
    : `/api/lb?url=${encodeURIComponent(absoluteUrl)}`
}

function posterUrlForSlug(slug, posterPath) {
  return toAssetUrl(posterPath || `/film/${slug}/image-150/`)
}

function parseJsonLdScript(script) {
  const raw = (script.textContent || '')
    .replace(/\/\*\s*<!\[CDATA\[\s*\*\/|\/\*\s*\]\]>\s*\*\//g, '')
    .trim()

  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function parseFilms(doc) {
  const entries = doc.querySelectorAll('li.griditem div.react-component')
  const films = []

  entries.forEach((entry) => {
    const slug = entry.getAttribute('data-item-slug') || ''
    const name = entry.getAttribute('data-item-name') || ''

    const yearMatch = name.match(/\((\d{4})\)/)
    const year = yearMatch ? yearMatch[1] : ''
    const title = name.replace(/\s*\(\d{4}\)\s*$/, '').trim()

    const img = entry.querySelector('img.image')
    const posterPath = entry.getAttribute('data-poster-url')
      || img?.getAttribute('data-src')
      || (img?.getAttribute('src')?.includes('empty-poster') ? null : img?.getAttribute('src'))

    if (title && slug) {
      films.push({
        title,
        year,
        letterboxdUri: `${LB_BASE}/film/${slug}/`,
        letterboxdSlug: slug,
        rating: null,
        posterUrl: posterUrlForSlug(slug, posterPath),
      })
    }
  })

  return films
}

export function fetchFilmMetadata(slug) {
  const normalizedSlug = String(slug || '').trim().replace(/^\/+|\/+$/g, '')
  if (!normalizedSlug) return Promise.resolve({})
  if (filmMetadataCache.has(normalizedSlug)) return filmMetadataCache.get(normalizedSlug)

  const request = (async () => {
    const posterUrl = posterUrlForSlug(normalizedSlug)

    try {
      const res = await proxyFetch(`${LB_BASE}/film/${encodeURIComponent(normalizedSlug)}/`)
      if (!res.ok) return { posterUrl }

      const doc = parseDocument(await res.text())
      let detailPosterUrl = posterUrl
      const jsonLd = [...doc.querySelectorAll('script[type="application/ld+json"]')]
        .map(parseJsonLdScript)
        .find((data) => data?.image)

      if (typeof jsonLd?.image === 'string') detailPosterUrl = jsonLd.image

      const ratingNode = doc.querySelector('.averagerating')
      const ratingTitle = ratingNode?.getAttribute('data-original-title') || ''
      const ratingMeta = doc.querySelector('meta[name="twitter:data2"]')?.getAttribute('content') || ''
      const ratingValue = jsonLd?.aggregateRating?.ratingValue
      const ratingMatch = String(ratingValue || '').match(/\d+(?:\.\d+)?/)
        || ratingTitle.match(/average of\s+(\d+(?:\.\d+)?)/i)
        || ratingMeta.match(/(\d+(?:\.\d+)?)\s+out of/i)
        || ratingNode?.textContent?.match(/\d+(?:\.\d+)?/)

      return {
        posterUrl: detailPosterUrl,
        rating: ratingMatch?.[1] || ratingMatch?.[0] || null,
      }
    } catch {
      return { posterUrl }
    }
  })()

  filmMetadataCache.set(normalizedSlug, request)
  return request
}

// Letterboxd puts the authoritative watchlist size on the grid container.
// This is what lets us detect a truncated scrape instead of guessing.
function parseTotal(doc) {
  const el = doc.querySelector('[data-num-entries]')
  if (!el) return null
  const n = parseInt(el.getAttribute('data-num-entries'), 10)
  return Number.isFinite(n) ? n : null
}

// Fetch and parse a single page. Returns { films, total }.
export async function scrapePage(username, page) {
  const normalizedUsername = normalizeLetterboxdUsername(username)
  if (!normalizedUsername) throw new Error('Enter a valid Letterboxd username or profile link.')
  const url = `${LB_BASE}/${encodeURIComponent(normalizedUsername)}/watchlist/page/${page}/`
  const res = await proxyFetch(url)

  if (res.status === 404 && page === 1) {
    throw new Error(`User "${username}" not found.`)
  }

  // A page after the end of a watchlist may be a 404 even when the user is
  // valid. Treat it as the normal end condition for the no-total fallback.
  if (res.status === 404) return { films: [], total: null }

  const html = await res.text()
  const doc = parseDocument(html)

  if (page === 1) {
    const bodyText = doc.body?.textContent || ''
    if (/page not found|user not found|does not exist/i.test(bodyText) && !doc.querySelector('[data-num-entries]')) {
      throw new Error(`User "${username}" not found.`)
    }
  }

  return { films: parseFilms(doc), total: parseTotal(doc) }
}

async function scrapePageWithRetry(username, page, expectFilms) {
  let lastErr
  for (let attempt = 0; attempt < PAGE_RETRIES; attempt++) {
    try {
      const result = await scrapePage(username, page)
      // A page that should hold films but came back empty means the proxy
      // handed us an error page with a 200 status. Retry rather than treating
      // it as the end of the watchlist.
      if (result.films.length === 0 && expectFilms && result.total !== 0) {
        throw new Error(`Empty response for page ${page}`)
      }
      return result
    } catch (err) {
      lastErr = err
      if (/not found/i.test(err.message)) throw err
      if (attempt < PAGE_RETRIES - 1) {
        await new Promise((r) => setTimeout(r, 600 * (attempt + 1)))
      }
    }
  }
  throw lastErr
}

// Scrape the complete watchlist, every page, with progress reporting.
export async function scrapeAllPages(username, onProgress) {
  // Page 1 tells us exactly how many films to expect.
  // Retry an empty first response too: a proxy can return a 200 error page,
  // which otherwise looks indistinguishable from an empty watchlist.
  const first = await scrapePageWithRetry(username, 1, true)
  const total = first.total

  if (first.films.length === 0) {
    if (total === 0) {
      throw new Error(`"${username}"'s watchlist is empty.`)
    }
    throw new Error(`No films found for "${username}". Is the watchlist public?`)
  }

  const byPage = new Map([[1, first.films]])
  onProgress?.(first.films.length, total || first.films.length)

  // Derive the page count from the real total when we have it, so a flaky page
  // in the middle can never cut the list short.
  const lastPage =
    total != null
      ? Math.ceil(total / LB_PAGE_SIZE)
      : null

  const failedPages = []

  if (lastPage != null) {
    const pages = []
    for (let p = 2; p <= lastPage; p++) pages.push(p)

    for (let i = 0; i < pages.length; i += CONCURRENCY) {
      const batch = pages.slice(i, i + CONCURRENCY)
      const results = await Promise.allSettled(
        batch.map((p) => scrapePageWithRetry(username, p, true))
      )

      results.forEach((r, idx) => {
        const p = batch[idx]
        if (r.status === 'fulfilled') byPage.set(p, r.value.films)
        else failedPages.push(p)
      })

      const loaded = [...byPage.values()].reduce((n, f) => n + f.length, 0)
      onProgress?.(loaded, total)
    }
  } else {
    // No total available — walk pages until one is genuinely empty.
    let p = 2
    while (p <= 400) {
      let films
      try {
        films = (await scrapePageWithRetry(username, p, false)).films
      } catch (err) {
        failedPages.push(p)
        throw new Error(`Could not fetch watchlist page ${p} for "${username}": ${err.message}`)
      }
      if (films.length === 0) break
      byPage.set(p, films)
      onProgress?.([...byPage.values()].reduce((n, f) => n + f.length, 0), 0)
      if (films.length < LB_PAGE_SIZE) break
      p++
    }
  }

  // Reassemble in page order and drop any duplicates.
  const seen = new Set()
  const allFilms = []
  for (const p of [...byPage.keys()].sort((a, b) => a - b)) {
    for (const film of byPage.get(p)) {
      if (seen.has(film.letterboxdSlug)) continue
      seen.add(film.letterboxdSlug)
      allFilms.push(film)
    }
  }

  if (allFilms.length === 0) {
    throw new Error(`No films found for "${username}". Is the watchlist public?`)
  }

  const complete = failedPages.length === 0 && (total == null || allFilms.length >= total)
  if (!complete) {
    const pageDetails = failedPages.length ? ` Failed pages: ${failedPages.join(', ')}.` : ''
    throw new Error(`Could not fetch the complete watchlist for "${username}".${pageDetails} Please try again.`)
  }

  return Object.assign(allFilms, {
    meta: {
      expected: total,
      fetched: allFilms.length,
      complete,
      failedPages,
    },
  })
}
