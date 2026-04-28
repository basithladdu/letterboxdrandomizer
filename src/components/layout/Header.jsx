export default function Header() {
  return (
    <header className="retro-outset sticky top-0 z-10 bg-retro-gray border-b-4 border-retro-muted">
      <div className="retro-titlebar px-2 sm:px-4 py-2 flex items-center justify-between gap-2 overflow-x-auto">
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
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

      <div className="marquee-container bg-retro-yellow text-retro-black border-t-4 border-b-4 border-retro-black shadow-md">
        <p className="marquee-text font-bold tracking-wide text-sm">
          ★ SPIN THE WHEEL AND GET YOUR NEXT FILM ★ FULLY RANDOM ★ DISCOVER YOUR NEXT WATCH ★
        </p>
      </div>
    </header>
  )
}
