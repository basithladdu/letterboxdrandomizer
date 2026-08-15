import { BiBullseye, BiSmile, BiVolumeFull } from 'react-icons/bi'

export default function Footer() {
  return (
    <footer className="mt-auto overflow-hidden border-t-4 border-retro-muted py-4 sm:py-6 px-3 sm:px-4 bg-retro-gray space-y-4 sm:space-y-6">
      <div className="retro-hr" />

      {/* Disclaimer */}
      <div className="space-y-1">
        <p className="text-center text-[10px] sm:text-xs font-black text-retro-black uppercase">
          NOT OFFICIALLY AFFILIATED WITH LETTERBOXD
        </p>
        <p className="text-center text-[10px] sm:text-xs text-retro-muted font-mono uppercase">
          Uses public data &amp; CORS proxies for watchlist discovery
        </p>
      </div>

      {/* Decorative Footer Elements */}
      <div className="flex justify-center gap-2 sm:gap-3 text-base font-bold">
        <span className="retro-outset p-1.5 sm:p-2 bg-retro-yellow text-retro-black"><BiBullseye size={14} /></span>
        <span className="retro-outset p-1.5 sm:p-2 bg-retro-red text-retro-white"><BiSmile size={14} /></span>
        <span className="retro-outset p-1.5 sm:p-2 bg-retro-blue text-retro-white"><BiVolumeFull size={14} /></span>
      </div>

      <p className="text-center text-[10px] sm:text-xs font-black uppercase text-retro-black">
        SHAMELESS PLUG:{' '}
        <a
          href="https://wedevit.in"
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-2 hover:bg-retro-yellow"
        >
          WANT US TO BUILD YOUR SOFTWARE? WEDEVIT.IN
        </a>
      </p>
    </footer>
  )
}
