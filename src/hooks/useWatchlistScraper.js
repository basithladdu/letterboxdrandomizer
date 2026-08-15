import { useState, useCallback } from 'react'
import { scrapeAllPages } from '../services/letterboxdScraper.js'
import { normalizeLetterboxdUsername } from '../utils/letterboxdInput.js'

export function useWatchlistScraper() {
  const [films, setFilms] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState({ loaded: 0, total: 0 })

  const scrape = useCallback(async (usernames) => {
    const list = [...new Set(
      (Array.isArray(usernames) ? usernames : [usernames])
        .map(normalizeLetterboxdUsername)
        .filter(Boolean)
    )]

    setLoading(true)
    setError(null)
    setFilms([])
    setProgress({ loaded: 0, total: 0 })

    try {
      const progressByUser = new Map()
      const settledResults = await Promise.allSettled(list.map(async (username) => {
        const result = await scrapeAllPages(username, (loaded, total) => {
          progressByUser.set(username, { loaded, total })
          setProgress({
            loaded: [...progressByUser.values()].reduce((sum, item) => sum + item.loaded, 0),
            total: [...progressByUser.values()].reduce((sum, item) => sum + item.total, 0),
          })
        })

        if (result.length === 0) {
          throw new Error(`No films found for "${username}". Check the username or make the watchlist public.`)
        }

        return { username, films: result }
      }))

      const failed = settledResults.find((result) => result.status === 'rejected')
      if (failed) throw failed.reason

      const results = settledResults.map((result) => result.value)

      setFilms(results.flatMap(({ films }) => films))
      return results
    } catch (err) {
      setError(err.message || 'Failed to fetch watchlist')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const clearError = useCallback(() => setError(null), [])

  return { films, error, loading, progress, scrape, clearError }
}
