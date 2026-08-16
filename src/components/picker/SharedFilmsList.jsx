export default function SharedFilmsList({ films = [], watchlistOwners = [] }) {
  if (!films?.length) return null

  const isGroup = watchlistOwners.length > 2

  return (
    <section
      className="retro-outset-deep bg-retro-gray border-4 overflow-hidden"
      aria-labelledby="common-films-title"
    >
      <div className="retro-titlebar px-3 py-2 flex items-center justify-between gap-2">
        <span id="common-films-title" className="font-bold text-sm">
          {isGroup ? 'GROUP MATCHING FILMS' : 'COMMON FILMS'}
        </span>
        <span className="text-[10px] font-mono">{films.length} TOTAL</span>
      </div>

      <div className="p-2 sm:p-3 retro-inset bg-retro-white">
        <ul className="max-h-[24rem] overflow-y-auto space-y-1 pr-1 list-none" aria-label="Films matching watchlists">
          {films.map((film, index) => (
            <li key={`${film.letterboxdSlug || film.title}-${film.year || index}`}>
              <a
                href={film.letterboxdUri}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open ${film.title}${film.year ? ` (${film.year})` : ''} on Letterboxd in a new tab`}
                className="retro-outset flex min-h-[44px] items-center gap-2 px-2 py-2 text-retro-black no-underline hover:bg-retro-yellow focus-visible:bg-retro-yellow transition-colors touch-manipulation flex-wrap sm:flex-nowrap"
              >
                <span className="w-6 flex-shrink-0 text-right text-[10px] font-mono text-retro-muted" aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>

                <span className="min-w-0 flex-1 text-xs sm:text-sm font-bold leading-tight break-words">
                  {film.title}
                </span>

                {isGroup && film.overlapCount && film.totalUsers && (
                  <span
                    className={`flex-shrink-0 text-[9px] font-mono font-black px-1.5 py-0.5 border border-retro-black ${
                      film.isUnanimous ? 'bg-retro-red text-retro-white' : 'bg-retro-yellow text-retro-black'
                    }`}
                  >
                    {film.isUnanimous ? 'ALL 100%' : `${film.overlapCount}/${film.totalUsers} FRIENDS`}
                  </span>
                )}

                {film.year && (
                  <span className="flex-shrink-0 text-[10px] sm:text-xs font-mono text-retro-muted" aria-hidden="true">
                    {film.year}
                  </span>
                )}

                <span aria-hidden="true" className="flex-shrink-0 text-xs font-black">↗</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
