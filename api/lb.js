// Serverless CORS proxy for Letterboxd.
// Public CORS proxies (allorigins, codetabs, thingproxy, corsproxy.io) are
// rate-limited or dead, which silently truncated large watchlists. This runs
// server-side so there is no CORS restriction and no third-party quota.

const ALLOWED_HOST = 'letterboxd.com'

export default async function handler(req, res) {
  const target = req.query.url

  if (!target) {
    res.status(400).json({ error: 'Missing ?url=' })
    return
  }

  // SSRF guard: only ever fetch Letterboxd over https.
  let parsed
  try {
    parsed = new URL(target)
  } catch {
    res.status(400).json({ error: 'Invalid url' })
    return
  }
  if (parsed.protocol !== 'https:' || (parsed.hostname !== ALLOWED_HOST && parsed.hostname !== `www.${ALLOWED_HOST}`)) {
    res.status(403).json({ error: 'Only letterboxd.com is allowed' })
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

    const body = await upstream.text()

    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    res.setHeader('Access-Control-Allow-Origin', '*')
    // Watchlists change slowly; cache at the edge so repeat spins are instant.
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400')
    res.status(upstream.status).send(body)
  } catch (err) {
    res.status(502).json({ error: 'Upstream fetch failed', detail: String(err?.message || err) })
  }
}
