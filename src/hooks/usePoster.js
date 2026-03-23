import { useState, useEffect } from 'react'
import { fetchPoster } from '../services/omdbService.js'

export function usePoster(film) {
  const [posterUrl, setPosterUrl] = useState(film?.posterUrl || null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!film) {
      setPosterUrl(null)
      return
    }

    // Use scraped poster if available
    if (film.posterUrl) {
      setPosterUrl(film.posterUrl)
      return
    }

    // Fallback: try OMDb
    let cancelled = false
    setLoading(true)

    fetchPoster(film.title, film.year).then((url) => {
      if (!cancelled) {
        setPosterUrl(url)
        setLoading(false)
      }
    })

    return () => { cancelled = true }
  }, [film?.title, film?.year, film?.posterUrl])

  return { posterUrl, loading }
}
