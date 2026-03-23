import { useState, useEffect } from 'react'
import UsernameForm from './UsernameForm.jsx'
import ProgressBar from '../shared/ProgressBar.jsx'
import ErrorBanner from '../shared/ErrorBanner.jsx'

export default function InputTabs({ scrapeLoading, scrapeProgress, scrapeError, onScrape }) {
  const [visibleError, setVisibleError] = useState(null)

  // Auto-clear error after 6 seconds
  useEffect(() => {
    if (scrapeError) {
      setVisibleError(scrapeError)
      const timer = setTimeout(() => setVisibleError(null), 6000)
      return () => clearTimeout(timer)
    }
  }, [scrapeError])

  return (
    <div className="w-full max-w-lg mx-auto space-y-5">
      {/* Username form */}
      <UsernameForm onSubmit={onScrape} loading={scrapeLoading} />

      {/* Progress (scraping) */}
      {scrapeLoading && (
        <ProgressBar
          loaded={scrapeProgress.loaded}
          total={scrapeProgress.total}
          label="Scraping watchlist pages…"
        />
      )}

      {/* Errors */}
      {visibleError && (
        <ErrorBanner
          message={visibleError}
          onDismiss={() => setVisibleError(null)}
        />
      )}
    </div>
  )
}
