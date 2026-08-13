import { useEffect, useRef } from 'react'

const FOCUSABLE_SELECTOR = [
  'button:not([disabled])',
  '[href]',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

export default function ErrorBanner({ message, onDismiss }) {
  const dialogRef = useRef(null)
  const closeButtonRef = useRef(null)

  useEffect(() => {
    if (!message) return undefined

    const previousActiveElement = document.activeElement
    ;(closeButtonRef.current || dialogRef.current)?.focus()

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        event.preventDefault()
        onDismiss?.()
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
      document.removeEventListener('keydown', handleKeyDown)
      if (previousActiveElement instanceof HTMLElement) previousActiveElement.focus()
    }
  }, [message, onDismiss])

  if (!message) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onDismiss?.()
      }}
    >
      <div
        ref={dialogRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="error-dialog-title"
        tabIndex={-1}
        className="w-full max-w-lg retro-outset-deep border-4 overflow-hidden"
      >
        <div className="retro-titlebar px-3 py-2 flex justify-between items-center">
          <span id="error-dialog-title" className="font-bold text-xs uppercase">ERROR MESSAGE</span>
          <div className="flex gap-2">
            <div className="w-3 h-3 retro-outset bg-retro-red" />
          </div>
        </div>
        <div className="retro-inset bg-retro-panelYellow p-4 flex items-start gap-3">
          <span aria-hidden="true" className="font-bold text-retro-red text-lg flex-shrink-0">!</span>
          <p className="flex-1 text-sm sm:text-base font-bold text-retro-black break-words">{message}</p>
          {onDismiss && (
            <button
              ref={closeButtonRef}
              type="button"
              onClick={onDismiss}
              className="font-bold text-retro-black hover:bg-retro-yellow text-xs px-3 py-2 border-2 flex-shrink-0"
              style={{ borderColor: '#FFFFFF #808080 #808080 #FFFFFF', boxShadow: 'inset -1px -1px 0 #404040, inset 1px 1px 0 #DFDFDF' }}
              aria-label="Dismiss error"
            >
              CLOSE
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
