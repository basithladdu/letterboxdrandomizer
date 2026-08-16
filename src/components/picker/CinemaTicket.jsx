import { useState, useRef, useEffect, useCallback } from 'react'
import { BiDownload, BiCopy, BiCheck, BiShareAlt } from 'react-icons/bi'
import { SiWhatsapp, SiX } from 'react-icons/si'

export default function CinemaTicket({ film, watchlistOwners = [] }) {
  const [downloading, setDownloading] = useState(false)
  const [copiedImage, setCopiedImage] = useState(false)
  const [ticketNumber, setTicketNumber] = useState('')

  useEffect(() => {
    // Generate deterministic ticket number
    const num = Math.floor(100000 + Math.random() * 900000)
    setTicketNumber(`LBX-${num}`)
  }, [film?.letterboxdSlug])

  const ticketDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  const getSourceLabel = useCallback(() => {
    if (!watchlistOwners || watchlistOwners.length === 0) return 'LETTERBOXD WATCHLIST'
    if (watchlistOwners.length === 1) return `FOR @${watchlistOwners[0].toUpperCase()}`
    if (watchlistOwners.length === 2) return `COMMON PICK: @${watchlistOwners[0]} + @${watchlistOwners[1]}`
    return `GROUP NIGHT: ${watchlistOwners.map((u) => `@${u}`).join(', ')}`
  }, [watchlistOwners])

  // Canvas-based Ticket Image Generator
  const generateTicketCanvas = useCallback(() => {
    const canvas = document.createElement('canvas')
    const width = 1000
    const height = 520
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (!ctx) return null

    // Background gradient / vintage ticket paper
    ctx.fillStyle = '#EBE3D5'
    ctx.fillRect(0, 0, width, height)

    // Inner ticket border
    ctx.strokeStyle = '#1F1F1F'
    ctx.lineWidth = 6
    ctx.strokeRect(24, 24, width - 48, height - 48)

    // Secondary dashed border
    ctx.setLineDash([8, 6])
    ctx.lineWidth = 2
    ctx.strokeStyle = '#666666'
    ctx.strokeRect(36, 36, width - 72, height - 72)
    ctx.setLineDash([])

    // Ticket Header bar
    ctx.fillStyle = '#FFD200'
    ctx.fillRect(40, 40, width - 80, 52)
    ctx.fillStyle = '#111111'
    ctx.font = '900 24px monospace'
    ctx.textAlign = 'left'
    ctx.fillText('★ ADMIT ONE : CINEMA TICKET', 60, 75)

    ctx.textAlign = 'right'
    ctx.font = '700 20px monospace'
    ctx.fillText(ticketNumber || 'LBX-892410', width - 60, 75)

    // Left ticket section (Film Details)
    const titleText = (film?.title || 'UNTITLED FILM').toUpperCase()
    ctx.textAlign = 'left'
    ctx.fillStyle = '#111111'

    // Adjust font size for long titles
    ctx.font = titleText.length > 25 ? '900 36px sans-serif' : '900 44px sans-serif'
    ctx.fillText(titleText.slice(0, 36), 60, 155)

    // Year & Letterboxd Rating
    ctx.font = '700 22px monospace'
    ctx.fillStyle = '#444444'
    const yearStr = film?.year ? `YEAR: ${film.year}` : 'YEAR: UNKNOWN'
    const ratingStr = film?.rating ? `  |  RATING: ${film.rating} / 5.0 ★` : ''
    ctx.fillText(`${yearStr}${ratingStr}`, 60, 195)

    // Watchlist attendee info
    ctx.fillStyle = '#006600'
    ctx.font = '800 20px monospace'
    const sourceText = getSourceLabel()
    ctx.fillText(`🎟️ ${sourceText.slice(0, 55)}`, 60, 240)

    if (film?.overlapCount && film?.totalUsers && film.totalUsers > 2) {
      ctx.fillStyle = '#660000'
      ctx.font = '700 18px monospace'
      ctx.fillText(`SHARED BY: ${film.overlapCount} OF ${film.totalUsers} FRIENDS (${(film.sharedBy || []).join(', ')})`, 60, 272)
    }

    // Date
    ctx.fillStyle = '#777777'
    ctx.font = '600 18px monospace'
    ctx.fillText(`DATE DRAWN: ${ticketDate.toUpperCase()}`, 60, 315)

    // Perforation vertical line
    const perfX = 720
    ctx.setLineDash([6, 6])
    ctx.strokeStyle = '#888888'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(perfX, 40)
    ctx.lineTo(perfX, height - 40)
    ctx.stroke()
    ctx.setLineDash([])

    // Perforation notch circles (top and bottom)
    ctx.fillStyle = '#C0C0C0'
    ctx.beginPath()
    ctx.arc(perfX, 24, 18, 0, Math.PI * 2)
    ctx.arc(perfX, height - 24, 18, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = '#1F1F1F'
    ctx.lineWidth = 4
    ctx.stroke()

    // Right stub section (Barcode & Quick info)
    ctx.save()
    ctx.translate(perfX + 25, 60)

    ctx.fillStyle = '#111111'
    ctx.font = '900 18px monospace'
    ctx.textAlign = 'center'
    ctx.fillText('STUB #', 110, 30)
    ctx.font = '700 16px monospace'
    ctx.fillText(ticketNumber || 'LBX-892410', 110, 55)

    // Simulated Barcode
    const barWidths = [3, 1, 4, 2, 6, 2, 1, 5, 2, 4, 1, 3, 5, 2, 6, 1, 4, 3, 2, 5, 2, 4, 1, 5]
    let curX = 15
    ctx.fillStyle = '#111111'
    barWidths.forEach((w) => {
      ctx.fillRect(curX, 85, w, 110)
      curX += w + 6
    })

    ctx.font = '600 14px monospace'
    ctx.fillStyle = '#555555'
    ctx.fillText('NO REFUNDS', 110, 225)
    ctx.restore()

    // Footer Watermark & WEDEVIT.IN Branding
    ctx.fillStyle = '#111111'
    ctx.fillRect(40, height - 85, width - 80, 45)

    ctx.fillStyle = '#FFFFFF'
    ctx.font = '800 15px monospace'
    ctx.textAlign = 'left'
    ctx.fillText('🎬 LETTERBOXD WATCHLIST MIXER : letterboxd-randomizer.vercel.app', 55, height - 57)

    ctx.textAlign = 'right'
    ctx.fillStyle = '#FFD200'
    ctx.font = '900 15px monospace'
    ctx.fillText('BUILT BY WEDEVIT.IN', width - 55, height - 57)

    return canvas
  }, [film, ticketDate, ticketNumber, getSourceLabel])

  const handleDownload = () => {
    setDownloading(true)
    try {
      const canvas = generateTicketCanvas()
      if (!canvas) return

      const safeTitle = (film?.title || 'film').replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()
      const link = document.createElement('a')
      link.download = `ticket-${safeTitle}-${ticketNumber}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch {
      // Fallback
    } finally {
      setDownloading(false)
    }
  }

  const handleCopyImage = async () => {
    try {
      const canvas = generateTicketCanvas()
      if (!canvas) return

      canvas.toBlob(async (blob) => {
        if (!blob) return
        if (typeof window !== 'undefined' && window.ClipboardItem && navigator.clipboard?.write) {
          await navigator.clipboard.write([new window.ClipboardItem({ 'image/png': blob })])
          setCopiedImage(true)
          setTimeout(() => setCopiedImage(false), 2500)
        } else {
          handleDownload()
        }
      })
    } catch {
      handleDownload()
    }
  }

  const shareText = `The wheel picked "${film?.title}"${film?.year ? ` (${film.year})` : ''} on Letterboxd Watchlist Mixer! Spin yours:`
  const shareUrl = typeof window !== 'undefined' ? window.location.origin : 'https://letterboxdrandomizer.vercel.app'

  return (
    <div className="retro-outset-deep bg-retro-gray border-4 overflow-hidden space-y-0">
      <div className="retro-titlebar px-3 py-1.5 flex items-center justify-between">
        <span className="font-bold text-xs sm:text-sm">CINEMA_TICKET_STUB.EXE</span>
        <div className="flex gap-1.5">
          <div className="w-3 h-3 bg-retro-yellow border border-retro-black" />
          <div className="w-3 h-3 bg-retro-red border border-retro-black" />
        </div>
      </div>

      <div className="p-3 sm:p-5 retro-inset bg-retro-white space-y-4">
        {/* Ticket Visual Representation */}
        <div className="relative border-4 border-retro-black bg-[#FAF5E9] p-3 sm:p-5 shadow-[4px_4px_0_#111] overflow-hidden">
          {/* Top Gold Bar */}
          <div className="flex items-center justify-between border-b-2 border-dashed border-retro-black pb-2 mb-3 bg-retro-yellow -mx-3 sm:-mx-5 -mt-3 sm:-mt-5 p-2 sm:p-3">
            <span className="font-mono font-black text-xs sm:text-sm text-retro-black tracking-widest uppercase">
              ★ ADMIT ONE &bull; CINEMA TICKET
            </span>
            <span className="font-mono font-bold text-[10px] sm:text-xs text-retro-black">
              {ticketNumber}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-4 items-center">
            <div className="space-y-1.5">
              <h3 className="text-xl sm:text-2xl font-black text-retro-black uppercase leading-tight">
                {film?.title}
              </h3>
              <div className="font-mono text-xs font-bold text-retro-muted flex flex-wrap gap-2">
                <span>YEAR: {film?.year || 'N/A'}</span>
                {film?.rating && <span>&bull; RATING: {film.rating}/5.0 ★</span>}
              </div>

              <div className="font-mono text-[11px] sm:text-xs font-black text-[#006600] uppercase pt-1">
                🎟️ {getSourceLabel()}
              </div>

              {film?.overlapCount && film?.totalUsers && film.totalUsers > 2 && (
                <div className="font-mono text-[10px] sm:text-xs font-bold text-retro-red">
                  SHARED BY {film.overlapCount} OF {film.totalUsers} FRIENDS ({film.sharedBy?.join(', ')})
                </div>
              )}

              <div className="font-mono text-[10px] text-retro-muted pt-1">
                ISSUED: {ticketDate.toUpperCase()}
              </div>
            </div>

            {/* Faux Barcode Stub */}
            <div className="hidden sm:flex flex-col items-center justify-center border-l-2 border-dashed border-retro-muted pl-4">
              <div className="text-[9px] font-mono font-bold text-retro-muted uppercase mb-1">BARCODE</div>
              <div className="flex items-end h-16 gap-[2px] bg-retro-black p-1">
                {[4, 2, 5, 1, 6, 2, 3, 5, 2, 4, 1, 6, 3, 2, 5, 1, 4, 2, 5, 3].map((h, i) => (
                  <div key={i} className="w-[3px] bg-retro-white" style={{ height: `${h * 9}px` }} />
                ))}
              </div>
              <div className="text-[8px] font-mono text-retro-muted mt-1">{ticketNumber}</div>
            </div>
          </div>

          {/* Ticket Footer with our WEDEVIT.IN plug */}
          <div className="mt-4 pt-2 border-t-2 border-retro-black flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono font-bold">
            <span className="text-retro-black">
              🎬 LETTERBOXD WATCHLIST MIXER
            </span>
            <a
              href="https://wedevit.in"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-retro-black text-retro-yellow px-2 py-0.5 uppercase tracking-wider hover:underline"
            >
              BUILT BY WEDEVIT.IN
            </a>
          </div>
        </div>

        {/* Ticket Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
          <button
            type="button"
            onClick={handleDownload}
            disabled={downloading}
            className="retro-outset flex items-center justify-center gap-2 py-2 px-3 text-xs font-black uppercase text-retro-black bg-retro-yellow hover:bg-[#FFE033]"
            aria-label="Download ticket PNG"
          >
            <BiDownload size={16} />
            {downloading ? 'GENERATING PNG...' : 'DOWNLOAD TICKET (PNG)'}
          </button>

          <button
            type="button"
            onClick={handleCopyImage}
            className="retro-outset flex items-center justify-center gap-2 py-2 px-3 text-xs font-black uppercase text-retro-black bg-retro-gray hover:bg-retro-yellow"
            aria-label="Copy ticket image to clipboard"
          >
            {copiedImage ? <BiCheck size={16} className="text-green-700" /> : <BiCopy size={16} />}
            {copiedImage ? 'COPIED TO CLIPBOARD!' : 'COPY TICKET IMAGE'}
          </button>
        </div>

        {/* Quick Social Share links with our mention */}
        <div className="flex items-center justify-center gap-2 pt-1">
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="retro-outset flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] font-black uppercase bg-retro-black text-retro-white hover:bg-neutral-800"
          >
            <SiX size={12} /> SHARE ON X
          </a>
          <a
            href={`https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="retro-outset flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] font-black uppercase bg-[#25D366] text-retro-white hover:bg-[#1EBE5D]"
          >
            <SiWhatsapp size={12} /> WHATSAPP
          </a>
        </div>
      </div>
    </div>
  )
}
