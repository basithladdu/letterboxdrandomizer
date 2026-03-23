import { motion } from 'framer-motion'
import { BiMoviePlay } from 'react-icons/bi'
import { usePoster } from '../../hooks/usePoster.js'

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

function PosterPlaceholder({ title }) {
  return (
    <div className="w-full h-full flex items-center justify-center bg-retro-gray p-4 retro-inset" style={{backgroundColor: '#C0C0C0'}}>
      <div className="text-center">
        <div className="text-5xl mb-2 text-retro-black"><BiMoviePlay /></div>
        <p className="text-xs text-retro-black line-clamp-3 font-bold">{title}</p>
      </div>
    </div>
  )
}

export default function MovieCard({ film }) {
  const { posterUrl, loading: posterLoading } = usePoster(film)

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="w-full max-w-2xl mx-auto"
    >
      {/* Windows 95 Window Style */}
      <div className="retro-outset-deep bg-retro-gray border-4 overflow-hidden transition-all hover:shadow-lg">
        {/* Title Bar */}
        <div className="retro-titlebar px-3 py-2 flex justify-between items-center">
          <span className="font-bold text-sm">{film.title.toUpperCase().substring(0, 30)}…</span>
          <div className="flex gap-2">
            <div className="w-4 h-4 retro-outset bg-retro-yellow" />
            <div className="w-4 h-4 retro-outset bg-retro-yellow" />
            <div className="w-4 h-4 retro-outset bg-retro-red" />
          </div>
        </div>

        <div className="p-2 sm:p-4 space-y-3 sm:space-y-4 retro-inset bg-retro-white">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
            {/* Poster */}
            <div className="col-span-1 retro-inset bg-retro-gray overflow-hidden mx-auto w-full sm:w-auto" style={{aspectRatio: '2/3', maxWidth: '150px'}}>
              {posterLoading && !posterUrl && (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="h-8 w-8 border-2 border-retro-black border-t-transparent animate-spin-retro" />
                </div>
              )}
              {posterUrl ? (
                <img
                  src={posterUrl}
                  alt={film.title}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.style.display = 'none' }}
                />
              ) : (
                !posterLoading && <PosterPlaceholder title={film.title} />
              )}
            </div>

            {/* Film Info */}
            <div className="col-span-1 sm:col-span-2 space-y-2 sm:space-y-4 retro-inset bg-retro-panelYellow p-3 sm:p-4">
              <div className="border-b-2 border-retro-black pb-2 sm:pb-3">
                <h2 className="text-lg sm:text-2xl font-black text-retro-black leading-tight uppercase">
                  {film.title}
                </h2>
                {film.year && (
                  <p className="text-xs sm:text-sm font-mono text-retro-muted">YEAR: {film.year}</p>
                )}
              </div>

              {/* Rating */}
              {film.rating && (
                <div className="border-b-2 border-retro-black pb-2 sm:pb-3">
                  <p className="text-xs font-bold text-retro-black mb-1">YOUR RATING:</p>
                  <StarRating rating={film.rating} />
                </div>
              )}

              {/* Letterboxd Link Button */}
              <a
                href={film.letterboxdUri}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  block w-full py-1.5 sm:py-2 text-xs sm:text-sm font-black text-retro-black text-center uppercase tracking-widest
                  border-4 border-retro-black transition-none
                "
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
                VIEW ON LETTERBOXD
              </a>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
