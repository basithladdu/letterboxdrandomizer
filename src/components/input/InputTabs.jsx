import { useState, useEffect } from 'react'
import UsernameForm from './UsernameForm.jsx'
import CSVUploadForm from './CSVUploadForm.jsx'
import ProgressBar from '../shared/ProgressBar.jsx'
import ErrorBanner from '../shared/ErrorBanner.jsx'

export default function InputTabs({ scrapeLoading, scrapeProgress, scrapeError, onScrape, onUpload }) {
  const [activeTab, setActiveTab] = useState('username')
  const [visibleError, setVisibleError] = useState(null)

  useEffect(() => {
    if (scrapeError) {
      setVisibleError(scrapeError)
      const timer = setTimeout(() => setVisibleError(null), 6000)
      return () => clearTimeout(timer)
    }
  }, [scrapeError])

  return (
    <div className="w-full max-w-lg mx-auto space-y-5">
      {/* Tabs */}
      <div className="flex gap-1 px-1">
        <button
          onClick={() => setActiveTab('username')}
          className={`
            px-4 py-2 text-[10px] sm:text-xs font-bold uppercase tracking-widest
            transition-none border-t-2 border-x-2
            ${activeTab === 'username' 
              ? 'bg-retro-gray border-retro-white shadow-[0_-2px_0_#FFF] translate-y-[2px] z-10' 
              : 'bg-retro-muted border-retro-muted opacity-60'}
          `}
          style={{
            borderColor: activeTab === 'username' ? '#FFFFFF #808080 transparent #FFFFFF' : '#808080'
          }}
        >
          Username
        </button>
        <button
          onClick={() => setActiveTab('csv')}
          className={`
            px-4 py-2 text-[10px] sm:text-xs font-bold uppercase tracking-widest
            transition-none border-t-2 border-x-2
            ${activeTab === 'csv' 
              ? 'bg-retro-gray border-retro-white shadow-[0_-2px_0_#FFF] translate-y-[2px] z-10' 
              : 'bg-retro-muted border-retro-muted opacity-60'}
          `}
          style={{
            borderColor: activeTab === 'csv' ? '#FFFFFF #808080 transparent #FFFFFF' : '#808080'
          }}
        >
          CSV Upload
        </button>
      </div>

      <div className="relative">
        {activeTab === 'username' ? (
          <UsernameForm onSubmit={onScrape} loading={scrapeLoading} />
        ) : (
          <CSVUploadForm onUpload={onUpload} />
        )}
      </div>

      {scrapeLoading && (
        <ProgressBar
          loaded={scrapeProgress.loaded}
          total={scrapeProgress.total}
          label="Scraping watchlist pages…"
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
