import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { BiPlayCircle, BiLinkExternal } from 'react-icons/bi'
import { fetchPoster } from '../../services/omdbService.js'

function StarRating({ rating }) {
  if (!rating) return null
  const num = parseFloat(rating)
  if (isNaN(num)) return null

  const full = Math.floor(num)
  const half = num % 1 >= 0.5
  const empty = 5 - full - (half ? 1 : 0)

  return (
    <div className="flex items-center gap-0.5" title={`${rating}/5`}>
      {Array(full).fill(0).map((_, i) => (
        <span key={`f${i}`} className="text-[#FFD700] text-sm">★</span>
      ))}
      {half && <span className="text-[#FFD700] text-sm">½</span>}
      {Array(empty).fill(0).map((_, i) => (
        <span key={`e${i}`} className="text-retro-muted text-sm">★</span>
      ))}
      <span className="ml-1 text-xs text-retro-muted font-mono">{rating}/5</span>
    </div>
  )
}

export function ViewOnLetterboxd({ film }) {
  if (!film?.letterboxdUri) return null

  const justWatchQuery = encodeURIComponent(`${film.title} ${film.year || ''}`.trim())
  const justWatchUrl = `https://www.justwatch.com/us/search?q=${justWatchQuery}`

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      <a
        href={film.letterboxdUri}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`View ${film.title} on Letterboxd`}
        className="flex items-center justify-center gap-2 py-2.5 sm:py-3.5 text-xs sm:text-base font-black text-retro-black text-center uppercase tracking-widest border-4 transition-none"
        style={{
          backgroundColor: '#FFFF00',
          borderColor: '#FFFFFF #808080 #808080 #FFFFFF',
          boxShadow: 'inset -1px -1px 0 #404040, inset 1px 1px 0 #DFDFDF',
          textShadow: '2px 2px 0 #808080'
        }}
        onMouseDown={(e) => {
          e.currentTarget.style.borderColor = '#808080 #FFFFFF #FFFFFF #808080'
          e.currentTarget.style.boxShadow = 'inset 1px 1px 0 #404040, inset -1px -1px 0 #DFDFDF'
          e.currentTarget.style.transform = 'translate(1px, 1px)'
        }}
        onMouseUp={(e) => {
          e.currentTarget.style.borderColor = '#FFFFFF #808080 #808080 #FFFFFF'
          e.currentTarget.style.boxShadow = 'inset -1px -1px 0 #404040, inset 1px 1px 0 #DFDFDF'
          e.currentTarget.style.transform = 'translate(0, 0)'
        }}
      >
        <BiLinkExternal size={18} />
        VIEW ON LETTERBOXD
      </a>

      <a
        href={justWatchUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Find where to stream ${film.title}`}
        className="flex items-center justify-center gap-2 py-2.5 sm:py-3.5 text-xs sm:text-base font-black text-retro-white text-center uppercase tracking-widest border-4 transition-none"
        style={{
          backgroundColor: '#00AA00',
          borderColor: '#FFFFFF #808080 #808080 #FFFFFF',
          boxShadow: 'inset -1px -1px 0 #404040, inset 1px 1px 0 #DFDFDF',
          textShadow: '2px 2px 0 #004400'
        }}
        onMouseDown={(e) => {
          e.currentTarget.style.borderColor = '#808080 #FFFFFF #FFFFFF #808080'
          e.currentTarget.style.boxShadow = 'inset 1px 1px 0 #404040, inset -1px -1px 0 #DFDFDF'
          e.currentTarget.style.transform = 'translate(1px, 1px)'
        }}
        onMouseUp={(e) => {
          e.currentTarget.style.borderColor = '#FFFFFF #808080 #808080 #FFFFFF'
          e.currentTarget.style.boxShadow = 'inset -1px -1px 0 #404040, inset 1px 1px 0 #DFDFDF'
          e.currentTarget.style.transform = 'translate(0, 0)'
        }}
      >
        <BiPlayCircle size={20} />
        WHERE TO WATCH
      </a>
    </div>
  )
}

function PosterArtwork({ film }) {
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
    <div className="mx-auto w-full max-w-[180px] sm:max-w-none">
      {failed || !source ? (
        <div className="flex aspect-[2/3] w-full items-center justify-center border-4 border-retro-black bg-retro-gray p-3 text-center text-[10px] font-black uppercase text-retro-muted">
          POSTER UNAVAILABLE
        </div>
      ) : (
        <img
          src={source}
          alt={`Poster for ${film.title}${film.year ? ` (${film.year})` : ''}`}
          className="block aspect-[2/3] w-full border-4 border-retro-black bg-retro-gray object-cover"
          loading="eager"
          decoding="async"
          onError={handleError}
        />
      )}
    </div>
  )
}

export default function MovieCard({ film }) {
  const totalUsers = film.totalUsers || film.watchlistOwners?.length || 1
  const sharedCount = film.overlapCount || (film.watchlistOwners?.length === 2 ? 2 : 1)
  const isGroup = totalUsers > 2

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="retro-outset-deep bg-retro-gray border-4 overflow-hidden transition-all hover:shadow-lg">
        <div className="retro-titlebar px-3 py-2 flex justify-between items-center">
          <span className="font-bold text-sm">{film.title.toUpperCase().substring(0, 30)}…</span>
          <div className="flex gap-2">
            <div className="w-4 h-4 retro-outset bg-retro-yellow" />
            <div className="w-4 h-4 retro-outset bg-retro-yellow" />
            <div className="w-4 h-4 retro-outset bg-retro-red" />
          </div>
        </div>

        <div className="p-2 sm:p-4 retro-inset bg-retro-white">
          <div className="grid gap-4 retro-inset bg-retro-panelYellow p-4 sm:grid-cols-[minmax(0,180px)_1fr] sm:gap-6 sm:p-6">
            <PosterArtwork film={film} />

            <div className="min-w-0 space-y-2 sm:space-y-4">
              <div className="border-b-4 border-retro-black pb-3 sm:pb-4 space-y-1">
                <h2 className="text-xl sm:text-4xl font-black text-retro-black leading-tight uppercase">
                  {film.title}
                </h2>
                {film.year && (
                  <p className="text-xs sm:text-base font-mono text-retro-muted">YEAR: {film.year}</p>
                )}

                {film.watchlistOwners?.length === 2 && (
                  <p className="text-[10px] sm:text-xs font-mono font-bold text-retro-black bg-retro-gray/50 p-1 border border-retro-muted">
                    COMMON TO: {film.watchlistOwners.join(' + ')}
                  </p>
                )}

                {isGroup && (
                  <div className="p-1.5 bg-retro-gray border border-retro-muted space-y-1">
                    <div className="flex items-center justify-between gap-1 text-[10px] sm:text-xs font-black uppercase">
                      <span className="text-retro-black">
                        SHARED BY {sharedCount} OF {totalUsers} FRIENDS:
                      </span>
                      {film.isUnanimous && (
                        <span className="bg-retro-red text-retro-white px-1 py-0.2 text-[9px]">
                          100% UNANIMOUS
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {(film.sharedBy || film.watchlistOwners || []).map((u) => (
                        <span
                          key={u}
                          className="bg-retro-white text-retro-black border border-retro-black px-1.5 py-0.5 text-[9px] font-mono font-bold"
                        >
                          @{u}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {film.dateAdded && (
                  <p className="text-[10px] sm:text-sm font-mono text-retro-muted">ADDED: {film.dateAdded}</p>
                )}
              </div>

              {film.rating && (
                <div className="border-b-4 border-retro-black pb-3 sm:pb-4">
                  <p className="text-xs font-bold text-retro-black mb-1 uppercase">LETTERBOXD RATING:</p>
                  <StarRating rating={film.rating} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
