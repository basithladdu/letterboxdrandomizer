import { useState } from 'react'
import Header from './components/layout/Header.jsx'
import Footer from './components/layout/Footer.jsx'
import InputTabs from './components/input/InputTabs.jsx'
import SpinWheel from './components/picker/SpinWheel.jsx'
import MovieCard from './components/picker/MovieCard.jsx'
import PickerControls from './components/picker/PickerControls.jsx'
import { useWatchlistScraper } from './hooks/useWatchlistScraper.js'
import { pickRandom } from './utils/randomPicker.js'
import { motion, AnimatePresence } from 'framer-motion'
import { getSavedWatchlist, saveWatchlist } from './services/firebase.js'

export default function App() {
  const [view, setView] = useState('input') // 'input' | 'picker'
  const [films, setFilms] = useState([])
  const [chosen, setChosen] = useState(null)
  const [spinning, setSpinning] = useState(false)

  const { scrape, loading: scrapeLoading, progress: scrapeProgress, error: scrapeError } = useWatchlistScraper()

  async function handleScrape(username) {
    try {
      // 1. Try to load from Firebase first
      let result = await getSavedWatchlist(username)
      
      if (!result) {
        // 2. If not in Firebase, scrape it
        result = await scrape(username)
        // 3. Save to Firebase for next time
        await saveWatchlist(username, result)
      }
      
      setFilms(result)
      startPicker(result)
    } catch {
      // error shown in InputTabs
    }
  }

  function startPicker(filmList) {
    const pick = pickRandom(filmList)
    setChosen(pick)
    setSpinning(true)
    setView('picker')
  }

  function handleSpinAgain() {
    const pick = pickRandom(films)
    setChosen(pick)
    setSpinning(true)
  }

  function handleSpinComplete() {
    setSpinning(false)
  }

  function handleUpload(filmList) {
    setFilms(filmList)
    startPicker(filmList)
  }

  function handleReset() {
    setView('input')
    setFilms([])
    setChosen(null)
    setSpinning(false)
  }

  return (
    <div className="flex min-h-screen flex-col bg-retro-gray">
      <Header />

      <main className="flex-1 px-3 py-4 sm:px-4 sm:py-8">
        <AnimatePresence mode="wait">
          {view === 'input' ? (
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
                <h1 className="text-3xl sm:text-6xl font-black text-rainbow uppercase tracking-tight" style={{textShadow: '2px 2px 0 #808080'}}>
                  WHAT SHOULD I WATCH?
                </h1>
                <p className="text-sm sm:text-lg font-bold text-retro-black">
                  SPIN THE WHEEL &amp; DISCOVER YOUR NEXT FILM!
                </p>
                <div className="text-xs font-mono text-retro-muted">
                  Pick a RANDOM film from YOUR Letterboxd watchlist
                </div>
              </div>

              <InputTabs
                onScrape={handleScrape}
                onUpload={handleUpload}
                scrapeLoading={scrapeLoading}
                scrapeProgress={scrapeProgress}
                scrapeError={scrapeError}
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
              {/* 
              <div className="text-center">
                <div className="inline-block hit-counter">
                  FILMS IN WATCHLIST: {String(films.length).padStart(4, '0')}
                </div>
              </div>
              */}

              <div className="retro-hr" />

              {spinning ? (
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
              ) : (
                /* Movie card (shown after spin) */
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
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  )
}
