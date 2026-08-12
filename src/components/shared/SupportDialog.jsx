import { useEffect, useRef } from 'react'

const paymentMethods = [
  { label: 'PAYPAL', value: 'basithladdu' },
  { label: 'GPAY / HDFC', value: 'basithmuqeeth-1@okhdfcbank' },
]

export default function SupportDialog({ onClose }) {
  const closeButtonRef = useRef(null)

  useEffect(() => {
    closeButtonRef.current?.focus()
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function handleKeyDown(event) {
      if (event.key === 'Escape') onClose()
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
        role="dialog"
        aria-modal="true"
        aria-labelledby="support-dialog-title"
        className="w-[min(92vw,420px)] retro-outset-deep bg-retro-gray border-4 overflow-hidden"
      >
        <div className="retro-titlebar px-3 py-2 flex items-center justify-between gap-3">
          <span id="support-dialog-title" className="font-bold text-xs sm:text-sm">BUY ME A COFFEE</span>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="retro-outset bg-retro-gray text-retro-black px-2 py-1 text-[10px] font-black hover:bg-retro-yellow"
            aria-label="Close payment options"
          >
            CLOSE
          </button>
        </div>

        <dl className="p-3 sm:p-4 retro-inset bg-retro-white space-y-3">
          {paymentMethods.map((method) => (
            <div key={method.label} className="retro-outset bg-retro-gray border-2 p-3">
              <dt className="text-[10px] sm:text-xs font-black uppercase text-retro-black">{method.label}</dt>
              <dd className="mt-1 font-mono text-xs sm:text-sm font-bold text-retro-black break-all">{method.value}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  )
}
