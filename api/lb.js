// Serverless CORS proxy for Letterboxd.
// Public CORS proxies (allorigins, codetabs, thingproxy, corsproxy.io) are
// rate-limited or dead, which silently truncated large watchlists. This runs
// server-side so there is no CORS restriction and no third-party quota.

const ALLOWED_HOST = 'letterboxd.com'

export default async function handler(req, res) {
  const requestUrl = new URL(req.url || '/', `https://${req.headers.host || 'letterboxd.local'}`)
  const target = requestUrl.searchParams.get('url')

  if (!target) {
    res.status(400).json({ error: 'Missing ?url=' })
    return
  }

  // SSRF guard: allow letterboxd.com and ltrbxd.com (including CDN subdomains)
  let parsed
  try {
    parsed = new URL(target)
  } catch {
    res.status(400).json({ error: 'Invalid url' })
    return
  }
  const isAllowed = /(?:^|\.)(?:letterboxd\.com|ltrbxd\.com)$/i.test(parsed.hostname)
  if (parsed.protocol !== 'https:' || !isAllowed) {
    res.status(403).json({ error: 'Only letterboxd.com and ltrbxd.com are allowed' })
    return
  }

  try {
    const upstream = await fetch(parsed.toString(), {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    })

    const contentType = upstream.headers.get('content-type') || 'text/html; charset=utf-8'
    const isBinary = contentType.toLowerCase().startsWith('image/')

    res.setHeader('Content-Type', contentType)
    res.setHeader('Access-Control-Allow-Origin', '*')
    // Watchlists change slowly; cache at the edge so repeat spins are instant.
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400')

    if (isBinary) {
      res.status(upstream.status).send(Buffer.from(await upstream.arrayBuffer()))
      return
    }

    res.status(upstream.status).send(await upstream.text())
  } catch (err) {
    res.status(502).json({ error: 'Upstream fetch failed', detail: String(err?.message || err) })
  }
}
