import { useState, useEffect } from 'react'
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion'
import { fetchPoster } from '../../services/omdbService.js'
import { fetchFilmMetadata } from '../../services/letterboxdScraper.js'
import { BiHeart, BiX, BiStar, BiUndo, BiCameraMovie } from 'react-icons/bi'

function SwipeCard({ film, onSwipe, isTop }) {
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-200, 200], [-16, 16])
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0.6, 1, 1, 1, 0.6])

  // Stamp Opacity Transforms
  const likeOpacity = useTransform(x, [20, 100], [0, 1])
  const nopeOpacity = useTransform(x, [-20, -100], [0, 1])

  const [poster, setPoster] = useState(film?.posterUrl || null)
  const [metadata, setMetadata] = useState({ rating: film?.rating, year: film?.year })

  useEffect(() => {
    let cancelled = false
    if (!film?.letterboxdSlug) return

    // Fetch poster and metadata if missing
    if (!poster) {
      fetchPoster(film.title, film.year).then((url) => {
        if (!cancelled && url) setPoster(url)
      })
    }

    fetchFilmMetadata(film.letterboxdSlug).then((meta) => {
      if (!cancelled && meta) {
        if (meta.posterUrl && !poster) setPoster(meta.posterUrl)
        setMetadata((prev) => ({ ...prev, ...meta }))
      }
    })

    return () => {
      cancelled = true
    }
  }, [film?.letterboxdSlug, film?.title, film?.year])

  const handleDragEnd = (event, info) => {
    const swipeThreshold = 90
    if (info.offset.x > swipeThreshold || info.velocity.x > 500) {
      onSwipe('like', film)
    } else if (info.offset.x < -swipeThreshold || info.velocity.x < -500) {
      onSwipe('nope', film)
    }
  }

  if (!film) return null

  return (
    <motion.div
      style={{
        x: isTop ? x : 0,
        rotate: isTop ? rotate : 0,
        opacity: isTop ? opacity : 0.85,
        scale: isTop ? 1 : 0.95,
        zIndex: isTop ? 20 : 10,
      }}
      drag={isTop ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      className={`
        absolute inset-0 select-none touch-none cursor-grab active:cursor-grabbing
        retro-outset-deep bg-[#181818] border-4 border-retro-black p-3 sm:p-4
        flex flex-col justify-between overflow-hidden shadow-[6px_6px_0_#111]
      `}
    >
      {/* Visual LIKE / NOPE Stamps */}
      {isTop && (
        <>
          <motion.div
            style={{ opacity: likeOpacity }}
            className="absolute top-6 left-6 z-30 pointer-events-none border-4 border-[#00FF00] bg-[#00FF00]/20 text-[#00FF00] font-black font-mono text-2xl sm:text-3xl px-3 py-1 -rotate-12 uppercase tracking-widest"
          >
            LIKE
          </motion.div>

          <motion.div
            style={{ opacity: nopeOpacity }}
            className="absolute top-6 right-6 z-30 pointer-events-none border-4 border-retro-red bg-retro-red/20 text-retro-red font-black font-mono text-2xl sm:text-3xl px-3 py-1 rotate-12 uppercase tracking-widest"
          >
            PASS
          </motion.div>
        </>
      )}

      {/* Poster Image */}
      <div className="relative w-full flex-1 max-h-[380px] bg-retro-black border-2 border-retro-black overflow-hidden flex items-center justify-center">
        {poster ? (
          <img
            src={poster}
            alt={film.title}
            className="w-full h-full object-contain pointer-events-none"
            onError={() => setPoster(null)}
          />
        ) : (
          <div className="p-6 text-center text-retro-muted font-mono font-bold text-xs uppercase flex flex-col items-center gap-2">
            <BiCameraMovie size={36} />
            <span>{film.title}</span>
          </div>
        )}
      </div>

      {/* Movie Details Strip */}
      <div className="mt-3 p-2 bg-[#222222] border-2 border-retro-muted text-retro-white space-y-1">
        <h3 className="text-base sm:text-xl font-black uppercase leading-tight line-clamp-1">
          {film.title}
        </h3>
        <div className="flex items-center justify-between font-mono text-xs text-retro-yellow font-bold">
          <span>YEAR: {metadata.year || film.year || 'N/A'}</span>
          {metadata.rating ? <span>RATING: ★ {metadata.rating}</span> : null}
        </div>
      </div>
    </motion.div>
  )
}

export default function TinderSwipe({ films = [], watchlistOwners = [], onMatch, onReset }) {
  const [deck, setDeck] = useState([])
  const [history, setHistory] = useState([])
  const [matchedFilm, setMatchedFilm] = useState(null)
  const [showMatchModal, setShowMatchModal] = useState(false)

  useEffect(() => {
    if (!films || films.length === 0) return
    // Shuffle pool for dating deck
    const shuffled = [...films].sort(() => Math.random() - 0.5)
    setDeck(shuffled)
    setHistory([])
    setMatchedFilm(null)
    setShowMatchModal(false)
  }, [films])

  const currentFilm = deck[0]
  const nextFilm = deck[1]

  const handleSwipe = (direction, film) => {
    if (!film) return

    setHistory((prev) => [{ film, direction }, ...prev])
    setDeck((prev) => prev.slice(1))

    if (direction === 'like' || direction === 'superlike') {
      setMatchedFilm(film)
      setShowMatchModal(true)
    }
  }

  const handleUndo = () => {
    if (history.length === 0) return
    const last = history[0]
    setHistory((prev) => prev.slice(1))
    setDeck((prev) => [last.film, ...prev])
  }

  // Keyboard navigation (Left = Nope, Right = Like, Up = Superlike, Z = Undo)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (showMatchModal) return

      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        if (currentFilm) handleSwipe('nope', currentFilm)
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        if (currentFilm) handleSwipe('like', currentFilm)
      } else if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        if (currentFilm) handleSwipe('superlike', currentFilm)
      } else if (e.key === 'z' || e.key === 'Z') {
        handleUndo()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentFilm, history, showMatchModal])

  const isMulti = watchlistOwners.length > 1

  return (
    <div className="retro-outset-deep bg-retro-gray border-4 overflow-hidden space-y-0 max-w-lg mx-auto font-mono">
      {/* Retro Titlebar */}
      <div className="retro-titlebar px-3 py-1.5 flex items-center justify-between">
        <span className="text-xs sm:text-sm font-bold uppercase">
          SWIPE_DECK.EXE {isMulti ? `(${watchlistOwners.length} USERS)` : ''}
        </span>
        <div className="flex gap-1">
          <div className="w-3 h-3 bg-retro-yellow border border-retro-black" />
          <div className="w-3 h-3 bg-retro-red border border-retro-black" />
        </div>
      </div>

      <div className="p-3 sm:p-5 retro-inset bg-retro-white space-y-4">
        <div className="text-center space-y-1">
          <h2 className="text-sm sm:text-base font-black uppercase text-retro-black">
            SWIPE RIGHT ON MOVIES YOU WANT TO WATCH
          </h2>
          <p className="text-[10px] sm:text-xs text-retro-muted uppercase">
            {deck.length} FILMS IN QUEUE {isMulti ? `(${watchlistOwners.join(' + ')})` : ''} &bull; DRAG OR USE ARROW KEYS (LEFT / RIGHT)
          </p>
        </div>

        {/* Tinder Swipe Deck Stage */}
        <div className="relative w-full h-[460px] sm:h-[500px] flex items-center justify-center">
          {deck.length > 0 ? (
            <>
              {nextFilm && (
                <SwipeCard
                  key={nextFilm.letterboxdSlug || nextFilm.title}
                  film={nextFilm}
                  isTop={false}
                />
              )}
              {currentFilm && (
                <SwipeCard
                  key={currentFilm.letterboxdSlug || currentFilm.title}
                  film={currentFilm}
                  onSwipe={handleSwipe}
                  isTop={true}
                />
              )}
            </>
          ) : (
            <div className="text-center p-6 space-y-3">
              <h3 className="text-lg font-black uppercase text-retro-black">
                QUEUE COMPLETE
              </h3>
              <p className="text-xs text-retro-muted">
                You went through all films in this watchlist.
              </p>
              <button
                type="button"
                onClick={onReset}
                className="retro-outset px-4 py-2 bg-retro-yellow text-retro-black font-black uppercase text-xs hover:bg-[#FFE033]"
              >
                START OVER
              </button>
            </div>
          )}
        </div>

        {/* Floating Controls Bar */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 pt-2">
          {/* Undo */}
          <button
            type="button"
            onClick={handleUndo}
            disabled={history.length === 0}
            className="w-11 h-11 rounded-full retro-outset bg-retro-gray flex items-center justify-center text-retro-black hover:bg-retro-panelYellow disabled:opacity-40"
            title="Undo swipe (Z)"
            aria-label="Undo last swipe"
          >
            <BiUndo size={22} />
          </button>

          {/* Pass / Nope */}
          <button
            type="button"
            onClick={() => currentFilm && handleSwipe('nope', currentFilm)}
            disabled={!currentFilm}
            className="w-14 h-14 rounded-full border-4 border-retro-red bg-retro-white text-retro-red flex items-center justify-center font-black shadow-[3px_3px_0_#111] hover:scale-105 active:scale-95 transition-transform"
            title="Pass (Left Arrow)"
            aria-label="Pass"
          >
            <BiX size={32} />
          </button>

          {/* Super Like */}
          <button
            type="button"
            onClick={() => currentFilm && handleSwipe('superlike', currentFilm)}
            disabled={!currentFilm}
            className="w-11 h-11 rounded-full border-4 border-retro-blue bg-retro-white text-retro-blue flex items-center justify-center font-black shadow-[3px_3px_0_#111] hover:scale-105 active:scale-95 transition-transform"
            title="Super Like (Up Arrow)"
            aria-label="Super like"
          >
            <BiStar size={22} />
          </button>

          {/* Match / Like */}
          <button
            type="button"
            onClick={() => currentFilm && handleSwipe('like', currentFilm)}
            disabled={!currentFilm}
            className="w-14 h-14 rounded-full border-4 border-[#00AA00] bg-retro-white text-[#00AA00] flex items-center justify-center font-black shadow-[3px_3px_0_#111] hover:scale-105 active:scale-95 transition-transform"
            title="Match (Right Arrow)"
            aria-label="Like"
          >
            <BiHeart size={30} />
          </button>
        </div>
      </div>

      {/* IT'S A MATCH Modal */}
      <AnimatePresence>
        {showMatchModal && matchedFilm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-xs font-sans">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="w-full max-w-md retro-outset-deep bg-[#181818] border-4 border-retro-black p-4 sm:p-6 text-center space-y-4 shadow-[8px_8px_0_#000] text-retro-white"
            >
              <div className="space-y-1">
                <span className="text-xs font-mono font-bold text-retro-yellow uppercase tracking-widest">
                  DESTINY SELECTED
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-[#00FF00] tracking-tight uppercase animate-pulse">
                  IT'S A MATCH!
                </h2>
                <p className="text-xs sm:text-sm text-retro-lightgray font-mono">
                  You matched with this film to watch tonight.
                </p>
              </div>

              <div className="p-3 bg-[#262626] border-2 border-retro-yellow space-y-2">
                <h3 className="text-xl sm:text-2xl font-black uppercase text-retro-yellow">
                  {matchedFilm.title}
                </h3>
                <p className="text-xs font-mono text-retro-lightgray font-bold">
                  {matchedFilm.year ? `(${matchedFilm.year})` : ''} {matchedFilm.rating ? `• ★ ${matchedFilm.rating}/5.0` : ''}
                </p>
              </div>

              <div className="space-y-2 pt-2 font-mono">
                <button
                  type="button"
                  onClick={() => onMatch(matchedFilm)}
                  className="w-full py-3 bg-[#00AA00] hover:bg-[#00CC00] text-retro-white font-black text-sm uppercase tracking-widest retro-outset"
                >
                  VIEW TICKET &amp; DETAILS
                </button>

                <button
                  type="button"
                  onClick={() => setShowMatchModal(false)}
                  className="w-full py-2 bg-retro-gray hover:bg-retro-panelYellow text-retro-black font-black text-xs uppercase tracking-wider retro-outset"
                >
                  KEEP SWIPING
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
