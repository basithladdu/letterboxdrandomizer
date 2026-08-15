import { useEffect, useRef, useState } from 'react'
import Header from './components/layout/Header.jsx'
import Footer from './components/layout/Footer.jsx'
import InputTabs from './components/input/InputTabs.jsx'
import SpinWheel from './components/picker/SpinWheel.jsx'
import MovieCard, { ViewOnLetterboxd } from './components/picker/MovieCard.jsx'
import PickerControls from './components/picker/PickerControls.jsx'
import SharedFilmsList from './components/picker/SharedFilmsList.jsx'
import CreatorLinks from './components/picker/CreatorLinks.jsx'
import FollowDialog from './components/picker/FollowDialog.jsx'
import { useWatchlistScraper } from './hooks/useWatchlistScraper.js'
import { pickRandom } from './utils/randomPicker.js'
import { findSharedFilms } from './utils/watchlistMatcher.js'
import { fetchFilmMetadata } from './services/letterboxdScraper.js'
import { motion, AnimatePresence } from 'framer-motion'
import { getSavedWatchlist, saveWatchlist, logUserSearch } from './services/firebase.js'
import AdminView from './components/admin/AdminView.jsx'
import { normalizeLetterboxdUsername } from './utils/letterboxdInput.js'

export default function App() {
  const [view, setView] = useState('input')
  const [films, setFilms] = useState([])
  const [chosen, setChosen] = useState(null)
  const [spinning, setSpinning] = useState(false)
  const [watchlistOwners, setWatchlistOwners] = useState([])
  const [watchlistError, setWatchlistError] = useState(null)
  const [showFollowDialog, setShowFollowDialog] = useState(false)
  const followTimerRef = useRef(null)

  const {
    scrape,
    loading: scrapeLoading,
    progress: scrapeProgress,
    error: scrapeError,
    clearError: clearScrapeError,
  } = useWatchlistScraper()

  async function handleScrape(usernames) {
    setWatchlistError(null)
    clearScrapeError()

    try {
      const normalizedUsernames = (Array.isArray(usernames) ? usernames : [usernames])
        .map(normalizeLetterboxdUsername)
        .filter(Boolean)

      if (normalizedUsernames.length === 0) {
        throw new Error('Enter a valid Letterboxd username or profile link.')
      }

      if (normalizedUsernames.length > 2) {
        throw new Error('Use one username for Watchlist Picker or two usernames for Common Films.')
      }

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

      const watchlists = normalizedUsernames.map((username) => {
        const key = username.toLowerCase()
        const result = cachedByUsername.get(key) || scrapedByUsername.get(key)

        if (!result?.length) {
          throw new Error(`No public films found for "${username}".`)
        }

        if (!cachedByUsername.get(key)) {
          saveWatchlist(username, result, result.meta)
        }

        return result
      })

      normalizedUsernames.forEach((username) => logUserSearch(username))

      if (normalizedUsernames.length === 1) {
        setWatchlistOwners(normalizedUsernames)
        setFilms(watchlists[0])
        startPicker(watchlists[0])
        return
      }

      const sharedFilms = findSharedFilms(watchlists[0], watchlists[1], normalizedUsernames)
      if (sharedFilms.length === 0) {
        throw new Error(`No common films found between ${normalizedUsernames[0]} and ${normalizedUsernames[1]}.`)
      }

      setWatchlistOwners(normalizedUsernames)
      setFilms(sharedFilms)
      startPicker(sharedFilms)
    } catch (error) {
      setWatchlistError(error.message || 'Could not find common films in those watchlists.')
    }
  }

  function startPicker(filmList) {
    window.clearTimeout(followTimerRef.current)
    setShowFollowDialog(false)
    const pick = pickRandom(filmList)
    setChosen(pick)
    setSpinning(true)
    setView('picker')
  }

  function handleSpinAgain() {
    window.clearTimeout(followTimerRef.current)
    setShowFollowDialog(false)
    const pick = pickRandom(films)
    setChosen(pick)
    setSpinning(true)
  }

  function handleSpinComplete() {
    setSpinning(false)
    window.clearTimeout(followTimerRef.current)
    followTimerRef.current = window.setTimeout(() => setShowFollowDialog(true), 2000)
  }

  function handleReset() {
    setView('input')
    setFilms([])
    setChosen(null)
    setSpinning(false)
    setWatchlistOwners([])
    setWatchlistError(null)
    window.clearTimeout(followTimerRef.current)
    setShowFollowDialog(false)
    clearScrapeError()
  }

  function handleHome() {
    if (window.location.pathname !== '/') {
      window.location.assign('/')
      return
    }

    handleReset()
  }

  useEffect(() => {
    const slug = chosen?.letterboxdSlug
    if (!slug) return undefined

    let active = true
    fetchFilmMetadata(slug).then((metadata) => {
      if (!active || !metadata) return

      setChosen((current) => (
        current?.letterboxdSlug === slug ? { ...current, ...metadata } : current
      ))
      setFilms((current) => current.map((film) => (
        film.letterboxdSlug === slug ? { ...film, ...metadata } : film
      )))
    })

    return () => {
      active = false
    }
  }, [chosen?.letterboxdSlug])

  useEffect(() => () => window.clearTimeout(followTimerRef.current), [])

  const inputError = watchlistError || scrapeError

  return (
    <div className="flex min-h-screen flex-col bg-retro-gray">
      <Header onHome={handleHome} />

      <main className="flex-1 px-3 py-4 sm:px-4 sm:py-8">
        <AnimatePresence mode="wait">
          {window.location.pathname === '/admin' ? (
            <motion.div
              key="admin"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <AdminView />
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
                <p className="text-sm sm:text-lg font-bold text-retro-black">
                  PICK FROM YOUR WATCHLIST!
                </p>
                <div className="text-xs font-mono text-retro-muted">
                   Pick a film from YOUR Letterboxd watchlist — or find COMMON FILMS in two public lists
                </div>
              </div>

              <InputTabs
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

              <div className="retro-outset bg-retro-panelYellow border-2 px-2 py-2 sm:px-3 sm:py-2 flex flex-wrap items-center justify-between gap-1.5">
                <p className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-retro-black">
                  {watchlistOwners.length === 2 ? 'COMMON FILMS' : 'WATCHLIST PICKER'}
                </p>
                <p className="text-[10px] sm:text-xs font-mono text-retro-black break-words text-right">
                  {watchlistOwners.join(' + ')} &mdash; {films.length}{' '}
                  {watchlistOwners.length === 2
                    ? `COMMON FILM${films.length === 1 ? '' : 'S'}`
                    : `FILM${films.length === 1 ? '' : 'S'}`}
                </p>
              </div>

              <div className="retro-hr" />

              {spinning ? (
                <>
                  <div className="retro-outset-deep bg-retro-gray border-4 overflow-hidden">
                    <div className="retro-titlebar px-3 py-2 flex justify-between items-center">
                      <span className="font-bold">SPIN_WHEEL.EXE</span>
                      <div className="flex gap-2">
                        <div className="w-4 h-4 retro-outset bg-retro-yellow" />
                        <div className="w-4 h-4 retro-outset bg-retro-yellow" />
                        <div className="w-4 h-4 retro-outset bg-retro-red" />
                      </div>
                    </div>
                    <div className="p-6 retro-inset bg-retro-white">
                      <SpinWheel
                        films={films}
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
                    <MovieCard key={chosen.letterboxdSlug + chosen.title} film={chosen} />
                  )}
                </AnimatePresence>
              )}

              <PickerControls
                onSpin={handleSpinAgain}
                onReset={handleReset}
                spinning={spinning}
                filmsCount={films.length}
              />

              {!spinning && chosen && <ViewOnLetterboxd film={chosen} />}

              {watchlistOwners.length === 2 && <SharedFilmsList films={films} />}

            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
      {showFollowDialog && <FollowDialog onClose={() => setShowFollowDialog(false)} />}
    </div>
  )
}
