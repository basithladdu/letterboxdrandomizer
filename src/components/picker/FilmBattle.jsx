import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { fetchPoster } from '../../services/omdbService.js'
import { BiTrophy, BiCheckCircle } from 'react-icons/bi'

function FilmFighterCard({ film, onSelect, hotkey, isWinner }) {
  const [source, setSource] = useState(film.posterUrl || null)
  const [fallbackTried, setFallbackTried] = useState(false)
  const [failed, setFailed] = useState(!film.posterUrl)

  useEffect(() => {
    setSource(film.posterUrl || null)
    setFallbackTried(false)
    setFailed(!film.posterUrl)
  }, [film.letterboxdSlug, film.posterUrl])

  async function handleError() {
    if (fallbackTried) {
      setFailed(true)
      return
    }

    setFallbackTried(true)
    const fallbackPoster = await fetchPoster(film.title, film.year)
    if (fallbackPoster) {
      setSource(fallbackPoster)
      setFailed(false)
    } else {
      setFailed(true)
    }
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="flex-1 flex flex-col justify-between retro-outset bg-retro-gray p-3 border-2 cursor-pointer hover:bg-retro-panelYellow transition-colors"
      onClick={onSelect}
    >
      <div className="space-y-2">
        <div className="mx-auto w-full max-w-[140px] sm:max-w-[180px] aspect-[2/3] bg-retro-black border-2 border-retro-black overflow-hidden flex items-center justify-center">
          {failed || !source ? (
            <div className="p-2 text-center text-[10px] font-black uppercase text-retro-muted">
              POSTER UNAVAILABLE
            </div>
          ) : (
            <img
              src={source}
              alt={film.title}
              className="w-full h-full object-cover"
              onError={handleError}
            />
          )}
        </div>

        <div className="text-center space-y-0.5">
          <h4 className="text-xs sm:text-base font-black text-retro-black uppercase leading-tight line-clamp-2">
            {film.title}
          </h4>
          <p className="text-[10px] sm:text-xs font-mono text-retro-muted">
            {film.year ? `(${film.year})` : ''} {film.rating ? `• ★ ${film.rating}` : ''}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          onSelect()
        }}
        className="mt-3 w-full retro-outset py-2 px-2 bg-retro-yellow text-retro-black font-black text-[10px] sm:text-xs uppercase flex items-center justify-center gap-1 hover:bg-[#FFE033]"
      >
        <BiCheckCircle size={14} />
        <span>CHOOSE THIS [{hotkey}]</span>
      </button>
    </motion.div>
  )
}

export default function FilmBattle({ films = [], onWinner, onReset }) {
  const [bracket, setBracket] = useState([])
  const [matchIndex, setMatchIndex] = useState(0)
  const [nextRoundWinners, setNextRoundWinners] = useState([])
  const [roundNumber, setRoundNumber] = useState(1)

  // Seed 4 or 8 films for the bracket
  useEffect(() => {
    if (!films || films.length < 2) return
    const shuffled = [...films].sort(() => Math.random() - 0.5)
    const poolSize = shuffled.length >= 8 ? 8 : shuffled.length >= 4 ? 4 : 2
    const seed = shuffled.slice(0, poolSize)
    setBracket(seed)
    setMatchIndex(0)
    setNextRoundWinners([])
    setRoundNumber(1)
  }, [films])

  const filmA = bracket[matchIndex * 2]
  const filmB = bracket[matchIndex * 2 + 1]

  const totalMatchesInRound = Math.floor(bracket.length / 2)

  // Advance winner
  const handleSelect = (winner) => {
    const updatedWinners = [...nextRoundWinners, winner]

    if (matchIndex + 1 < totalMatchesInRound) {
      // Advance to next match in current round
      setNextRoundWinners(updatedWinners)
      setMatchIndex((prev) => prev + 1)
    } else {
      // Round complete!
      if (updatedWinners.length === 1) {
        // Final Champion crowned!
        onWinner(updatedWinners[0])
      } else {
        // Advance to next round
        setBracket(updatedWinners)
        setNextRoundWinners([])
        setMatchIndex(0)
        setRoundNumber((r) => r + 1)
      }
    }
  }

  // Keyboard navigation hotkeys (Left Arrow = A, Right Arrow = B)
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        if (filmA) handleSelect(filmA)
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        if (filmB) handleSelect(filmB)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [filmA, filmB, matchIndex, nextRoundWinners, bracket])

  if (!filmA || !filmB) return null

  return (
    <div className="retro-outset-deep bg-retro-gray border-4 overflow-hidden space-y-0">
      <div className="retro-titlebar px-3 py-2 flex items-center justify-between">
        <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm uppercase">
          <BiTrophy className="text-retro-yellow text-base" />
          <span>WATCHLIST BATTLE (ROUND {roundNumber} &bull; MATCH {matchIndex + 1}/{totalMatchesInRound})</span>
        </div>
        <div className="flex gap-1">
          <div className="w-2.5 h-2.5 bg-retro-yellow border border-retro-black" />
          <div className="w-2.5 h-2.5 bg-retro-red border border-retro-black" />
        </div>
      </div>

      <div className="p-3 sm:p-5 retro-inset bg-retro-white space-y-4">
        <div className="text-center space-y-1">
          <h3 className="text-sm sm:text-base font-black text-retro-black uppercase">
            WHICH FILM WOULD YOU RATHER WATCH TONIGHT?
          </h3>
          <p className="text-[10px] sm:text-xs font-mono text-retro-muted uppercase">
            Pick one to eliminate the other &bull; Use Left / Right Arrow keys
          </p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={`${roundNumber}-${matchIndex}`}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-3 sm:gap-4 items-center"
          >
            {/* Film A */}
            <FilmFighterCard
              film={filmA}
              onSelect={() => handleSelect(filmA)}
              hotkey="← LEFT"
            />

            {/* Retro VS Divider */}
            <div className="flex sm:flex-col items-center justify-center gap-1 my-1 sm:my-0">
              <div className="h-0.5 sm:h-8 w-12 sm:w-0.5 bg-retro-black" />
              <span className="bg-retro-red text-retro-white font-black text-xs sm:text-sm px-2 py-1 border-2 border-retro-black animate-pulse">
                VS
              </span>
              <div className="h-0.5 sm:h-8 w-12 sm:w-0.5 bg-retro-black" />
            </div>

            {/* Film B */}
            <FilmFighterCard
              film={filmB}
              onSelect={() => handleSelect(filmB)}
              hotkey="RIGHT →"
            />
          </motion.div>
        </AnimatePresence>

        {/* Bottom Progress Bar */}
        <div className="retro-inset bg-retro-gray p-2 flex items-center justify-between text-[10px] font-mono font-bold text-retro-black">
          <span>PROGRESS: {matchIndex + 1} OF {totalMatchesInRound} MATCHES THIS ROUND</span>
          <button
            type="button"
            onClick={onReset}
            className="retro-outset px-2 py-0.5 bg-retro-gray text-retro-black hover:bg-retro-yellow text-[9px] uppercase font-black"
          >
            RESET TO SPIN
          </button>
        </div>
      </div>
    </div>
  )
}
