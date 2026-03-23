import { useState, useCallback } from 'react'
import Papa from 'papaparse'
import { normalizeRows } from '../utils/csvNormalizer.js'

export function useCsvParser() {
  const [films, setFilms] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const parse = useCallback((file) => {
    return new Promise((resolve, reject) => {
      setLoading(true)
      setError(null)

      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete(results) {
          setLoading(false)
          if (results.errors.length && results.data.length === 0) {
            const msg = 'Could not parse CSV. Make sure it\'s a Letterboxd watchlist export.'
            setError(msg)
            reject(new Error(msg))
            return
          }

          const normalized = normalizeRows(results.data)
          if (normalized.length === 0) {
            const msg = 'No films found in this CSV. Is it a Letterboxd watchlist export?'
            setError(msg)
            reject(new Error(msg))
            return
          }

          setFilms(normalized)
          resolve(normalized)
        },
        error(err) {
          setLoading(false)
          setError(err.message)
          reject(err)
        },
      })
    })
  }, [])

  return { films, error, loading, parse }
}
