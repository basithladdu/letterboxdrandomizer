import { useState, useEffect } from 'react'
import UsernameForm from './UsernameForm.jsx'
import ProgressBar from '../shared/ProgressBar.jsx'
import ErrorBanner from '../shared/ErrorBanner.jsx'

function getTabFromPath() {
  if (typeof window === 'undefined') return 'solo'
  const path = window.location.pathname.toLowerCase().replace(/\/+$/, '')
  if (path === '/compare' || path === '/pair' || path === '/common') return 'compare'
  if (path === '/group' || path === '/mixer') return 'group'
  if (path === '/battle' || path === '/tinder' || path === '/bracket') return 'battle'
  return 'solo'
}

export default function InputTabs({ scrapeLoading, scrapeProgress, scrapeError, onScrape, activeTab: parentTab, onTabChange }) {
  const [activeTab, setActiveTab] = useState(parentTab || getTabFromPath())
  const [visibleError, setVisibleError] = useState(null)

  useEffect(() => {
    if (parentTab && parentTab !== activeTab) {
      setActiveTab(parentTab)
    }
  }, [parentTab])

  useEffect(() => {
    if (scrapeError) {
      setVisibleError(scrapeError)
    }
  }, [scrapeError])

  // Sync tab with browser URL history
  useEffect(() => {
    const handlePopState = () => {
      const tab = getTabFromPath()
      setActiveTab(tab)
      onTabChange?.(tab)
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [onTabChange])

  const switchTab = (tab) => {
    setActiveTab(tab)
    onTabChange?.(tab)
    const pathMap = {
      solo: '/',
      compare: '/compare',
      group: '/group',
      battle: '/battle',
    }
    const target = pathMap[tab] || '/'
    if (window.location.pathname !== target) {
      window.history.pushState({ tab }, '', target)
    }
  }

  return (
    <div className="w-full max-w-xl mx-auto space-y-5">
      {/* 4 Subtabs Side-by-Side in Responsive Grid */}
      <div className="grid grid-cols-4 gap-1 px-1">
        <button
          type="button"
          onClick={() => switchTab('solo')}
          className={`
            px-1 sm:px-2 py-2 text-[9px] sm:text-xs font-bold uppercase tracking-wider text-center
            transition-none border-t-2 border-x-2 truncate
            ${activeTab === 'solo'
              ? 'bg-retro-gray border-retro-white shadow-[0_-2px_0_#FFF] translate-y-[2px] z-10 text-retro-black'
              : 'bg-retro-muted border-retro-muted opacity-60'}
          `}
          style={{
            borderColor: activeTab === 'solo' ? '#FFFFFF #808080 transparent #FFFFFF' : '#808080'
          }}
          title="Watchlist Picker (Solo)"
        >
          Solo
        </button>

        <button
          type="button"
          onClick={() => switchTab('compare')}
          className={`
            px-1 sm:px-2 py-2 text-[9px] sm:text-xs font-bold uppercase tracking-wider text-center
            transition-none border-t-2 border-x-2 truncate
            ${activeTab === 'compare'
              ? 'bg-retro-gray border-retro-white shadow-[0_-2px_0_#FFF] translate-y-[2px] z-10 text-retro-black'
              : 'bg-retro-muted border-retro-muted opacity-60'}
          `}
          style={{
            borderColor: activeTab === 'compare' ? '#FFFFFF #808080 transparent #FFFFFF' : '#808080'
          }}
          title="Common Films (2 Friends)"
        >
          Pair (2)
        </button>

        <button
          type="button"
          onClick={() => switchTab('group')}
          className={`
            px-1 sm:px-2 py-2 text-[9px] sm:text-xs font-black uppercase tracking-wider text-center
            transition-none border-t-2 border-x-2 truncate
            ${activeTab === 'group'
              ? 'bg-retro-gray border-retro-white shadow-[0_-2px_0_#FFF] translate-y-[2px] z-10 text-retro-black'
              : 'bg-retro-muted border-retro-muted opacity-60'}
          `}
          style={{
            borderColor: activeTab === 'group' ? '#FFFFFF #808080 transparent #FFFFFF' : '#808080'
          }}
          title="Group Movie Night (3-6 Friends)"
        >
          🍿 Group (3-6)
        </button>

        <button
          type="button"
          onClick={() => switchTab('battle')}
          className={`
            px-1 sm:px-2 py-2 text-[9px] sm:text-xs font-black uppercase tracking-wider text-center
            transition-none border-t-2 border-x-2 truncate
            ${activeTab === 'battle'
              ? 'bg-retro-gray border-retro-white shadow-[0_-2px_0_#FFF] translate-y-[2px] z-10 text-retro-black'
              : 'bg-retro-muted border-retro-muted opacity-60'}
          `}
          style={{
            borderColor: activeTab === 'battle' ? '#FFFFFF #808080 transparent #FFFFFF' : '#808080'
          }}
          title="Watchlist Battle (1v1 Elimination / Tinder Mode)"
        >
          🥊 Battle (1v1)
        </button>
      </div>

      <div className="relative">
        <UsernameForm
          key={activeTab}
          mode={activeTab}
          onSubmit={(usernames, options) => onScrape(usernames, { ...options, mode: activeTab })}
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
              : activeTab === 'battle'
              ? 'Seeding contenders for Watchlist Battle...'
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
