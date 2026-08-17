import { useState, useEffect } from 'react'
import UsernameForm from './UsernameForm.jsx'
import ProgressBar from '../shared/ProgressBar.jsx'
import ErrorBanner from '../shared/ErrorBanner.jsx'

function getTabFromPath() {
  if (typeof window === 'undefined') return 'solo'
  const path = window.location.pathname.toLowerCase().replace(/\/+$/, '')
  if (path === '/compare' || path === '/pair' || path === '/common') return 'compare'
  if (path === '/group' || path === '/mixer') return 'group'
  if (path === '/swipe' || path === '/match' || path === '/tinder') return 'swipe'
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
      swipe: '/swipe',
    }
    const target = pathMap[tab] || '/'
    if (window.location.pathname !== target) {
      window.history.pushState({ tab }, '', target)
    }
  }

  const tabs = [
    { id: 'solo', label: 'SOLO' },
    { id: 'compare', label: 'PAIR (2)' },
    { id: 'group', label: 'GROUP (3-6)' },
    { id: 'swipe', label: 'SWIPE' },
  ]

  return (
    <div className="w-full max-w-xl mx-auto space-y-4 font-sans">
      {/* 4 Clean Subtabs Side-by-Side Without Overflow or Clipping */}
      <div className="grid grid-cols-4 gap-1 px-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => switchTab(tab.id)}
              className={`
                px-1 sm:px-3 py-2 text-[10px] sm:text-xs font-black uppercase tracking-wider text-center
                transition-none border-t-2 border-x-2 flex items-center justify-center
                ${isActive
                  ? 'bg-retro-gray border-retro-white shadow-[0_-2px_0_#FFF] translate-y-[2px] z-10 text-retro-black'
                  : 'bg-retro-muted border-retro-muted text-neutral-800 opacity-70 hover:opacity-100'}
              `}
              style={{
                borderColor: isActive ? '#FFFFFF #808080 transparent #FFFFFF' : '#808080'
              }}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      <div className="relative">
        <UsernameForm
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
              ? 'FETCHING GROUP WATCHLISTS...'
              : activeTab === 'compare'
              ? 'FETCHING BOTH WATCHLISTS...'
              : activeTab === 'swipe'
              ? 'LOADING SWIPE DECK...'
              : 'FETCHING WATCHLIST...'
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
