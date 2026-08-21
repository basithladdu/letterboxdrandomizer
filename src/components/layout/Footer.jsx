import { BiBullseye, BiSmile, BiVolumeFull } from 'react-icons/bi'
import SupportButton from '../shared/SupportButton.jsx'

export default function Footer() {
  return (
    <footer className="mt-auto overflow-hidden border-t-4 border-retro-muted py-4 sm:py-6 px-3 sm:px-4 bg-retro-gray space-y-4 sm:space-y-6">
      <div className="retro-hr" />

      <div className="flex justify-center">
        <SupportButton
          className="retro-outset flex items-center justify-center gap-2 px-4 py-2 text-[10px] sm:text-xs font-black uppercase text-retro-black bg-retro-yellow hover:bg-[#FFE033] transition-colors touch-manipulation"
          iconSize={14}
        />
      </div>

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
    </footer>
  )
}
