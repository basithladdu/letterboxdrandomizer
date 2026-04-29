import { BiBullseye, BiSmile, BiVolumeFull } from 'react-icons/bi'
import { SiLetterboxd, SiGithub, SiX } from 'react-icons/si'

export default function Footer() {
  return (
    <footer className="mt-auto border-t-4 border-retro-muted py-4 sm:py-6 px-3 sm:px-4 bg-retro-gray space-y-4 sm:space-y-6">
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

      {/* Creator Socials */}
      <div className="flex flex-col items-center gap-4 py-2">
        <p className="text-[10px] sm:text-xs font-black text-retro-black uppercase tracking-widest border-b-2 border-retro-black">
          Those my social handles:
        </p>
        <div className="flex gap-6 sm:gap-12">
          <a
            href="https://letterboxd.com/basithladoo"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-[10px] sm:text-xs font-bold text-retro-black hover:bg-retro-yellow px-1 transition-colors"
          >
            <SiLetterboxd size={14} />
            <span>LETTERBOXD</span>
          </a>
          <a
            href="https://github.com/basithladdu/letterboxdrandomizer"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-[10px] sm:text-xs font-bold text-retro-black hover:bg-retro-yellow px-1 transition-colors"
          >
            <SiGithub size={14} />
            <span>GITHUB</span>
          </a>
          <a
            href="https://twitter.com/basithladoo"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-[10px] sm:text-xs font-bold text-retro-black hover:bg-retro-yellow px-1 transition-colors"
          >
            <SiX size={14} />
            <span>TWITTER</span>
          </a>
        </div>
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
