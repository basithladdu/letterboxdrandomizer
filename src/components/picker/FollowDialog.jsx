import { useEffect, useRef } from 'react'
import { SiInstagram, SiLetterboxd, SiX } from 'react-icons/si'

const FOCUSABLE_SELECTOR = [
  'button:not([disabled])',
  '[href]',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

const socials = [
  { label: 'INSTAGRAM', href: 'https://instagram.com/basithladdu', Icon: SiInstagram },
  { label: 'TWITTER / X', href: 'https://twitter.com/basithladoo', Icon: SiX },
  { label: 'LETTERBOXD', href: 'https://letterboxd.com/basithladoo', Icon: SiLetterboxd },
]

export default function FollowDialog({ onClose }) {
  const dialogRef = useRef(null)
  const closeButtonRef = useRef(null)

  useEffect(() => {
    closeButtonRef.current?.focus()
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }

      if (event.key !== 'Tab' || !dialogRef.current) return
      const focusable = [...dialogRef.current.querySelectorAll(FOCUSABLE_SELECTOR)]
      if (!focusable.length) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      const active = document.activeElement

      if (!dialogRef.current.contains(active)) {
        event.preventDefault()
        ;(event.shiftKey ? last : first).focus()
      } else if (event.shiftKey && active === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && active === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 p-3 sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <section
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="follow-dialog-title"
        aria-describedby="follow-dialog-message"
        tabIndex={-1}
        className="w-[min(92vw,460px)] retro-outset-deep bg-retro-gray border-4 overflow-hidden"
      >
        <div className="retro-titlebar px-3 py-2 flex items-center justify-between gap-3">
          <span id="follow-dialog-title" className="font-bold text-xs sm:text-sm">FOLLOW ME</span>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="retro-outset bg-retro-gray text-retro-black px-2 py-1 text-[10px] font-black hover:bg-retro-yellow"
            aria-label="Close follow dialog"
          >
            CLOSE
          </button>
        </div>

        <div className="p-3 sm:p-4 retro-inset bg-retro-white space-y-3">
          <p id="follow-dialog-message" className="text-center text-[10px] sm:text-xs font-black text-retro-black uppercase tracking-wide">
            I&apos;M NOT KYLIE JENNER &mdash; JUST DM ME
          </p>
          <div className="grid grid-cols-3 gap-2">
            {socials.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="retro-outset flex min-h-[44px] items-center justify-center gap-2 px-2 py-2 text-[10px] sm:text-xs font-black text-retro-black no-underline hover:bg-retro-yellow transition-colors touch-manipulation"
              >
                <Icon size={15} aria-hidden="true" />
                {label}
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
