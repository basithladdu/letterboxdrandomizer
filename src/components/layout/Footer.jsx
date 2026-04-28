import { BiBullseye, BiSmile, BiVolumeFull } from 'react-icons/bi'

export default function Footer() {
  return (
    <footer className="mt-auto border-t-4 border-retro-muted py-4 sm:py-6 px-3 sm:px-4 bg-retro-gray space-y-3 sm:space-y-4">
      <div className="retro-hr" />

      {/* Disclaimer */}
      <p className="text-center text-[10px] sm:text-xs font-bold text-retro-black">
        NOT OFFICIALLY AFFILIATED WITH LETTERBOXD
      </p>
      <p className="text-center text-[10px] sm:text-xs text-retro-black">
        Uses public watchlist pages &amp; optional OMDb API for posters.
      </p>

      {/* Creator Info */}
      <p className="text-center text-[10px] sm:text-xs font-mono text-retro-black break-words">
        <a
          href="https://letterboxd.com/basithladoo"
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold hover:bg-retro-yellow"
        >
          Letterboxd
        </a>
        <span className="hidden sm:inline">{' '}|{' '}</span>
        <span className="sm:hidden block">|</span>
        <a
          href="https://twitter.com/basithladoo"
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold hover:bg-retro-yellow"
        >
          Twitter
        </a>
        <span className="hidden sm:inline">{' '}|{' '}</span>
        <span className="sm:hidden block">|</span>
        <a
          href="https://instagram.com/basithladdu"
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold hover:bg-retro-yellow"
        >
          Instagram
        </a>
        <span className="hidden sm:inline">{' '}|{' '}</span>
        <span className="sm:hidden block">|</span>
        <a
          href="https://github.com/basithladoo/letterboxdrandomizer"
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold hover:bg-retro-yellow"
        >
          GitHub
        </a>
      </p>

      {/* Decorative Footer Elements */}
      <div className="flex justify-center gap-2 sm:gap-3 text-base font-bold">
        <span className="retro-outset p-1.5 sm:p-2 bg-retro-yellow text-retro-black"><BiBullseye size={14} className="sm:w-4 sm:h-4" /></span>
        <span className="retro-outset p-1.5 sm:p-2 bg-retro-red text-retro-white"><BiSmile size={14} className="sm:w-4 sm:h-4" /></span>
        <span className="retro-outset p-1.5 sm:p-2 bg-retro-blue text-retro-white"><BiVolumeFull size={14} className="sm:w-4 sm:h-4" /></span>
      </div>
    </footer>
  )
}
