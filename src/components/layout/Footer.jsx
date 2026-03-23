import { BiBullseye, BiSmile, BiVolumeFull } from 'react-icons/bi'

export default function Footer() {
  return (
    <footer className="mt-auto border-t-4 border-retro-muted py-6 px-4 bg-retro-gray space-y-4">
      <div className="retro-hr" />

      {/* Disclaimer */}
      <p className="text-center text-xs font-bold text-retro-black">
        NOT OFFICIALLY AFFILIATED WITH LETTERBOXD
      </p>
      <p className="text-center text-xs text-retro-black">
        Uses public watchlist pages &amp; optional OMDb API for posters.
      </p>

      {/* Creator Info */}
      <p className="text-center text-xs font-mono text-retro-black">
        By{' '}
        <a
          href="https://letterboxd.com/basithladdu"
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold hover:bg-retro-yellow"
        >
          basithladdu
        </a>
        {' '}|{' '}
        <a
          href="https://twitter.com/basithladoo"
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold hover:bg-retro-yellow"
        >
          Twitter
        </a>
        {' '}|{' '}
        <a
          href="https://instagram.com/basithladdu"
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold hover:bg-retro-yellow"
        >
          Instagram
        </a>
        {' '}|{' '}
        <a
          href="https://github.com/basithladdu/letterboxdrandomizer"
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold hover:bg-retro-yellow"
        >
          GitHub
        </a>
      </p>

      {/* Decorative Footer Elements */}
      <div className="flex justify-center gap-3 text-base font-bold">
        <span className="retro-outset p-2 bg-retro-yellow text-retro-black"><BiBullseye size={16} /></span>
        <span className="retro-outset p-2 bg-retro-red text-retro-white"><BiSmile size={16} /></span>
        <span className="retro-outset p-2 bg-retro-blue text-retro-white"><BiVolumeFull size={16} /></span>
      </div>
    </footer>
  )
}
