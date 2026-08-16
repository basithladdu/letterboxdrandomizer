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
      <div className="grid grid-cols-3 gap-1 px-1">
        <button
          type="button"
          onClick={() => setActiveTab('solo')}
          className={`
            px-1.5 sm:px-3 py-2 text-[9px] sm:text-xs font-bold uppercase tracking-wider text-center
            transition-none border-t-2 border-x-2 truncate
            ${activeTab === 'solo'
              ? 'bg-retro-gray border-retro-white shadow-[0_-2px_0_#FFF] translate-y-[2px] z-10 text-retro-black'
              : 'bg-retro-muted border-retro-muted opacity-60'}
          `}
          style={{
            borderColor: activeTab === 'solo' ? '#FFFFFF #808080 transparent #FFFFFF' : '#808080'
          }}
          title="Watchlist Picker"
        >
          Solo Picker
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('compare')}
          className={`
            px-1.5 sm:px-3 py-2 text-[9px] sm:text-xs font-bold uppercase tracking-wider text-center
            transition-none border-t-2 border-x-2 truncate
            ${activeTab === 'compare'
              ? 'bg-retro-gray border-retro-white shadow-[0_-2px_0_#FFF] translate-y-[2px] z-10 text-retro-black'
              : 'bg-retro-muted border-retro-muted opacity-60'}
          `}
          style={{
            borderColor: activeTab === 'compare' ? '#FFFFFF #808080 transparent #FFFFFF' : '#808080'
          }}
          title="Common Films (2 Users)"
        >
          Common (2)
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('group')}
          className={`
            px-1.5 sm:px-3 py-2 text-[9px] sm:text-xs font-black uppercase tracking-wider text-center
            transition-none border-t-2 border-x-2 flex items-center justify-center gap-1 truncate
            ${activeTab === 'group'
              ? 'bg-retro-gray border-retro-white shadow-[0_-2px_0_#FFF] translate-y-[2px] z-10 text-retro-black'
              : 'bg-retro-muted border-retro-muted opacity-60'}
          `}
          style={{
            borderColor: activeTab === 'group' ? '#FFFFFF #808080 transparent #FFFFFF' : '#808080'
          }}
          title="Group Movie Night (3-6 Friends)"
        >
          <span className="truncate">🍿 Group (3-6)</span>
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
