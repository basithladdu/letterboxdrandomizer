export default function Header() {
  return (
    <header className="retro-outset sticky top-0 z-10 bg-retro-gray border-b-4 border-retro-muted">
      <div className="retro-titlebar px-2 sm:px-4 py-2 flex items-center justify-between gap-2 overflow-x-auto">
        {/* Logo & Title */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {/* Letterboxd Logo Circles (90s style, no border radius) */}
          <div className="flex gap-1 border-2 border-retro-white p-1" style={{borderColor: '#FFFFFF #808080 #808080 #FFFFFF'}}>
            <div className="h-3 w-3 sm:h-4 sm:w-4 bg-retro-green" />
            <div className="h-3 w-3 sm:h-4 sm:w-4 bg-[#00ADEF]" />
            <div className="h-3 w-3 sm:h-4 sm:w-4 bg-[#FF8000]" />
          </div>
          <h1 className="font-black text-sm sm:text-xl tracking-tight uppercase whitespace-nowrap" style={{textShadow: '2px 2px 0 #404040'}}>
            LETTERBOXD
          </h1>
          <span className="border-l-4 border-retro-white pl-2 sm:pl-3 font-black text-xs sm:text-lg text-retro-yellow tracking-tight uppercase whitespace-nowrap">
            RANDOMIZER
          </span>
        </div>
      </div>

      {/* Marquee Sub-header */}
      <div className="marquee-container bg-retro-yellow text-retro-black border-t-2 border-b-2 border-retro-black">
        <p className="marquee-text font-bold tracking-wide">
          SPIN THE WHEEL AND GET YOUR NEXT FILM • FULLY RANDOM • DISCOVER YOUR NEXT WATCH
        </p>
      </div>
    </header>
  )
}
