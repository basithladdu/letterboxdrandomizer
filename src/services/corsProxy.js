import { PROXY_PRIMARY, PROXY_FALLBACK, PROXY_ALT, PROXY_ROUTER, LB_BASE } from '../utils/constants.js'

let workingProxy = null

// In dev, vite proxies /lb-proxy -> letterboxd.com (see vite.config.js).
// In prod, our own serverless function at /api/lb does the same thing.
// Public CORS proxies are only a last resort: they are heavily rate-limited and
// often answer HTTP 200 with an error page, which used to silently truncate
// large watchlists.
function ownEndpoint(url) {
  if (import.meta.env.DEV) {
    return url.replace(LB_BASE, '/lb-proxy')
  }
  return `/api/lb?url=${encodeURIComponent(url)}`
}

export async function proxyFetch(url, timeoutMs = 20000) {
  // 1. Our own proxy first — no quota, no rate limit.
  try {
    const res = await fetchWithTimeout(ownEndpoint(url), timeoutMs)
    if (res.ok) return res
    // 404/403 from Letterboxd itself is a real answer, not a proxy failure.
    if (res.status === 404 || res.status === 403) return res
  } catch {
    // fall through to public proxies
  }

  // 2. Public proxies as a safety net.
  const proxies = [PROXY_PRIMARY, PROXY_FALLBACK, PROXY_ALT, PROXY_ROUTER]
  if (workingProxy) {
    proxies.sort((a) => (a === workingProxy ? -1 : 1))
  }

  let lastError
  for (const proxy of proxies) {
    try {
      const res = await fetchWithTimeout(`${proxy}${encodeURIComponent(url)}`, timeoutMs)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      workingProxy = proxy
      return res
    } catch (err) {
      lastError = err
    }
  }

  throw lastError || new Error('Could not reach Letterboxd. Check your connection and that the watchlist is public.')
}

async function fetchWithTimeout(url, ms) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), ms)
  try {
    return await fetch(url, { signal: controller.signal })
  } finally {
    clearTimeout(timer)
  }
}
