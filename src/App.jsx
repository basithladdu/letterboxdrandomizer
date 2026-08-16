import { useEffect, useRef, useState, useMemo } from 'react'
import Header from './components/layout/Header.jsx'
import Footer from './components/layout/Footer.jsx'
import InputTabs from './components/input/InputTabs.jsx'
import SpinWheel from './components/picker/SpinWheel.jsx'
import MovieCard, { ViewOnLetterboxd } from './components/picker/MovieCard.jsx'
import PickerControls from './components/picker/PickerControls.jsx'
import SharedFilmsList from './components/picker/SharedFilmsList.jsx'
import CreatorLinks from './components/picker/CreatorLinks.jsx'
import FollowDialog from './components/picker/FollowDialog.jsx'
import WatchlistRoaster from './components/picker/WatchlistRoaster.jsx'
import CinemaTicket from './components/picker/CinemaTicket.jsx'
import ShareBar from './components/picker/ShareBar.jsx'
import FilmBattle from './components/picker/FilmBattle.jsx'
import TinderSwipe from './components/picker/TinderSwipe.jsx'
import FilterBar from './components/picker/FilterBar.jsx'
import { useWatchlistScraper } from './hooks/useWatchlistScraper.js'
import { pickRandom } from './utils/randomPicker.js'
import { findSharedFilms, findGroupSharedFilms } from './utils/watchlistMatcher.js'
import { fetchFilmMetadata } from './services/letterboxdScraper.js'
import { motion, AnimatePresence } from 'framer-motion'
import { getSavedWatchlist, saveWatchlist, logUserSearch } from './services/firebase.js'
import AdminView from './components/admin/AdminView.jsx'
import { normalizeLetterboxdUsername } from './utils/letterboxdInput.js'

function getInitialTab() {
  if (typeof window === 'undefined') return 'solo'
  const path = window.location.pathname.toLowerCase().replace(/\/+$/, '')
  if (path === '/compare' || path === '/pair' || path === '/common') return 'compare'
  if (path === '/group' || path === '/mixer') return 'group'
  if (path === '/swipe' || path === '/match' || path === '/tinder' || path === '/battle') return 'swipe'
  return 'solo'
}

export default function App() {
  const [view, setView] = useState('input')
  const [currentTab, setCurrentTab] = useState(getInitialTab)
  const [films, setFilms] = useState([])
  const [chosen, setChosen] = useState(null)
  const [spinning, setSpinning] = useState(false)
  const [watchlistOwners, setWatchlistOwners] = useState([])
  const [watchlistError, setWatchlistError] = useState(null)
  const [showFollowDialog, setShowFollowDialog] = useState(false)
  const [activeDecade, setActiveDecade] = useState('all')
  const [activeRating, setActiveRating] = useState('all')
  const followTimerRef = useRef(null)

  const {
    scrape,
    loading: scrapeLoading,
    progress: scrapeProgress,
    error: scrapeError,
    clearError: clearScrapeError,
  } = useWatchlistScraper()

  // Filtered films pool based on cinephile filter pills
  const filteredFilms = useMemo(() => {
    return films.filter((f) => {
      if (activeDecade !== 'all') {
        const year = parseInt(f.year, 10)
        if (!year) return true
        if (activeDecade === 'classic' && year >= 1980) return false
        if (activeDecade === '80s' && (year < 1980 || year > 1989)) return false
        if (activeDecade === '90s' && (year < 1990 || year > 1999)) return false
        if (activeDecade === '00s' && (year < 2000 || year > 2009)) return false
        if (activeDecade === '10s' && (year < 2010 || year > 2019)) return false
        if (activeDecade === '20s' && year < 2020) return false
      }
      if (activeRating !== 'all') {
        const rating = parseFloat(f.rating)
        if (!rating) return true
        if (activeRating === '3.5' && rating < 3.5) return false
        if (activeRating === '4.0' && rating < 4.0) return false
      }
      return true
    })
  }, [films, activeDecade, activeRating])

  async function handleScrape(usernames, options = {}) {
    setWatchlistError(null)
    clearScrapeError()

    try {
      const normalizedUsernames = (Array.isArray(usernames) ? usernames : [usernames])
        .map(normalizeLetterboxdUsername)
        .filter(Boolean)

      if (normalizedUsernames.length === 0) {
        throw new Error('Enter a valid Letterboxd username, profile link, or list URL.')
      }

      if (normalizedUsernames.length > 6) {
        throw new Error('Group Movie Night supports up to 6 friends.')
      }

      // Check cached watchlists
      const cachedEntries = await Promise.all(
        normalizedUsernames.map(async (username) => ({
          username,
          films: await getSavedWatchlist(username),
        }))
      )

      const cachedByUsername = new Map(cachedEntries.map((entry) => [entry.username.toLowerCase(), entry.films]))
      const usernamesToScrape = normalizedUsernames.filter(
        (username) => !cachedByUsername.get(username.toLowerCase())
      )

      const scrapedEntries = usernamesToScrape.length ? await scrape(usernamesToScrape) : []
      const scrapedByUsername = new Map(
        scrapedEntries.map(({ username, films: result }) => [username.toLowerCase(), result])
      )

      const watchlistsWithOwners = normalizedUsernames.map((username) => {
        const key = username.toLowerCase()
        const result = cachedByUsername.get(key) || scrapedByUsername.get(key)

        if (!result?.length) {
          throw new Error(`No public films found for "${username}".`)
        }

        if (!cachedByUsername.get(key)) {
          saveWatchlist(username, result, result.meta)
        }

        return { username, films: result }
      })

      normalizedUsernames.forEach((username) => logUserSearch(username))

      // 0. Swipe / Tinder Dating Deck Mode
      if (options.mode === 'swipe' || options.isMatch || options.mode === 'match' || options.isBattle) {
        const userFilms = watchlistsWithOwners[0].films
        if (userFilms.length < 2) {
          throw new Error(`Watchlist for "${normalizedUsernames[0]}" needs at least 2 films to start Swipe deck.`)
        }
        setWatchlistOwners(normalizedUsernames)
        setFilms(userFilms)
        window.clearTimeout(followTimerRef.current)
        setShowFollowDialog(false)
        setView('swipe')
        return
      }

      // 1. Solo Watchlist / Custom List
      if (normalizedUsernames.length === 1) {
        const userFilms = watchlistsWithOwners[0].films
        setWatchlistOwners(normalizedUsernames)
        setFilms(userFilms)
        startPicker(userFilms)
        return
      }

      // 2. Pair Comparison (2 Users)
      if (normalizedUsernames.length === 2) {
        const sharedFilms = findSharedFilms(
          watchlistsWithOwners[0].films,
          watchlistsWithOwners[1].films,
          normalizedUsernames
        )

        if (sharedFilms.length === 0) {
          throw new Error(
            `No common films found between ${normalizedUsernames[0]} and ${normalizedUsernames[1]}.`
          )
        }

        setWatchlistOwners(normalizedUsernames)
        setFilms(sharedFilms)
        startPicker(sharedFilms)
        return
      }

      // 3. Group Movie Night (3-6 Users)
      const groupMode = options.groupMode || 'majority'
      let matchingFilms = findGroupSharedFilms(watchlistsWithOwners, { mode: groupMode, minOverlap: 2 })

      // Graceful fallback if 100% intersection yielded 0
      if (matchingFilms.length === 0 && groupMode === 'intersection') {
        matchingFilms = findGroupSharedFilms(watchlistsWithOwners, { mode: 'majority', minOverlap: 2 })
      }

      if (matchingFilms.length === 0) {
        throw new Error(
          `No matching films found across the ${normalizedUsernames.length} watchlists. Try adding more films or switching to majority mode!`
        )
      }

      setWatchlistOwners(normalizedUsernames)
      setFilms(matchingFilms)
      startPicker(matchingFilms)
    } catch (error) {
      setWatchlistError(error.message || 'Could not find matching films in those watchlists.')
    }
  }

  function startPicker(filmList) {
    window.clearTimeout(followTimerRef.current)
    setShowFollowDialog(false)
    const pool = filmList.length ? filmList : films
    const pick = pickRandom(pool)
    setChosen(pick)
    setSpinning(true)
    setView('picker')
  }

  function handleSpinAgain() {
    window.clearTimeout(followTimerRef.current)
    setShowFollowDialog(false)
    const pool = filteredFilms.length ? filteredFilms : films
    const pick = pickRandom(pool)
    setChosen(pick)
    setSpinning(true)
  }

  function handleSpinComplete() {
    setSpinning(false)
    window.clearTimeout(followTimerRef.current)
    followTimerRef.current = window.setTimeout(() => setShowFollowDialog(true), 2500)
  }

  function handleSwipeMatch(matchedFilm) {
    setChosen(matchedFilm)
    setSpinning(false)
    setView('picker')
    window.clearTimeout(followTimerRef.current)
    followTimerRef.current = window.setTimeout(() => setShowFollowDialog(true), 2500)
  }

  function handleReset() {
    setView('input')
    setFilms([])
    setChosen(null)
    setSpinning(false)
    setWatchlistOwners([])
    setWatchlistError(null)
    setActiveDecade('all')
    setActiveRating('all')
    window.clearTimeout(followTimerRef.current)
    setShowFollowDialog(false)
    clearScrapeError()
  }

  function handleHome() {
    handleReset()
    if (typeof window !== 'undefined' && window.location.pathname !== '/') {
      window.history.pushState({}, '', '/')
      setCurrentTab('solo')
    }
  }

  // Load enriched OMDB metadata when chosen film is updated
  useEffect(() => {
    if (!chosen || chosen.overview || !chosen.letterboxdSlug) return

    let cancelled = false
    fetchFilmMetadata(chosen.letterboxdSlug).then((meta) => {
      if (cancelled || !meta) return
      setChosen((prev) => (prev && prev.letterboxdSlug === chosen.letterboxdSlug ? { ...prev, ...meta } : prev))
    })

    return () => {
      cancelled = true
    }
  }, [chosen?.letterboxdSlug])

  const isPair = watchlistOwners.length === 2
  const isGroup = watchlistOwners.length >= 3
  const inputError = watchlistError || scrapeError

  return (
    <div className="flex flex-col min-h-screen bg-retro-gray text-retro-black font-sans">
      <Header onHome={handleHome} />

      <main className="flex-1 px-3 sm:px-4 py-4 sm:py-6 max-w-4xl w-full mx-auto">
        <AnimatePresence mode="wait">
          {view === 'admin' ? (
            <motion.div
              key="admin"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <AdminView />
            </motion.div>
          ) : view === 'swipe' ? (
            <motion.div
              key="swipe"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.25 }}
              className="mx-auto max-w-2xl space-y-4"
            >
              <button
                type="button"
                onClick={handleReset}
                className="retro-outset px-3 py-2 text-xs font-black uppercase tracking-widest text-retro-black bg-retro-gray hover:bg-retro-yellow"
                aria-label="Exit swipe deck"
              >
                &larr; EXIT SWIPE
              </button>

              <TinderSwipe
                films={films}
                onMatch={handleSwipeMatch}
                onReset={handleReset}
              />
            </motion.div>
          ) : view === 'input' ? (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.25 }}
              className="mx-auto max-w-2xl space-y-3 sm:space-y-6"
            >
              <div className="relative retro-outset-deep bg-retro-panelYellow p-4 sm:p-8 text-center space-y-2 sm:space-y-4 border-4">
                <div className="absolute -top-3 right-4 badge-new px-2 py-1 text-[10px]">
                  NOW LIVE
                </div>
                <h1 className="text-3xl sm:text-6xl font-black text-rainbow uppercase tracking-tight" style={{ textShadow: '2px 2px 0 #808080' }}>
                  WHAT SHOULD I WATCH?
                </h1>
                <p className="text-sm sm:text-lg font-bold text-retro-black uppercase">
                  PICK FROM WATCHLIST, SWIPE DECK, OR GROUP MOVIE NIGHT
                </p>
                <div className="text-xs font-mono text-retro-muted">
                  Pick a random film, find common films with friends, swipe left/right on your watchlist, or pool watchlists with up to 6 friends.
                </div>
              </div>

              <InputTabs
                activeTab={currentTab}
                onTabChange={setCurrentTab}
                onScrape={handleScrape}
                scrapeLoading={scrapeLoading}
                scrapeProgress={scrapeProgress}
                scrapeError={inputError}
              />

              <div className="grid grid-cols-3 sm:grid-cols-6 gap-1 sm:gap-2 mt-4 sm:mt-6">
                {['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'].map((color, i) => (
                  <div
                    key={i}
                    className="aspect-square retro-outset border-2"
                    style={{ backgroundColor: color, borderColor: color === '#FFFF00' ? '#808080 #FFFFFF #FFFFFF #808080' : '#FFFFFF #808080 #808080 #FFFFFF' }}
                  />
                ))}
              </div>

              <CreatorLinks />
            </motion.div>
          ) : (
            <motion.div
              key="picker"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.25 }}
              className="mx-auto max-w-2xl space-y-3 sm:space-y-6"
            >
              <button
                type="button"
                onClick={handleReset}
                className="retro-outset px-3 py-2 text-xs font-black uppercase tracking-widest text-retro-black bg-retro-gray hover:bg-retro-yellow"
                aria-label="Go back to the watchlist input"
              >
                &larr; BACK
              </button>

              <div className="retro-outset bg-retro-panelYellow border-2 px-2 py-2 sm:px-3 sm:py-2 flex flex-wrap items-center justify-between gap-1.5 font-mono">
                <p className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-retro-black">
                  {isGroup
                    ? `GROUP MOVIE NIGHT (${watchlistOwners.length} FRIENDS)`
                    : isPair
                    ? 'COMMON FILMS'
                    : 'WATCHLIST PICKER'}
                </p>
                <p className="text-[10px] sm:text-xs font-mono text-retro-black break-words text-right">
                  {watchlistOwners.join(' + ')} &mdash; {films.length}{' '}
                  {isGroup || isPair
                    ? `MATCHING FILM${films.length === 1 ? '' : 'S'}`
                    : `FILM${films.length === 1 ? '' : 'S'}`}
                </p>
              </div>

              {/* Watchlist Roaster & Quick Stats Diagnostic */}
              <WatchlistRoaster films={films} watchlistOwners={watchlistOwners} />

              {/* Cinephile Filters */}
              <FilterBar
                films={filteredFilms}
                activeDecade={activeDecade}
                onDecadeChange={setActiveDecade}
                activeRating={activeRating}
                onRatingChange={setActiveRating}
              />

              <div className="retro-hr" />

              {spinning ? (
                <>
                  <div className="retro-outset-deep bg-retro-gray border-4 overflow-hidden">
                    <div className="retro-titlebar px-3 py-2 flex justify-between items-center">
                      <span className="font-bold uppercase">SPIN_WHEEL.EXE</span>
                      <div className="flex gap-2">
                        <div className="w-4 h-4 retro-outset bg-retro-yellow" />
                        <div className="w-4 h-4 retro-outset bg-retro-yellow" />
                        <div className="w-4 h-4 retro-outset bg-retro-red" />
                      </div>
                    </div>
                    <div className="p-6 retro-inset bg-retro-white">
                      <SpinWheel
                        films={filteredFilms.length ? filteredFilms : films}
                        chosen={chosen}
                        spinning={spinning}
                        onComplete={handleSpinComplete}
                      />
                    </div>
                  </div>
                </>
              ) : (
                <AnimatePresence>
                  {chosen && (
                    <div className="space-y-4">
                      <MovieCard key={chosen.letterboxdSlug + chosen.title} film={chosen} />

                      {/* Retro Cinema Ticket Stub with built-in PNG Export and WEDEVIT.IN branding */}
                      <CinemaTicket film={chosen} watchlistOwners={watchlistOwners} />
                    </div>
                  )}
                </AnimatePresence>
              )}

              <PickerControls
                onSpin={handleSpinAgain}
                onSwipeDeck={() => setView('swipe')}
                onReset={handleReset}
                spinning={spinning}
                filmsCount={filteredFilms.length || films.length}
              />

              {!spinning && chosen && <ViewOnLetterboxd film={chosen} />}

              {!spinning && (
                <ShareBar film={chosen} watchlistOwners={watchlistOwners} />
              )}

              {(isGroup || isPair) && (
                <SharedFilmsList films={films} watchlistOwners={watchlistOwners} />
              )}

            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
      {showFollowDialog && <FollowDialog onClose={() => setShowFollowDialog(false)} />}
    </div>
  )
}
