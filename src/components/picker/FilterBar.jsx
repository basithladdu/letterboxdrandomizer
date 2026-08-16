import { useMemo } from 'react'
import { BiFilterAlt } from 'react-icons/bi'

export default function FilterBar({ films = [], activeDecade, onDecadeChange, activeRating, onRatingChange }) {
  const decades = [
    { id: 'all', label: 'ALL ERAS' },
    { id: 'classic', label: '< 1980' },
    { id: '80s', label: '80s' },
    { id: '90s', label: '90s' },
    { id: '00s', label: '2000s' },
    { id: '10s', label: '2010s' },
    { id: '20s', label: '2020s' },
  ]

  const ratings = [
    { id: 'all', label: 'ANY RATING' },
    { id: '3.5', label: '★ 3.5+' },
    { id: '4.0', label: '★ 4.0+' },
  ]

  return (
    <div className="retro-outset bg-retro-gray p-2 sm:p-3 border-2 space-y-2 font-mono text-retro-black">
      <div className="flex items-center justify-between gap-2 border-b border-retro-muted pb-1.5">
        <div className="flex items-center gap-1.5 text-xs font-black uppercase">
          <BiFilterAlt size={14} className="text-retro-black" />
          <span>CINEPHILE FILTERS</span>
        </div>
        <span className="text-[10px] text-retro-muted font-bold">
          {films.length} FILMS MATCHING
        </span>
      </div>

      {/* Decade Pills */}
      <div className="flex flex-wrap items-center gap-1">
        <span className="text-[10px] font-bold text-neutral-600 mr-1 uppercase">ERA:</span>
        {decades.map((d) => (
          <button
            key={d.id}
            type="button"
            onClick={() => onDecadeChange(d.id)}
            className={`px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] font-black uppercase border transition-none ${
              activeDecade === d.id
                ? 'bg-retro-yellow text-retro-black border-retro-black shadow-[inset_1px_1px_0_#FFF]'
                : 'bg-retro-white text-retro-muted border-retro-muted hover:text-retro-black'
            }`}
          >
            {d.label}
          </button>
        ))}
      </div>

      {/* Rating Threshold Pills */}
      <div className="flex flex-wrap items-center gap-1">
        <span className="text-[10px] font-bold text-neutral-600 mr-1 uppercase">RATING:</span>
        {ratings.map((r) => (
          <button
            key={r.id}
            type="button"
            onClick={() => onRatingChange(r.id)}
            className={`px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] font-black uppercase border transition-none ${
              activeRating === r.id
                ? 'bg-retro-yellow text-retro-black border-retro-black shadow-[inset_1px_1px_0_#FFF]'
                : 'bg-retro-white text-retro-muted border-retro-muted hover:text-retro-black'
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>
    </div>
  )
}
