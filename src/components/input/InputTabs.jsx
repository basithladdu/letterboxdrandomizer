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
            px-3 sm:px-4 py-2 text-[10px] sm:text-xs font-bold uppercase tracking-widest
            transition-none border-t-2 border-x-2
            ${activeTab === 'solo'
              ? 'bg-retro-gray border-retro-white shadow-[0_-2px_0_#FFF] translate-y-[2px] z-10'
              : 'bg-retro-muted border-retro-muted opacity-60'}
          `}
          style={{
            borderColor: activeTab === 'solo' ? '#FFFFFF #808080 transparent #FFFFFF' : '#808080'
          }}
        >
          Watchlist Picker
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('compare')}
          className={`
            px-3 sm:px-4 py-2 text-[10px] sm:text-xs font-bold uppercase tracking-widest
            transition-none border-t-2 border-x-2
            ${activeTab === 'compare'
              ? 'bg-retro-gray border-retro-white shadow-[0_-2px_0_#FFF] translate-y-[2px] z-10'
              : 'bg-retro-muted border-retro-muted opacity-60'}
          `}
          style={{
            borderColor: activeTab === 'compare' ? '#FFFFFF #808080 transparent #FFFFFF' : '#808080'
          }}
        >
          Common Films (2)
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('group')}
          className={`
            px-3 sm:px-4 py-2 text-[10px] sm:text-xs font-black uppercase tracking-widest
            transition-none border-t-2 border-x-2 flex items-center gap-1
            ${activeTab === 'group'
              ? 'bg-retro-gray border-retro-white shadow-[0_-2px_0_#FFF] translate-y-[2px] z-10 text-retro-black'
              : 'bg-retro-muted border-retro-muted opacity-60'}
          `}
          style={{
            borderColor: activeTab === 'group' ? '#FFFFFF #808080 transparent #FFFFFF' : '#808080'
          }}
        >
          <span>🍿 Group Movie Night</span>
          <span className="bg-retro-red text-retro-white text-[8px] px-1 py-0.2">3-6</span>
        </button>
      </div>

      <div className="relative">
        <UsernameForm
          key={activeTab}
          mode={activeTab}
          onSubmit={onScrape}
          loading={scrapeLoading}
        />
      </div>

      {scrapeLoading && (
        <ProgressBar
          loaded={scrapeProgress.loaded}
          total={scrapeProgress.total}
          label={
            activeTab === 'group'
              ? 'Fetching group watchlists concurrently...'
              : activeTab === 'compare'
              ? 'Fetching both public watchlists...'
              : 'Fetching watchlist pages...'
          }
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
