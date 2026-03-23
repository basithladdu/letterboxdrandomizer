const API_KEY = import.meta.env.VITE_OMDB_API_KEY || ''

export async function fetchPoster(title, year) {
  if (!API_KEY) return null

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
    // Silently fail — UI shows placeholder
  }

  return null
}
