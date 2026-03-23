import { PROXY_PRIMARY, PROXY_FALLBACK } from '../utils/constants.js'

let workingProxy = null

function getProdUrl(url, proxyBase) {
  return `${proxyBase}${encodeURIComponent(url)}`
}

export async function proxyFetch(url, timeoutMs = 15000) {
  // Always use allorigins for reliability (works in dev and prod)
  const proxies = [PROXY_PRIMARY, PROXY_FALLBACK]

  // If we already know a working proxy, try it first
  if (workingProxy) {
    proxies.sort((a) => (a === workingProxy ? -1 : 1))
  }

  let lastError
  for (const proxy of proxies) {
    try {
      const proxyUrl = getProdUrl(url, proxy)
      const res = await fetchWithTimeout(proxyUrl, timeoutMs)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      workingProxy = proxy
      return res
    } catch (err) {
      lastError = err
      // Try next proxy
    }
  }

  throw lastError || new Error('All CORS proxies failed. Check your connection and that the watchlist is public.')
}

async function fetchWithTimeout(url, ms) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), ms)
  try {
    const res = await fetch(url, { signal: controller.signal })
    return res
  } finally {
    clearTimeout(timer)
  }
}
