import { SiGithub, SiInstagram, SiLetterboxd, SiX } from 'react-icons/si'

export default function CreatorLinks() {
  return (
    <section className="retro-outset bg-retro-gray border-2" aria-labelledby="creator-links-title">
      <div className="retro-titlebar px-3 py-1 flex items-center justify-between">
        <span id="creator-links-title" className="font-bold text-xs">MY SOCIALS</span>
        <div className="flex gap-1">
          <div className="w-2 h-2 bg-retro-red border border-retro-black" />
          <div className="w-2 h-2 bg-retro-yellow border border-retro-black" />
        </div>
      </div>
      <div className="p-2 bg-retro-white space-y-2">
        <p className="text-center text-[10px] sm:text-xs font-black text-retro-black uppercase tracking-wide">
          I&apos;M NOT KYLIE JENNER &mdash; JUST DM ME
        </p>
        <div className="grid grid-cols-2 gap-2">
          <a
            href="https://instagram.com/basithladdu"
            target="_blank"
            rel="noopener noreferrer"
            className="retro-outset flex items-center justify-center gap-2 px-2 py-2 text-[10px] sm:text-xs font-black text-retro-black no-underline hover:bg-retro-yellow transition-colors"
          >
            <SiInstagram size={15} aria-hidden="true" />
            INSTAGRAM
          </a>
          <a
            href="https://twitter.com/basithladoo"
            target="_blank"
            rel="noopener noreferrer"
            className="retro-outset flex items-center justify-center gap-2 px-2 py-2 text-[10px] sm:text-xs font-black text-retro-black no-underline hover:bg-retro-yellow transition-colors"
          >
            <SiX size={15} aria-hidden="true" />
            TWITTER / X
          </a>
          <a
            href="https://letterboxd.com/basithladoo"
            target="_blank"
            rel="noopener noreferrer"
            className="retro-outset flex items-center justify-center gap-2 px-2 py-2 text-[10px] sm:text-xs font-black text-retro-black no-underline hover:bg-retro-yellow transition-colors"
          >
            <SiLetterboxd size={15} aria-hidden="true" />
            LETTERBOXD
          </a>
          <a
            href="https://github.com/basithladdu/letterboxdrandomizer"
            target="_blank"
            rel="noopener noreferrer"
            className="retro-outset flex items-center justify-center gap-2 px-2 py-2 text-[10px] sm:text-xs font-black text-retro-black no-underline hover:bg-retro-yellow transition-colors"
          >
            <SiGithub size={15} aria-hidden="true" />
            GITHUB
          </a>
        </div>
      </div>
    </section>
  )
}
