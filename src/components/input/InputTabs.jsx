import { useState, useEffect } from 'react'
import UsernameForm from './UsernameForm.jsx'
import ProgressBar from '../shared/ProgressBar.jsx'
import ErrorBanner from '../shared/ErrorBanner.jsx'

export default function InputTabs({ scrapeLoading, scrapeProgress, scrapeError, onScrape }) {
  const [activeTab, setActiveTab] = useState('solo')
  const [visibleError, setVisibleError] = useState(null)

  useEffect(() => {
    if (scrapeError) {
      setVisibleError(scrapeError)
    }
  }, [scrapeError])

  return (
    <div className="w-full max-w-lg mx-auto space-y-5">
      <div className="flex gap-1 px-1 flex-wrap">
        <button
          type="button"
          onClick={() => setActiveTab('solo')}
          className={`
            px-4 py-2 text-[10px] sm:text-xs font-bold uppercase tracking-widest
            transition-none border-t-2 border-x-2
            ${activeTab === 'solo'
              ? 'bg-retro-gray border-retro-white shadow-[0_-2px_0_#FFF] translate-y-[2px] z-10'
              : 'bg-retro-muted border-retro-muted opacity-60'}
          `}
          style={{
            borderColor: activeTab === 'solo' ? '#FFFFFF #808080 transparent #FFFFFF' : '#808080'
          }}
        >
          Random Film
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('compare')}
          className={`
            px-4 py-2 text-[10px] sm:text-xs font-bold uppercase tracking-widest
            transition-none border-t-2 border-x-2
            ${activeTab === 'compare'
              ? 'bg-retro-gray border-retro-white shadow-[0_-2px_0_#FFF] translate-y-[2px] z-10'
              : 'bg-retro-muted border-retro-muted opacity-60'}
          `}
          style={{
            borderColor: activeTab === 'compare' ? '#FFFFFF #808080 transparent #FFFFFF' : '#808080'
          }}
        >
          Common Films
        </button>
      </div>

      <div className="relative">
        {activeTab === 'solo' ? (
          <UsernameForm mode="solo" onSubmit={onScrape} loading={scrapeLoading} />
        ) : activeTab === 'compare' ? (
          <UsernameForm mode="compare" onSubmit={onScrape} loading={scrapeLoading} />
        ) : null}
      </div>

      {scrapeLoading && (
        <ProgressBar
          loaded={scrapeProgress.loaded}
          total={scrapeProgress.total}
          label={activeTab === 'compare' ? 'Fetching both public watchlists...' : 'Fetching watchlist pages...'}
        />
      )}

      {visibleError && (
        <ErrorBanner
          message={visibleError}
          onDismiss={() => setVisibleError(null)}
        />
      )}
    </div>
  )
}
