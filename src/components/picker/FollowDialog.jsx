import { useEffect, useRef } from 'react'
import { SiInstagram } from 'react-icons/si'
import { BiRocket } from 'react-icons/bi'

const FOCUSABLE_SELECTOR = [
  'button:not([disabled])',
  '[href]',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

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
      onClick={(event) => {
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
        className="w-[min(92vw,420px)] retro-outset-deep bg-retro-gray border-4 overflow-hidden shadow-[8px_8px_0_#000]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="retro-titlebar px-3 py-2 flex items-center justify-between gap-3">
          <span id="follow-dialog-title" className="font-bold text-xs sm:text-sm uppercase">SOCIALS</span>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="retro-outset bg-retro-gray text-retro-black px-2 py-1 text-[10px] font-black hover:bg-retro-yellow"
            aria-label="Close dialog"
          >
            CLOSE
          </button>
        </div>

        <div className="p-3 sm:p-4 retro-inset bg-retro-white space-y-3">
          <p id="follow-dialog-message" className="text-center text-[10px] sm:text-xs font-black text-retro-black uppercase tracking-wide">
            I&apos;M NOT KYLIE JENNER &mdash; JUST DM ME
          </p>
          <a
            href="https://instagram.com/basithladdu"
            target="_blank"
            rel="noopener noreferrer"
            className="retro-outset flex min-h-[44px] items-center justify-center gap-2 px-2 py-2 text-xs sm:text-sm font-black text-retro-black no-underline hover:bg-retro-yellow transition-colors touch-manipulation"
          >
            <SiInstagram size={16} aria-hidden="true" />
            <span>INSTAGRAM</span>
          </a>

          <div className="retro-hr" />

          <a
            href="https://wedevit.in"
            target="_blank"
            rel="noopener noreferrer"
            className="retro-outset flex min-h-[44px] items-center justify-center gap-2 px-2 py-2 text-[10px] sm:text-xs font-black text-retro-black no-underline hover:bg-retro-yellow transition-colors touch-manipulation text-center"
          >
            <BiRocket size={16} aria-hidden="true" />
            <span>WANT US TO BUILD YOUR SOFTWARE? WEDEVIT.IN</span>
          </a>
        </div>
      </section>
    </div>
  )
}
