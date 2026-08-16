import { useEffect, useRef, useState } from 'react'
import { BiCopy, BiCheck } from 'react-icons/bi'

const FOCUSABLE_SELECTOR = [
  'button:not([disabled])',
  '[href]',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

const paymentMethods = [
  { label: 'KO-FI', value: 'ko-fi.com/basithladoo', href: 'https://ko-fi.com/basithladoo' },
  { label: 'PAYPAL', value: 'paypal.me/basithladdu', href: 'https://paypal.me/basithladdu' },
  { label: 'UPI (GPAY / PHONEPE / PAYTM)', value: 'basithmuqeeth-1@okhdfcbank', copyable: true },
]

export default function SupportDialog({ onClose }) {
  const dialogRef = useRef(null)
  const closeButtonRef = useRef(null)
  const [copiedKey, setCopiedKey] = useState(null)

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
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
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

  const copyToClipboard = async (text, key) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedKey(key)
      setTimeout(() => setCopiedKey(null), 2000)
    } catch {
      // Fallback
    }
  }

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
        aria-labelledby="support-dialog-title"
        tabIndex={-1}
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
              <dd className="mt-1 font-mono text-xs sm:text-sm font-bold text-retro-black break-all flex items-center justify-between gap-2">
                {method.href ? (
                  <a
                    href={method.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-2 hover:bg-retro-yellow"
                  >
                    {method.value}
                  </a>
                ) : (
                  <span>{method.value}</span>
                )}

                {method.copyable && (
                  <button
                    type="button"
                    onClick={() => copyToClipboard(method.value, method.label)}
                    className="retro-outset bg-retro-yellow text-retro-black px-2 py-1 text-[10px] font-black hover:bg-[#FFE033] flex items-center gap-1 flex-shrink-0"
                    aria-label={`Copy ${method.label}`}
                  >
                    {copiedKey === method.label ? (
                      <>
                        <BiCheck size={12} /> COPIED!
                      </>
                    ) : (
                      <>
                        <BiCopy size={12} /> COPY
                      </>
                    )}
                  </button>
                )}
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  )
}
