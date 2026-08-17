const API_KEY = import.meta.env.VITE_OMDB_API_KEY || ''

async function fetchItunesPoster(title, year) {
  try {
    const query = year ? `${title} ${year}` : title
    const res = await fetch(
      `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=movie&limit=1`
    )
    if (!res.ok) return null
    const data = await res.json()
    if (data.results && data.results.length > 0) {
      const art = data.results[0].artworkUrl100
      if (art) {
        return art.replace('100x100bb', '600x600bb')
      }
    }
  } catch {
    // Silently fail
  }
  return null
}

export async function fetchPoster(title, year) {
  if (!title) return null

  // 1. Try OMDB if API key is provided
  if (API_KEY) {
    try {
      const params = new URLSearchParams({
        apikey: API_KEY,
        t: title,
        type: 'movie',
      })
      if (year) params.set('y', year)

      const isDev = import.meta.env.DEV
      const base = isDev ? '/omdb-proxy' : 'https://www.omdbapi.com'
      const res = await fetch(`${base}/?${params}`)
      const data = await res.json()

      if (data.Response === 'True' && data.Poster && data.Poster !== 'N/A') {
        return data.Poster
      }
    } catch {
      // Fallback to iTunes
    }
  }

  // 2. Free, high-speed iTunes movie poster fallback (requires 0 API keys)
  return await fetchItunesPoster(title, year)
}
