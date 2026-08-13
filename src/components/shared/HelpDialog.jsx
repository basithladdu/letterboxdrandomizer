import { useEffect, useRef } from 'react'

const FOCUSABLE_SELECTOR = [
  'button:not([disabled])',
  '[href]',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

export default function HelpDialog({ mode, onClose }) {
  const dialogRef = useRef(null)
  const closeButtonRef = useRef(null)
  const isCompare = mode === 'compare'

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
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="help-dialog-title"
        tabIndex={-1}
        className="w-[min(92vw,720px)] max-h-[88vh] retro-outset-deep bg-retro-gray border-4 overflow-hidden"
      >
        <div className="retro-titlebar px-3 py-2 flex items-center justify-between gap-3">
          <span id="help-dialog-title" className="font-bold text-xs sm:text-sm">HELP.EXE</span>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="retro-outset bg-retro-gray text-retro-black px-2 py-1 text-[10px] font-black hover:bg-retro-yellow"
            aria-label="Close help"
          >
            CLOSE
          </button>
        </div>

        <div className="max-h-[calc(88vh-3.5rem)] overflow-y-auto p-3 sm:p-5 retro-inset bg-retro-white space-y-3 sm:space-y-4">
          <div className="retro-outset bg-retro-panelYellow border-2 p-3 sm:p-4">
            <h2 className="text-base sm:text-xl font-black uppercase text-retro-black">
              {isCompare ? 'FIND COMMON FILMS' : 'PICK A RANDOM FILM'}
            </h2>
            <p className="mt-2 text-xs sm:text-sm font-bold text-retro-black leading-relaxed">
              {isCompare
                ? 'Enter two Letterboxd usernames and the wheel will use only films that appear in both public watchlists.'
                : 'Enter a Letterboxd username and the wheel will choose from every film in that public watchlist.'}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="retro-inset bg-retro-gray p-3">
              <h3 className="text-xs sm:text-sm font-black uppercase text-retro-black">01. ENTER USERNAMES</h3>
              <p className="mt-2 text-[11px] sm:text-xs font-bold text-retro-black leading-relaxed">
                {isCompare
                  ? 'Use two different Letterboxd usernames. Both watchlists must be public.'
                  : 'Use the exact Letterboxd username. The watchlist must be public.'}
              </p>
            </div>
            <div className="retro-inset bg-retro-gray p-3">
              <h3 className="text-xs sm:text-sm font-black uppercase text-retro-black">02. FETCH FILMS</h3>
              <p className="mt-2 text-[11px] sm:text-xs font-bold text-retro-black leading-relaxed">
                {isCompare ? 'Click FIND COMMON FILMS.' : 'Click FETCH WATCHLIST.'} Every available page is read before the spin starts.
              </p>
            </div>
            <div className="retro-inset bg-retro-gray p-3">
              <h3 className="text-xs sm:text-sm font-black uppercase text-retro-black">03. SPIN</h3>
              <p className="mt-2 text-[11px] sm:text-xs font-bold text-retro-black leading-relaxed">
                The slot-machine sound plays with the wheel. Use SPIN AGAIN for another pick.
              </p>
            </div>
            <div className="retro-inset bg-retro-gray p-3">
              <h3 className="text-xs sm:text-sm font-black uppercase text-retro-black">04. OPEN A FILM</h3>
              <p className="mt-2 text-[11px] sm:text-xs font-bold text-retro-black leading-relaxed">
                In Common Films mode, COMMON FILMS lists every match. Select any title to open it on Letterboxd.
              </p>
            </div>
          </div>

          <div className="retro-outset bg-retro-white border-2 p-3">
            <p className="text-[10px] sm:text-xs font-black uppercase tracking-wide text-retro-black">
              If a username is wrong, private, empty, or unavailable, the app will show a clear error dialog.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-full retro-outset bg-retro-blue text-retro-white py-2 sm:py-3 text-xs sm:text-sm font-black uppercase tracking-widest hover:brightness-110"
          >
            GOT IT
          </button>
        </div>
      </div>
    </div>
  )
}
