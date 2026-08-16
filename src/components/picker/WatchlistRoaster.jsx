import { useState, useMemo } from 'react'
import { BiRefresh, BiChevronDown, BiChevronUp } from 'react-icons/bi'
import { FaFire } from 'react-icons/fa'

const ROASTS = {
  massive: [
    "Your watchlist has officially achieved sentient hoarding status. You don't watch movies; you collect them like Pokémon.",
    "At this rate of accumulation, archeologists in 3026 will study your unplayed watchlist as a digital tomb.",
    "Be honest: you added 10 films today after watching a 15-second TikTok video essay and you'll watch none of them.",
    "Your Letterboxd watchlist is basically a graveyard of good cinematic intentions.",
  ],
  modern: [
    "Recency bias detected. Cinema actually existed before A24 and 4K HDR streaming, you know.",
    "Your taste screams 'I only watch films if the letterboxd poster looks good as a phone wallpaper.'",
    "90% of this list was released while you were already paying for your own Netflix subscription.",
  ],
  vintage: [
    "Certified Criterion Channel lurker. We know you mention French New Wave in casual dinner conversations.",
    "You won't watch a movie unless it was recorded on grainy 35mm film in black and white with subtitles.",
    "Half of your watchlist was directed by someone who hasn't been alive since the Cold War.",
  ],
  balanced: [
    "Statistically, you will spend 25 minutes staring at this list, get overwhelmed, and put on comfort TV instead.",
    "A respectable film backlog. Just remember: adding a film to your watchlist doesn't count as culture consumption.",
    "You have great taste on paper. Now if only you actually pressed 'Play' on any of these.",
  ],
  group: [
    "A group of friends trying to pick a movie is the ultimate test of human diplomacy. Good luck surviving tonight.",
    "If nobody agrees on this roll, remember that ordering pizza and arguing for 2 hours is also a valid movie night.",
    "You pooled all your watchlists together and STILL have 400 unwatched films in common. The indecision is legendary.",
  ],
}

function getRoast(films, owners = []) {
  const count = films.length
  if (owners.length >= 2) {
    const list = ROASTS.group
    return list[Math.floor(Math.random() * list.length)]
  }

  const validYears = films.map((f) => parseInt(f.year, 10)).filter((y) => !isNaN(y))
  const modernCount = validYears.filter((y) => y >= 2018).length
  const classicCount = validYears.filter((y) => y < 1985).length

  let pool = ROASTS.balanced
  if (count >= 350) pool = ROASTS.massive
  else if (validYears.length > 0 && modernCount / validYears.length > 0.55) pool = ROASTS.modern
  else if (validYears.length > 0 && classicCount / validYears.length > 0.4) pool = ROASTS.vintage

  return pool[Math.floor(Math.random() * pool.length)]
}

export default function WatchlistRoaster({ films = [], watchlistOwners = [] }) {
  const [isOpen, setIsOpen] = useState(false)
  const [roastIndex, setRoastIndex] = useState(0)

  const stats = useMemo(() => {
    const total = films.length
    if (total === 0) return null

    const validYears = films
      .map((f) => ({ film: f, year: parseInt(f.year, 10) }))
      .filter((item) => !isNaN(item.year))
      .sort((a, b) => a.year - b.year)

    const oldest = validYears[0]
    const newest = validYears[validYears.length - 1]

    // Decades breakdown
    const decadeMap = {}
    validYears.forEach(({ year }) => {
      const decade = `${Math.floor(year / 10) * 10}s`
      decadeMap[decade] = (decadeMap[decade] || 0) + 1
    })

    let topDecade = null
    let topCount = 0
    Object.entries(decadeMap).forEach(([decade, count]) => {
      if (count > topCount) {
        topCount = count
        topDecade = decade
      }
    })

    const topDecadePct = validYears.length > 0 ? Math.round((topCount / validYears.length) * 100) : 0

    // Time to finish at 1 film/day
    const daysToFinish = total
    const yearsToFinish = (total / 365).toFixed(1)
    const finishDate = new Date()
    finishDate.setDate(finishDate.getDate() + daysToFinish)
    const finishMonthYear = finishDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })

    return {
      total,
      oldest,
      newest,
      topDecade,
      topDecadePct,
      daysToFinish,
      yearsToFinish,
      finishMonthYear,
    }
  }, [films])

  const currentRoast = useMemo(() => {
    return getRoast(films, watchlistOwners)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [films, watchlistOwners, roastIndex])

  if (!stats) return null

  return (
    <div className="retro-outset bg-retro-gray border-2 overflow-hidden">
      <div className="retro-titlebar px-3 py-1.5 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <FaFire className="text-retro-yellow text-sm animate-pulse" />
          <span className="font-bold text-xs uppercase tracking-wider">
            WATCHLIST_ROAST.TXT &mdash; {stats.total} FILMS ANALYZED
          </span>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="retro-outset bg-retro-gray px-2 py-0.5 text-[10px] font-black uppercase hover:bg-retro-yellow flex items-center gap-1"
          aria-expanded={isOpen}
          aria-label="Toggle watchlist stats and roast"
        >
          {isOpen ? (
            <>
              <BiChevronUp size={14} /> HIDE STATS
            </>
          ) : (
            <>
              <BiChevronDown size={14} /> ROAST &amp; STATS
            </>
          )}
        </button>
      </div>

      <div className="p-3 bg-retro-white space-y-3">
        {/* Roast Callout */}
        <div className="retro-inset bg-retro-panelYellow p-2.5 sm:p-3 border-2 border-retro-black">
          <div className="flex items-start justify-between gap-2">
            <p className="font-mono text-xs sm:text-sm font-bold text-retro-black leading-snug">
              &ldquo;{currentRoast}&rdquo;
            </p>
            <button
              type="button"
              onClick={() => setRoastIndex((i) => i + 1)}
              className="retro-outset bg-retro-gray p-1 text-retro-black hover:bg-retro-yellow flex-shrink-0"
              title="Give me another roast"
              aria-label="Generate another roast"
            >
              <BiRefresh size={16} />
            </button>
          </div>
        </div>

        {/* Expandable Stats Diagnostic */}
        {isOpen && (
          <div className="retro-inset bg-retro-gray p-3 space-y-2 font-mono text-[11px] sm:text-xs text-retro-black border border-retro-muted">
            <div className="flex justify-between border-b border-retro-muted pb-1">
              <span className="font-bold uppercase text-retro-muted">TOTAL POOL SIZE:</span>
              <span className="font-black">{stats.total} TITLES</span>
            </div>

            <div className="flex justify-between border-b border-retro-muted pb-1">
              <span className="font-bold uppercase text-retro-muted">TIME TO CLEAR (1/NIGHT):</span>
              <span className="font-black text-right">
                ~{stats.yearsToFinish} YRS ({stats.finishMonthYear})
              </span>
            </div>

            {stats.topDecade && (
              <div className="flex justify-between border-b border-retro-muted pb-1">
                <span className="font-bold uppercase text-retro-muted">COMFORT ERA:</span>
                <span className="font-black">
                  {stats.topDecade} ({stats.topDecadePct}% of list)
                </span>
              </div>
            )}

            {stats.oldest && (
              <div className="flex justify-between border-b border-retro-muted pb-1">
                <span className="font-bold uppercase text-retro-muted">OLDEST HOARDED:</span>
                <span className="font-black truncate max-w-[200px]" title={stats.oldest.film.title}>
                  {stats.oldest.film.title} ({stats.oldest.year})
                </span>
              </div>
            )}

            {stats.newest && (
              <div className="flex justify-between">
                <span className="font-bold uppercase text-retro-muted">FRESHEST ADDITION:</span>
                <span className="font-black truncate max-w-[200px]" title={stats.newest.film.title}>
                  {stats.newest.film.title} ({stats.newest.year})
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
