import { useState, useEffect, useCallback } from 'react'
import { BiDownload, BiCopy, BiCheck } from 'react-icons/bi'

export default function CinemaTicket({ film, watchlistOwners = [] }) {
  const [downloading, setDownloading] = useState(false)
  const [copiedImage, setCopiedImage] = useState(false)
  const [ticketNumber, setTicketNumber] = useState('454710')
  const [seatNumber, setSeatNumber] = useState({ row: 'D', seat: '12', screen: '04' })

  useEffect(() => {
    // Generate deterministic ticket serial and seat
    const num = Math.floor(100000 + Math.random() * 900000)
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
    const row = rows[Math.floor(Math.random() * rows.length)]
    const seat = String(Math.floor(1 + Math.random() * 24)).padStart(2, '0')
    const screen = String(Math.floor(1 + Math.random() * 8)).padStart(2, '0')

    setTicketNumber(String(num))
    setSeatNumber({ row, seat, screen })
  }, [film?.letterboxdSlug])

  const ticketDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  const getSourceLabel = useCallback(() => {
    if (!watchlistOwners || watchlistOwners.length === 0) return 'LETTERBOXD WATCHLIST'
    if (watchlistOwners.length === 1) return `WATCHLIST: @${watchlistOwners[0].toUpperCase()}`
    if (watchlistOwners.length === 2) return `COMMON PICK: @${watchlistOwners[0]} & @${watchlistOwners[1]}`
    return `GROUP NIGHT (${watchlistOwners.length} FRIENDS): ${watchlistOwners.map((u) => `@${u}`).join(', ')}`
  }, [watchlistOwners])

  // Canvas-based 90s Authentic Ticket PNG Generator
  const generateTicketCanvas = useCallback(() => {
    const canvas = document.createElement('canvas')
    const width = 1200
    const height = 580
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (!ctx) return null

    // Background transparent outer container
    ctx.clearRect(0, 0, width, height)

    // Ticket coordinates
    const tX = 30
    const tY = 30
    const tW = width - 60
    const tH = height - 60
    const perfX = tX + tW * 0.72 // perforation x location
    const notchRadius = 24

    // 1. Draw Main Ticket Card Base with Inward Notches
    ctx.save()
    ctx.beginPath()
    // Top-left to top-perf
    ctx.moveTo(tX + 16, tY)
    ctx.lineTo(perfX - notchRadius, tY)
    // Top notch (semicircle dipping into ticket)
    ctx.arc(perfX, tY, notchRadius, Math.PI, 0, true)
    // Top-perf to top-right
    ctx.lineTo(tX + tW - 16, tY)
    ctx.arcTo(tX + tW, tY, tX + tW, tY + 16, 16)
    // Right side with side notch
    ctx.lineTo(tX + tW, tY + tH * 0.5 - notchRadius)
    ctx.arc(tX + tW, tY + tH * 0.5, notchRadius, -Math.PI / 2, Math.PI / 2, true)
    ctx.lineTo(tX + tW, tY + tH - 16)
    ctx.arcTo(tX + tW, tY + tH, tX + tW - 16, tY + tH, 16)
    // Bottom-right to bottom-perf
    ctx.lineTo(perfX + notchRadius, tY + tH)
    // Bottom notch (semicircle dipping into ticket)
    ctx.arc(perfX, tY + tH, notchRadius, 0, Math.PI, true)
    // Bottom-perf to bottom-left
    ctx.lineTo(tX + 16, tY + tH)
    ctx.arcTo(tX, tY + tH, tX, tY + tH - 16, 16)
    // Left side with side notch
    ctx.lineTo(tX, tY + tH * 0.5 + notchRadius)
    ctx.arc(tX, tY + tH * 0.5, notchRadius, Math.PI / 2, -Math.PI / 2, true)
    ctx.lineTo(tX, tY + 16)
    ctx.arcTo(tX, tY, tX + 16, tY, 16)
    ctx.closePath()

    // Fill Vintage 90s Golden Ticket Cardstock
    ctx.fillStyle = '#EBB83A' // warm 90s cinema ticket gold
    ctx.fill()
    ctx.strokeStyle = '#181818'
    ctx.lineWidth = 5
    ctx.stroke()
    ctx.clip()

    // 2. Vintage Cardstock Texture
    ctx.fillStyle = '#F4C44E'
    ctx.fillRect(tX, tY, perfX - tX, tH)
    ctx.fillStyle = '#E5A922'
    ctx.fillRect(perfX, tY, tW - (perfX - tX), tH)

    // Inner ticket vintage double border
    ctx.strokeStyle = '#181818'
    ctx.lineWidth = 2.5
    ctx.strokeRect(tX + 18, tY + 18, tW - 36, tH - 36)

    ctx.strokeStyle = '#664800'
    ctx.lineWidth = 1
    ctx.setLineDash([6, 4])
    ctx.strokeRect(tX + 24, tY + 24, tW - 48, tH - 48)
    ctx.setLineDash([])

    // 3. Perforated Stub Tear Line
    ctx.strokeStyle = '#332200'
    ctx.lineWidth = 3
    ctx.setLineDash([8, 6])
    ctx.beginPath()
    ctx.moveTo(perfX, tY + 24)
    ctx.lineTo(perfX, tY + tH - 24)
    ctx.stroke()
    ctx.setLineDash([])
    ctx.restore()

    // 4. MAIN TICKET CONTENT (LEFT SECTION)
    const leftPad = tX + 45

    // Top Stamped Banner
    ctx.fillStyle = '#181818'
    ctx.font = '900 22px monospace'
    ctx.textAlign = 'left'
    ctx.fillText('★ ★ ★  RETRO 95 CINEMAS  ★ ★ ★', leftPad, tY + 62)

    ctx.textAlign = 'right'
    ctx.font = '800 18px monospace'
    ctx.fillText(`№ ${ticketNumber}`, perfX - 35, tY + 62)

    // Horizontal Separator
    ctx.strokeStyle = '#181818'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(leftPad, tY + 76)
    ctx.lineTo(perfX - 35, tY + 76)
    ctx.stroke()

    // Sub-header Metadata Bar (Audit / Row / Seat / Price)
    ctx.fillStyle = '#181818'
    ctx.font = '800 14px monospace'
    ctx.textAlign = 'left'
    ctx.fillText(
      `AUDITORIUM ${seatNumber.screen}   |   ROW ${seatNumber.row}   |   SEAT ${seatNumber.seat}   |   PRICE $5.50`,
      leftPad,
      tY + 102
    )

    // Big Punchy Film Title
    const titleText = (film?.title || 'UNTITLED FILM').toUpperCase()
    ctx.fillStyle = '#111111'
    ctx.font = titleText.length > 22 ? '900 38px monospace' : '900 48px monospace'
    ctx.fillText(titleText.slice(0, 30), leftPad, tY + 168)

    // Release Year & Letterboxd Rating
    ctx.font = '800 20px monospace'
    ctx.fillStyle = '#222222'
    const yearStr = film?.year ? `YEAR: ${film.year}` : 'YEAR: UNKNOWN'
    const ratingStr = film?.rating ? `   ★ RATING: ${film.rating}/5.0` : ''
    ctx.fillText(`${yearStr}${ratingStr}`, leftPad, tY + 212)

    // Watchlist Thermal Attendee Box
    ctx.fillStyle = '#FFF8E7'
    ctx.fillRect(leftPad, tY + 235, perfX - leftPad - 35, 120)
    ctx.strokeStyle = '#181818'
    ctx.lineWidth = 2
    ctx.strokeRect(leftPad, tY + 235, perfX - leftPad - 35, 120)

    ctx.fillStyle = '#005500'
    ctx.font = '900 17px monospace'
    const sourceText = getSourceLabel()
    ctx.fillText(`🎟️ ${sourceText.slice(0, 52)}`, leftPad + 18, tY + 272)

    if (film?.overlapCount && film?.totalUsers && film.totalUsers > 2) {
      ctx.fillStyle = '#8B0000'
      ctx.font = '800 16px monospace'
      ctx.fillText(`SHARED BY: ${film.overlapCount} OF ${film.totalUsers} FRIENDS (${(film.sharedBy || []).join(', ')})`, leftPad + 18, tY + 305)
    } else {
      ctx.fillStyle = '#333333'
      ctx.font = '700 15px monospace'
      ctx.fillText(`OFFICIAL SELECTION FROM LETTERBOXD WATCHLIST`, leftPad + 18, tY + 305)
    }

    ctx.fillStyle = '#666666'
    ctx.font = '700 13px monospace'
    ctx.fillText(`DATE DRAWN: ${ticketDate.toUpperCase()} • 08:30 PM • THEATRE PASS`, leftPad + 18, tY + 338)

    // Left Footer Watermark & Branding
    ctx.fillStyle = '#181818'
    ctx.font = '800 14px monospace'
    ctx.textAlign = 'left'
    ctx.fillText('🎬 LETTERBOXD WATCHLIST MIXER : letterboxdrandomizer.wedevit.in', leftPad, tY + tH - 42)

    // 5. RIGHT STUB SECTION ("RETAIN THIS STUB")
    const stubCenter = (perfX + tX + tW) / 2

    ctx.fillStyle = '#181818'
    ctx.font = '900 20px monospace'
    ctx.textAlign = 'center'
    ctx.fillText('★ ADMIT ONE ★', stubCenter, tY + 64)

    ctx.font = '800 14px monospace'
    ctx.fillStyle = '#333333'
    ctx.fillText(`AUD ${seatNumber.screen} • ROW ${seatNumber.row} • SEAT ${seatNumber.seat}`, stubCenter, tY + 95)

    ctx.font = '900 16px monospace'
    ctx.fillStyle = '#181818'
    ctx.fillText(`№ ${ticketNumber}`, stubCenter, tY + 124)

    // High Density Thermal Barcode
    const barWidths = [4, 1, 5, 2, 6, 2, 1, 5, 2, 4, 1, 3, 6, 2, 5, 1, 4, 3, 2, 6, 2, 4, 1, 6, 3, 2]
    let curX = stubCenter - 105
    ctx.fillStyle = '#111111'
    barWidths.forEach((w) => {
      ctx.fillRect(curX, tY + 145, w, 115)
      curX += w + 6
    })

    ctx.font = '800 13px monospace'
    ctx.fillStyle = '#444444'
    ctx.fillText('KEEP THIS STUB', stubCenter, tY + 285)
    ctx.fillText('* NO REFUNDS / EXCHANGES *', stubCenter, tY + 308)

    // Right Stub Footer Branding
    ctx.fillStyle = '#8B0000'
    ctx.font = '900 15px monospace'
    ctx.fillText('BUILT BY WEDEVIT.IN', stubCenter, tY + tH - 42)

    return canvas
  }, [film, ticketDate, ticketNumber, seatNumber, getSourceLabel])

  const handleDownload = () => {
    setDownloading(true)
    try {
      const canvas = generateTicketCanvas()
      if (!canvas) return

      const safeTitle = (film?.title || 'film').replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()
      const link = document.createElement('a')
      link.download = `cinema-ticket-${safeTitle}-${ticketNumber}.png`
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

  return (
    <div className="retro-outset-deep bg-retro-gray border-4 overflow-hidden space-y-0">
      <div className="retro-titlebar px-3 py-1.5 flex items-center justify-between">
        <span className="font-bold text-xs sm:text-sm uppercase">CINEMA_TICKET_STUB.EXE</span>
        <div className="flex gap-1.5">
          <div className="w-3 h-3 bg-retro-yellow border border-retro-black" />
          <div className="w-3 h-3 bg-retro-red border border-retro-black" />
        </div>
      </div>

      <div className="p-3 sm:p-5 retro-inset bg-retro-white space-y-4">
        {/* Authentic 90s Vintage Gold Movie Ticket Preview */}
        <div className="relative border-4 border-retro-black bg-[#EBB83A] p-3 sm:p-6 shadow-[5px_5px_0_#111] overflow-hidden font-mono text-retro-black">
          
          {/* Inner Decorative Ticket Border */}
          <div className="border-2 border-retro-black p-3 sm:p-5 relative bg-[#F4C44E]">
            
            {/* Top Header Marquee */}
            <div className="flex items-center justify-between border-b-2 border-retro-black pb-2 mb-3">
              <span className="font-black text-xs sm:text-sm tracking-wider uppercase">
                ★ ★ ★ RETRO 95 CINEMAS ★ ★ ★
              </span>
              <span className="font-black text-xs sm:text-sm">
                № {ticketNumber}
              </span>
            </div>

            {/* Metadata Line */}
            <div className="text-[10px] sm:text-xs font-black uppercase text-neutral-900 border-b border-dashed border-retro-black pb-2 mb-3 flex flex-wrap justify-between gap-1">
              <span>AUDITORIUM {seatNumber.screen}</span>
              <span>ROW {seatNumber.row}</span>
              <span>SEAT {seatNumber.seat}</span>
              <span>PRICE: $5.50</span>
              <span>TIME: 08:30 PM</span>
            </div>

            {/* Main Film Details & Right Stub */}
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-4 items-center relative">
              
              {/* Left Side: Film Info */}
              <div className="space-y-2.5">
                <h3 className="text-xl sm:text-3xl font-black uppercase leading-tight tracking-tight text-retro-black">
                  {film?.title}
                </h3>

                <div className="text-xs sm:text-sm font-bold text-neutral-900 flex flex-wrap gap-2">
                  <span>YEAR: {film?.year || 'N/A'}</span>
                  {film?.rating && <span>&bull; RATING: {film.rating}/5.0 ★</span>}
                </div>

                {/* Attendee Box */}
                <div className="p-3 bg-[#FFF8E7] border-2 border-retro-black space-y-1">
                  <div className="text-xs sm:text-sm font-black text-[#005500] uppercase">
                    🎟️ {getSourceLabel()}
                  </div>

                  {film?.overlapCount && film?.totalUsers && film.totalUsers > 2 && (
                    <div className="text-[10px] sm:text-xs font-bold text-retro-red uppercase">
                      SHARED BY {film.overlapCount} OF {film.totalUsers} FRIENDS ({film.sharedBy?.join(', ')})
                    </div>
                  )}

                  <div className="text-[9px] sm:text-[10px] text-neutral-700 font-bold">
                    DATE DRAWN: {ticketDate.toUpperCase()} &bull; THEATRE ADMISSION PASS
                  </div>
                </div>
              </div>

              {/* Right Side: Perforated Tear-off Stub */}
              <div className="hidden sm:flex flex-col items-center justify-center border-l-2 border-dashed border-retro-black pl-5 space-y-1.5 min-w-[150px]">
                <div className="text-xs font-black uppercase tracking-wider">
                  ★ ADMIT ONE ★
                </div>
                <div className="text-[10px] font-bold text-neutral-800">
                  AUD {seatNumber.screen} | ROW {seatNumber.row}-{seatNumber.seat}
                </div>
                <div className="text-[10px] font-black">№ {ticketNumber}</div>

                {/* Thermal Barcode */}
                <div className="flex items-end h-14 gap-[2px] bg-retro-black p-1">
                  {[5, 2, 6, 1, 7, 2, 3, 6, 2, 5, 1, 7, 3, 2, 6, 1, 5, 2, 6, 3, 1, 5].map((h, i) => (
                    <div key={i} className="w-[3px] bg-retro-white" style={{ height: `${h * 7}px` }} />
                  ))}
                </div>
                <div className="text-[9px] font-black uppercase text-neutral-800">KEEP THIS STUB</div>
                <div className="text-[8px] font-bold uppercase text-neutral-700">* NO REFUNDS *</div>
              </div>
            </div>

            {/* Ticket Footer Banner */}
            <div className="mt-4 pt-2 border-t-2 border-retro-black flex flex-wrap items-center justify-between gap-2 text-[10px] font-black">
              <span>
                🎬 LETTERBOXD WATCHLIST MIXER : letterboxdrandomizer.wedevit.in
              </span>
              <a
                href="https://wedevit.in"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-retro-black text-[#FFD200] px-2 py-0.5 uppercase tracking-wider hover:underline"
              >
                BUILT BY WEDEVIT.IN
              </a>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-sans">
          <button
            type="button"
            onClick={handleDownload}
            disabled={downloading}
            className="retro-outset flex items-center justify-center gap-2 py-2 px-3 text-xs font-black uppercase text-retro-black bg-retro-yellow hover:bg-[#FFE033]"
            aria-label="Download vintage 90s cinema ticket PNG"
          >
            <BiDownload size={16} />
            {downloading ? 'GENERATING 90s TICKET...' : 'DOWNLOAD 90s TICKET (PNG)'}
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
      </div>
    </div>
  )
}
