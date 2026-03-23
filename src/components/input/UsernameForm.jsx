import { useState } from 'react'
import LoadingSpinner from '../shared/LoadingSpinner.jsx'

export default function UsernameForm({ onSubmit, loading }) {
  const [username, setUsername] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    const trimmed = username.trim()
    if (trimmed) onSubmit(trimmed)
  }

  // Allow Enter key to submit even when focus is on input
  function handleKeyDown(e) {
    if (e.key === 'Enter' && username.trim() && !loading) {
      handleSubmit(e)
    }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-2 sm:space-y-3">
        {/* Input Container Window */}
        <div className="retro-outset-deep bg-retro-gray border-4">
          <div className="retro-titlebar px-2 sm:px-3 py-1">
            <span className="font-bold text-xs sm:text-sm">LETTERBOXD USERNAME</span>
          </div>
          <div className="p-2 sm:p-4 retro-inset bg-retro-white">
            <div className="relative flex items-center gap-2 flex-wrap">
              <label className="font-bold text-xs whitespace-nowrap text-retro-black">
                letterboxd.com/
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="username"
                disabled={loading}
                autoComplete="off"
                spellCheck={false}
                className="
                  flex-1 border-2 border-retro-muted bg-retro-white px-2 sm:px-3 py-1.5 sm:py-2
                  text-retro-black placeholder:text-retro-muted
                  font-mono text-xs sm:text-sm uppercase tracking-widest
                  focus-visible:outline-dotted focus-visible:outline-2 focus-visible:outline-retro-black
                  disabled:opacity-50 min-w-[100px] transition-all
                "
              />
            </div>
          </div>
        </div>

        {/* Button */}
        <button
          type="submit"
          disabled={loading || !username.trim()}
          className={`
            w-full py-2 sm:py-3 font-black text-xs sm:text-sm uppercase tracking-widest
            border-4 border-retro-black
            flex items-center justify-center gap-2 transition-none
            ${loading || !username.trim() ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          style={{
            backgroundColor: '#00AA00',
            color: '#FFFFFF',
            borderColor: loading || !username.trim() ? '#808080 #FFFFFF #FFFFFF #808080' : '#FFFFFF #808080 #808080 #FFFFFF',
            boxShadow: loading || !username.trim()
              ? 'inset 1px 1px 0 #404040, inset -1px -1px 0 #DFDFDF'
              : 'inset -1px -1px 0 #404040, inset 1px 1px 0 #DFDFDF'
          }}
          onMouseDown={(e) => {
            if (!loading && username.trim()) {
              e.currentTarget.style.borderColor = '#808080 #FFFFFF #FFFFFF #808080'
              e.currentTarget.style.boxShadow = 'inset 1px 1px 0 #404040, inset -1px -1px 0 #DFDFDF'
              e.currentTarget.style.transform = 'translate(1px, 1px)'
            }
          }}
          onMouseUp={(e) => {
            if (!loading && username.trim()) {
              e.currentTarget.style.borderColor = '#FFFFFF #808080 #808080 #FFFFFF'
              e.currentTarget.style.boxShadow = 'inset -1px -1px 0 #404040, inset 1px 1px 0 #DFDFDF'
              e.currentTarget.style.transform = 'translate(0, 0)'
            }
          }}
        >
          {loading ? (
            <>
              <LoadingSpinner size={18} />
              <span>FETCHING WATCHLIST…</span>
            </>
          ) : (
            '▶ FETCH WATCHLIST'
          )}
        </button>
      </form>

      {/* Info Box Window Style */}
      <div className="retro-outset-deep bg-retro-gray border-4">
        <div className="retro-titlebar px-2 sm:px-3 py-1">
          <span className="font-bold text-xs">IMPORTANT INFO</span>
        </div>
        <div className="p-2 sm:p-4 retro-inset bg-retro-panelYellow space-y-1 sm:space-y-2">
          <p className="text-[10px] sm:text-xs font-bold text-retro-black">
            Your watchlist must be set to <span className="badge-new">PUBLIC</span>
          </p>
          <p className="text-[10px] sm:text-xs text-retro-black font-mono">
            This tool scrapes your public Letterboxd watchlist via CORS proxy.
          </p>
          <p className="text-[10px] sm:text-xs text-retro-black font-mono">
            Your privacy is important! We don't store any personal data.
          </p>
        </div>
      </div>
    </div>
  )
}
