import { proxyFetch } from './corsProxy.js'
import { LB_BASE, LB_PAGE_SIZE } from '../utils/constants.js'

const parser = new DOMParser()

/**
 * Scrape one page of a user's watchlist.
 * Returns an array of Film objects (without posterUrl yet).
 */
export async function scrapePage(username, page) {
  const url = `${LB_BASE}/${username}/watchlist/page/${page}/`

  try {
    const res = await proxyFetch(url)
    const html = await res.text()

    const doc = parser.parseFromString(html, 'text/html')

    // Check for 404 / not found
    const bodyText = doc.body?.textContent || ''
    if (page === 1 && /404|page not found|user not found/i.test(bodyText)) {
      throw new Error(`User "${username}" not found.`)
    }

    // NEW SELECTORS: li.griditem > div.react-component
    const entries = doc.querySelectorAll('li.griditem div.react-component')

    if (page === 1 && entries.length === 0) {
      // Check if this is a 404 page
      if (/404|not found|does not exist/i.test(bodyText)) {
        throw new Error(`User "${username}" not found.`)
      }
      // Otherwise assume empty watchlist
      throw new Error(`No films in watchlist for "${username}".`)
    }

    const films = []
    entries.forEach((entry) => {
      // Extract from data attributes (most reliable)
      const slug = entry.getAttribute('data-item-slug') || ''
      const name = entry.getAttribute('data-item-name') || ''
      const link = entry.getAttribute('data-target-link') || entry.getAttribute('data-item-link') || ''

      // Parse year from name: "The Trial of the Chicago 7 (2020)" → "2020"
      const yearMatch = name.match(/\((\d{4})\)/)
      const year = yearMatch ? yearMatch[1] : ''

      // Clean title (remove year): "The Trial of the Chicago 7 (2020)" → "The Trial of the Chicago 7"
      const title = name.replace(/\s*\(\d{4}\)\s*$/, '').trim()

      // Get poster image
      const img = entry.querySelector('img.image')
      let posterUrl = img?.getAttribute('src') || img?.getAttribute('data-src') || null
      // Upgrade thumbnail size: 125x187 → 230x345
      if (posterUrl) {
        posterUrl = posterUrl.replace(/resized\/film-poster\/.*?\/-\/-\/.*?\//, 'resized/film-poster/')
          .replace(/125x187/, '230x345')
          .replace(/0-70-0-105/g, '0-230-0-345')
      }

      if (title && slug) {
        films.push({
          title,
          year,
          letterboxdUri: `${LB_BASE}/film/${slug}/`,
          letterboxdSlug: slug,
          rating: null,
          posterUrl,
        })
      }
    })

    return films
  } catch (err) {
    // Network errors on page 2+ are ok (means we reached the end)
    if (page > 1) {
      return []
    }
    throw err
  }
}

/**
 * Scrape all pages of a user's watchlist with progress callback.
 * onProgress(loaded, total) where total is estimated.
 */
export async function scrapeAllPages(username, onProgress) {
  const allFilms = []
  let page = 1
  const maxPages = 100 // Safety limit

  while (page <= maxPages) {
    onProgress?.(allFilms.length, allFilms.length + LB_PAGE_SIZE)

    try {
      const films = await scrapePage(username, page)

      if (films.length === 0) {
        break // No more pages
      }

      allFilms.push(...films)
      onProgress?.(allFilms.length, allFilms.length)

      if (films.length < LB_PAGE_SIZE) {
        break // Last page
      }

      page++
    } catch (err) {
      if (page === 1) {
        throw err // First page error is fatal
      }
      // Subsequent pages might fail, stop gracefully
      break
    }
  }

  if (allFilms.length === 0) {
    throw new Error(`No films found for "${username}". Is your watchlist public?`)
  }

  return allFilms
}
