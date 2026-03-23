import { useState, useCallback } from 'react'
import { scrapeAllPages } from '../services/letterboxdScraper.js'

export function useWatchlistScraper() {
  const [films, setFilms] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState({ loaded: 0, total: 0 })

  const scrape = useCallback(async (username) => {
    setLoading(true)
    setError(null)
    setFilms([])
    setProgress({ loaded: 0, total: 0 })

    try {
      const result = await scrapeAllPages(username, (loaded, total) => {
        setProgress({ loaded, total })
      })

      if (result.length === 0) {
        throw new Error(`No films found for "${username}". Check the username or make the watchlist public.`)
      }

      setFilms(result)
      return result
    } catch (err) {
      setError(err.message || 'Failed to fetch watchlist')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return { films, error, loading, progress, scrape }
}
