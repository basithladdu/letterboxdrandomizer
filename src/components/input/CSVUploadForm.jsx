import { useState } from 'react'
import { parseLetterboxdCSV } from '../../utils/csvParser.js'
import { BiFile } from 'react-icons/bi'

export default function CSVUploadForm({ onUpload }) {
  const [file, setFile] = useState(null)
  const [error, setError] = useState(null)
  const [username, setUsername] = useState('')

  const exportUrl = username.trim() 
    ? `https://letterboxd.com/${username.trim().toLowerCase()}/watchlist/export/`
    : null

  async function handleFileChange(e) {
    const selected = e.target.files[0]
    if (!selected) return

    if (!selected.name.endsWith('.csv')) {
      setError('PLEASE SELECT A .CSV FILE')
      return
    }

    setFile(selected)
    setError(null)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!file) return

    try {
      const films = await parseLetterboxdCSV(file)
      onUpload(films)
    } catch (err) {
      setError(err.message.toUpperCase())
    }
  }

  return (
    <div className="space-y-4">
      {/* Step 1: Get Link */}
      <div className="retro-outset-deep bg-retro-gray border-4">
        <div className="retro-titlebar px-2 sm:px-3 py-1">
          <span className="font-bold text-xs sm:text-sm">STEP 1: GET YOUR CSV</span>
        </div>
        <div className="p-2 sm:p-4 retro-inset bg-retro-panelYellow space-y-3">
          <div className="flex flex-col gap-2">
            <label className="font-bold text-xs uppercase text-retro-black">
              ENTER USERNAME TO GENERATE LINK:
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="username"
              className="border-2 border-retro-muted bg-retro-white px-2 py-1 text-xs font-mono uppercase focus:outline-none"
            />
          </div>
          
          {exportUrl ? (
            <div className="p-3 bg-retro-white border-2 border-retro-black space-y-2">
              <p className="text-[10px] font-bold text-retro-black">CLICK LINK TO DOWNLOAD:</p>
              <a 
                href={exportUrl} 
                target="_blank" 
                rel="noreferrer"
                className="block text-[10px] font-mono text-blue-700 underline break-all hover:bg-retro-yellow"
              >
                {exportUrl}
              </a>
            </div>
          ) : (
            <p className="text-[10px] text-retro-muted italic font-mono">
              (Link will appear once you enter your username)
            </p>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-2 sm:space-y-3">
        {/* Step 2: Upload */}
        <div className="retro-outset-deep bg-retro-gray border-4">
          <div className="retro-titlebar px-2 sm:px-3 py-1">
            <span className="font-bold text-xs sm:text-sm">STEP 2: UPLOAD CSV</span>
          </div>
          <div className="p-2 sm:p-4 retro-inset bg-retro-white">
            <div className="space-y-4">
              <label className="block border-2 border-dashed border-retro-muted p-4 sm:p-8 text-center cursor-pointer hover:bg-retro-panelYellow transition-colors">
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div className="flex flex-col items-center gap-2">
                  <BiFile size={32} className="text-retro-muted" />
                  <span className="font-bold text-xs sm:text-sm text-retro-black">
                    {file ? file.name.toUpperCase() : 'CLICK TO BROWSE WATCHLIST.CSV'}
                  </span>
                </div>
              </label>

              {error && (
                <div className="p-2 bg-retro-red text-retro-white text-[10px] sm:text-xs font-bold text-center">
                  ERROR: {error}
                </div>
              )}
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={!file}
          className={`
            w-full py-2 sm:py-3 font-black text-xs sm:text-sm uppercase tracking-widest
            border-4 border-retro-black
            flex items-center justify-center gap-2 transition-none
            ${!file ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          style={{
            backgroundColor: '#0000AA',
            color: '#FFFFFF',
            borderColor: !file ? '#808080 #FFFFFF #FFFFFF #808080' : '#FFFFFF #808080 #808080 #FFFFFF',
            boxShadow: !file
              ? 'inset 1px 1px 0 #404040, inset -1px -1px 0 #DFDFDF'
              : 'inset -1px -1px 0 #404040, inset 1px 1px 0 #DFDFDF'
          }}
          onMouseDown={(e) => {
            if (file) {
              e.currentTarget.style.borderColor = '#808080 #FFFFFF #FFFFFF #808080'
              e.currentTarget.style.boxShadow = 'inset 1px 1px 0 #404040, inset -1px -1px 0 #DFDFDF'
              e.currentTarget.style.transform = 'translate(1px, 1px)'
            }
          }}
          onMouseUp={(e) => {
            if (file) {
              e.currentTarget.style.borderColor = '#FFFFFF #808080 #808080 #FFFFFF'
              e.currentTarget.style.boxShadow = 'inset -1px -1px 0 #404040, inset 1px 1px 0 #DFDFDF'
              e.currentTarget.style.transform = 'translate(0, 0)'
            }
          }}
        >
          ▶ UPLOAD &amp; SPIN
        </button>
      </form>
    </div>
  )
}
