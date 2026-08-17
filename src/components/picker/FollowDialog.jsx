import { useEffect, useRef, useState } from 'react'
import { SiInstagram, SiLetterboxd, SiX } from 'react-icons/si'
import { BiCoffee, BiCopy, BiCheck, BiLinkExternal } from 'react-icons/bi'

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

export default function FollowDialog({ onClose }) {
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
        aria-labelledby="follow-dialog-title"
        aria-describedby="follow-dialog-message"
        tabIndex={-1}
        className="w-[min(92vw,480px)] retro-outset-deep bg-retro-gray border-4 overflow-hidden shadow-[8px_8px_0_#000]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="retro-titlebar px-3 py-2 flex items-center justify-between gap-3">
          <span id="follow-dialog-title" className="font-bold text-xs sm:text-sm uppercase">SUPPORT &amp; SOCIALS</span>
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

        <div className="p-3 sm:p-4 retro-inset bg-retro-white space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Socials section */}
          <div className="space-y-2">
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
                  className="retro-outset flex min-h-[44px] items-center justify-center gap-1.5 px-1.5 py-2 text-[9px] sm:text-xs font-black text-retro-black no-underline hover:bg-retro-yellow transition-colors touch-manipulation"
                >
                  <Icon size={14} aria-hidden="true" />
                  <span className="truncate">{label}</span>
                </a>
              ))}
            </div>
          </div>

          <div className="retro-hr" />

          {/* Support / Buy me a coffee section */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-center gap-1.5 text-retro-black">
              <BiCoffee size={16} />
              <p className="text-center text-[10px] sm:text-xs font-black uppercase tracking-wide">
                IF YOU WANNA BUY ME A COFFEE
              </p>
            </div>

            <div className="space-y-2.5">
              {paymentMethods.map((method) => (
                <div key={method.label} className="retro-outset bg-retro-gray border-2 p-2.5 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] sm:text-[10px] font-black uppercase text-retro-black">{method.label}</span>
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
                        className="retro-outset bg-[#00AA00] hover:bg-[#00CC00] text-retro-white px-2.5 py-1 text-[10px] font-black flex items-center gap-1 no-underline flex-1 justify-center"
                      >
                        <BiLinkExternal size={13} /> OPEN LINK ↗
                      </a>
                    )}

                    <button
                      type="button"
                      onClick={() => copyToClipboard(method.value, method.label)}
                      className="retro-outset bg-retro-yellow text-retro-black px-2.5 py-1 text-[10px] font-black hover:bg-[#FFE033] flex items-center gap-1 flex-1 justify-center"
                      aria-label={`Copy ${method.label}`}
                    >
                      {copiedKey === method.label ? (
                        <>
                          <BiCheck size={13} className="text-green-800" /> COPIED!
                        </>
                      ) : (
                        <>
                          <BiCopy size={13} /> COPY
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
