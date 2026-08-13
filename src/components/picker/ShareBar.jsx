import { useState, useEffect } from 'react'
import { SiWhatsapp, SiX, SiTelegram, SiReddit } from 'react-icons/si'
import { BiLink, BiCheck, BiShareAlt } from 'react-icons/bi'

const SITE_URL = 'https://letterboxdrandomizer.vercel.app'

// Shared 3D bevel styling used across the retro buttons.
const raised = {
  borderColor: '#FFFFFF #808080 #808080 #FFFFFF',
  boxShadow: 'inset -1px -1px 0 #404040, inset 1px 1px 0 #DFDFDF',
}

function press(e) {
  e.currentTarget.style.borderColor = '#808080 #FFFFFF #FFFFFF #808080'
  e.currentTarget.style.boxShadow = 'inset 1px 1px 0 #404040, inset -1px -1px 0 #DFDFDF'
  e.currentTarget.style.transform = 'translate(1px, 1px)'
}

function release(e) {
  e.currentTarget.style.borderColor = raised.borderColor
  e.currentTarget.style.boxShadow = raised.boxShadow
  e.currentTarget.style.transform = 'translate(0, 0)'
}

function ShareButton({ href, onClick, bg, color, shadow, children, label }) {
  const Tag = href ? 'a' : 'button'
  return (
    <Tag
      {...(href
        ? { href, target: '_blank', rel: 'noopener noreferrer' }
        : { type: 'button', onClick })}
      aria-label={label}
      className="flex items-center justify-center gap-1.5 border-4 py-2 px-1 text-[10px] sm:text-xs font-black uppercase tracking-wider transition-none"
      style={{ backgroundColor: bg, color, textShadow: shadow ? `2px 2px 0 ${shadow}` : 'none', ...raised }}
      onMouseDown={press}
      onMouseUp={release}
      onMouseLeave={release}
    >
      {children}
    </Tag>
  )
}

export default function ShareBar({ film, watchlistOwners = [] }) {
  const [copied, setCopied] = useState(false)
  const [canNativeShare, setCanNativeShare] = useState(false)

  useEffect(() => {
    setCanNativeShare(typeof navigator !== 'undefined' && !!navigator.share)
  }, [])

  useEffect(() => {
    if (!copied) return
    const t = setTimeout(() => setCopied(false), 2000)
    return () => clearTimeout(t)
  }, [copied])

  const url = typeof window !== 'undefined' ? window.location.origin : SITE_URL

  const text = film
    ? watchlistOwners.length === 2
      ? `The wheel picked "${film.title}"${film.year ? ` (${film.year})` : ''} from ${watchlistOwners.join(' and ')}'s common Letterboxd films! Spin yours:`
      : `The wheel picked "${film.title}"${film.year ? ` (${film.year})` : ''} from my Letterboxd watchlist! Spin yours:`
    : `Can't decide what to watch? Spin your Letterboxd watchlist:`

  const encodedText = encodeURIComponent(text)
  const encodedUrl = encodeURIComponent(url)

  async function copyLink() {
    const payload = `${text} ${url}`
    try {
      await navigator.clipboard.writeText(payload)
      setCopied(true)
    } catch {
      // Clipboard API needs a secure context and permission; fall back to a
      // temporary textarea + execCommand.
      const ta = document.createElement('textarea')
      ta.value = payload
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      try {
        document.execCommand('copy')
        setCopied(true)
      } catch {
        // Nothing else we can do — leave the button unchanged.
      }
      document.body.removeChild(ta)
    }
  }

  async function nativeShare() {
    try {
      await navigator.share({ title: 'Letterboxd Randomizer', text, url })
    } catch {
      // User dismissed the share sheet.
    }
  }

  return (
    <div className="retro-outset-deep bg-retro-gray border-4 overflow-hidden">
      <div className="retro-titlebar px-3 py-2 flex justify-between items-center">
        <span className="font-bold text-sm">SHARE.EXE</span>
        <div className="flex gap-2">
          <div className="w-4 h-4 retro-outset bg-retro-yellow" />
          <div className="w-4 h-4 retro-outset bg-retro-yellow" />
          <div className="w-4 h-4 retro-outset bg-retro-red" />
        </div>
      </div>

      <div className="p-3 sm:p-4 retro-inset bg-retro-white space-y-3">
        <p className="text-center text-[10px] sm:text-xs font-black text-retro-black uppercase tracking-widest">
          Tell your friends what to watch
        </p>

        {canNativeShare && (
          <ShareButton
            onClick={nativeShare}
            bg="#00AA00"
            color="#FFFFFF"
            shadow="#004400"
            label="Share"
          >
            <BiShareAlt size={16} />
            SHARE&hellip;
          </ShareButton>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <ShareButton
            href={`https://wa.me/?text=${encodedText}%20${encodedUrl}`}
            bg="#25D366"
            color="#FFFFFF"
            shadow="#0B6B34"
            label="Share on WhatsApp"
          >
            <SiWhatsapp size={14} />
            WHATSAPP
          </ShareButton>

          <ShareButton
            href={`https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`}
            bg="#000000"
            color="#FFFFFF"
            shadow="#404040"
            label="Share on X"
          >
            <SiX size={14} />
            X / TWITTER
          </ShareButton>

          <ShareButton
            href={`https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`}
            bg="#229ED9"
            color="#FFFFFF"
            shadow="#0B4C6B"
            label="Share on Telegram"
          >
            <SiTelegram size={14} />
            TELEGRAM
          </ShareButton>

          <ShareButton
            href={`https://reddit.com/submit?url=${encodedUrl}&title=${encodedText}`}
            bg="#FF4500"
            color="#FFFFFF"
            shadow="#802200"
            label="Share on Reddit"
          >
            <SiReddit size={14} />
            REDDIT
          </ShareButton>
        </div>

        <ShareButton
          onClick={copyLink}
          bg={copied ? '#00AA00' : '#FFFF00'}
          color={copied ? '#FFFFFF' : '#000000'}
          shadow={copied ? '#004400' : '#808080'}
          label="Copy link"
        >
          {copied ? <BiCheck size={16} /> : <BiLink size={16} />}
          {copied ? 'COPIED TO CLIPBOARD!' : 'COPY LINK'}
        </ShareButton>

        <p className="text-center text-[10px] font-mono text-retro-muted break-all">
          {url}
        </p>
      </div>
    </div>
  )
}
