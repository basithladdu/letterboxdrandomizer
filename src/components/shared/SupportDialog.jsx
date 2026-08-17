import { useEffect, useRef, useState } from 'react'
import { BiCopy, BiCheck, BiLinkExternal } from 'react-icons/bi'

const FOCUSABLE_SELECTOR = [
  'button:not([disabled])',
  '[href]',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

const paymentMethods = [
  {
    label: 'KO-FI ($ / EUR / GLOBAL)',
    value: 'https://ko-fi.com/basithladoo',
    display: 'ko-fi.com/basithladoo',
    href: 'https://ko-fi.com/basithladoo',
    badge: '$',
  },
  {
    label: 'PAYPAL (USD / GLOBAL)',
    value: 'https://paypal.me/basithladdu',
    display: 'paypal.me/basithladdu',
    href: 'https://paypal.me/basithladdu',
    badge: '$',
  },
  {
    label: 'UPI (GPAY / PHONEPE / PAYTM)',
    value: 'basithmuqeeth-1@okhdfcbank',
    display: 'basithmuqeeth-1@okhdfcbank',
    badge: '₹',
  },
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
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <section
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="support-dialog-title"
        tabIndex={-1}
        className="w-[min(92vw,440px)] retro-outset-deep bg-retro-gray border-4 overflow-hidden shadow-[8px_8px_0_#000]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="retro-titlebar px-3 py-2 flex items-center justify-between gap-3">
          <span id="support-dialog-title" className="font-bold text-xs sm:text-sm uppercase">BUY ME A COFFEE</span>
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

        <div className="p-3 sm:p-4 retro-inset bg-retro-white space-y-3">
          {paymentMethods.map((method) => (
            <div key={method.label} className="retro-outset bg-retro-gray border-2 p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] sm:text-xs font-black uppercase text-retro-black">{method.label}</span>
                {method.badge && (
                  <span className="bg-retro-yellow text-retro-black font-black text-[9px] px-1.5 py-0.5 border border-retro-black">
                    {method.badge}
                  </span>
                )}
              </div>

              <div className="font-mono text-xs sm:text-sm font-bold text-retro-black break-all">
                {method.display}
              </div>

              <div className="flex items-center gap-2 pt-1">
                {method.href && (
                  <a
                    href={method.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="retro-outset bg-[#00AA00] hover:bg-[#00CC00] text-retro-white px-3 py-1 text-[10px] sm:text-xs font-black flex items-center gap-1.5 no-underline flex-1 justify-center"
                  >
                    <BiLinkExternal size={14} /> OPEN LINK ↗
                  </a>
                )}

                <button
                  type="button"
                  onClick={() => copyToClipboard(method.value, method.label)}
                  className="retro-outset bg-retro-yellow text-retro-black px-3 py-1 text-[10px] sm:text-xs font-black hover:bg-[#FFE033] flex items-center gap-1 flex-1 justify-center"
                  aria-label={`Copy ${method.label}`}
                >
                  {copiedKey === method.label ? (
                    <>
                      <BiCheck size={14} className="text-green-800" /> COPIED!
                    </>
                  ) : (
                    <>
                      <BiCopy size={14} /> COPY
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
