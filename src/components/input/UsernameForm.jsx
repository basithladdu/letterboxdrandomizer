import { useState } from 'react'
import LoadingSpinner from '../shared/LoadingSpinner.jsx'
import HelpDialog from '../shared/HelpDialog.jsx'
import SupportButton from '../shared/SupportButton.jsx'
import { SiLetterboxd, SiGithub, SiX, SiInstagram } from 'react-icons/si'
import { BiEnvelope } from 'react-icons/bi'

export default function UsernameForm({ onSubmit, loading, mode = 'solo' }) {
  const [usernames, setUsernames] = useState(['', ''])
  const [validationError, setValidationError] = useState(null)
  const [showHelp, setShowHelp] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    const submittedUsernames = mode === 'compare' ? usernames : [usernames[0]]
    const trimmed = submittedUsernames.map((username) => username.trim().replace(/^@/, ''))

    if (trimmed.some((username) => !username)) {
      setValidationError(mode === 'compare' ? 'ENTER TWO USERNAMES' : 'ENTER A USERNAME')
      return
    }

    if (mode === 'compare' && trimmed[0].toLowerCase() === trimmed[1].toLowerCase()) {
      setValidationError('ENTER TWO DIFFERENT USERNAMES')
      return
    }

    setValidationError(null)
    onSubmit(mode === 'compare' ? trimmed : trimmed[0])
  }

  function handleKeyDown(e) {
    const ready = mode === 'compare'
      ? usernames.every((username) => username.trim())
      : Boolean(usernames[0].trim())

    if (e.key === 'Enter' && ready && !loading) {
      handleSubmit(e)
    }
  }

  function updateUsername(index, value) {
    setUsernames((current) => current.map((item, itemIndex) => (
      itemIndex === index ? value : item
    )))
    setValidationError(null)
  }

  const visibleUsernames = usernames.slice(0, mode === 'compare' ? 2 : 1)
  const hasEmptyUsername = visibleUsernames.some((username) => !username.trim())

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-2 sm:space-y-3">
        {visibleUsernames.map((username, index) => (
          <div key={index} className="retro-outset-deep bg-retro-gray border-4">
            <div className="retro-titlebar px-2 sm:px-3 py-1">
              <span className="font-bold text-xs sm:text-sm">
                {mode === 'compare'
                  ? `USER ${String(index + 1).padStart(2, '0')} WATCHLIST`
                  : 'LETTERBOXD USERNAME'}
              </span>
            </div>
            <div className="p-2 sm:p-4 retro-inset bg-retro-white">
              <div className="relative flex items-center gap-2 flex-wrap">
                <label htmlFor={`letterboxd-username-${index}`} className="font-bold text-xs whitespace-nowrap text-retro-black">
                  letterboxd.com/
                </label>
                <input
                  id={`letterboxd-username-${index}`}
                  type="text"
                  value={username}
                  onChange={(e) => updateUsername(index, e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={index === 0 ? 'basithladoo' : 'zoerosebryant'}
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
        ))}

        {validationError && (
          <div className="p-2 bg-retro-red text-retro-white text-[10px] sm:text-xs font-bold text-center">
            ERROR: {validationError}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || hasEmptyUsername}
          className={`
            w-full py-2 sm:py-3 font-black text-xs sm:text-sm uppercase tracking-widest
            border-4 border-retro-black
            flex items-center justify-center gap-2 transition-none
            ${loading || hasEmptyUsername ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          style={{
            backgroundColor: '#00AA00',
            color: '#FFFFFF',
            borderColor: loading || hasEmptyUsername ? '#808080 #FFFFFF #FFFFFF #808080' : '#FFFFFF #808080 #808080 #FFFFFF',
            boxShadow: loading || hasEmptyUsername
              ? 'inset 1px 1px 0 #404040, inset -1px -1px 0 #DFDFDF'
              : 'inset -1px -1px 0 #404040, inset 1px 1px 0 #DFDFDF'
          }}
          onMouseDown={(e) => {
            if (!loading && !hasEmptyUsername) {
              e.currentTarget.style.borderColor = '#808080 #FFFFFF #FFFFFF #808080'
              e.currentTarget.style.boxShadow = 'inset 1px 1px 0 #404040, inset -1px -1px 0 #DFDFDF'
              e.currentTarget.style.transform = 'translate(1px, 1px)'
            }
          }}
          onMouseUp={(e) => {
            if (!loading && !hasEmptyUsername) {
              e.currentTarget.style.borderColor = '#FFFFFF #808080 #808080 #FFFFFF'
              e.currentTarget.style.boxShadow = 'inset -1px -1px 0 #404040, inset 1px 1px 0 #DFDFDF'
              e.currentTarget.style.transform = 'translate(0, 0)'
            }
          }}
        >
          {loading ? (
            <>
              <LoadingSpinner size={18} />
              <span>{mode === 'compare' ? 'FETCHING BOTH WATCHLISTS&hellip;' : 'FETCHING WATCHLIST&hellip;'}</span>
            </>
          ) : (
            mode === 'compare' ? <>&#9654; FIND SHARED FILMS</> : <>&#9654; FETCH WATCHLIST</>
          )}
        </button>
      </form>

      <div className="retro-outset-deep bg-retro-gray border-4">
        <div className="retro-titlebar px-2 sm:px-3 py-1 flex items-center justify-between gap-2">
          <span className="font-bold text-xs uppercase">Important Information</span>
          <button
            type="button"
            onClick={() => setShowHelp(true)}
            className="retro-outset bg-retro-gray text-retro-black px-2 py-1 text-[10px] font-black hover:bg-retro-yellow"
            aria-label="Open help"
          >
            HELP
          </button>
        </div>
        <div className="p-2 sm:p-4 retro-inset bg-retro-panelYellow">
          <p className="text-[10px] sm:text-xs font-bold text-retro-black uppercase">
            {mode === 'compare'
              ? <>Both watchlists must be set to <span className="badge-new">PUBLIC</span></>
              : <>Your watchlist must be set to <span className="badge-new">PUBLIC</span></>}
          </p>
        </div>
      </div>

      {showHelp && <HelpDialog mode={mode} onClose={() => setShowHelp(false)} />}

      <div className="retro-outset bg-retro-gray border-2">
        <div className="retro-titlebar px-2 py-0.5 flex justify-between items-center">
          <span className="text-[9px] font-bold uppercase">These are my social handles</span>
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-retro-red border border-retro-black" />
            <div className="w-2 h-2 bg-retro-yellow border border-retro-black" />
            <div className="w-2 h-2 bg-retro-green border border-retro-black" />
          </div>
        </div>
        <div className="p-2 bg-retro-white flex flex-wrap justify-center gap-x-6 gap-y-2">
          <a href="https://letterboxd.com/basithladoo" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-[10px] font-black text-retro-black hover:bg-retro-yellow px-1 transition-colors">
            <SiLetterboxd size={14} />
            <span className="underline decoration-2">LETTERBOXD</span>
          </a>
          <a href="https://github.com/basithladdu" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-[10px] font-black text-retro-black hover:bg-retro-yellow px-1 transition-colors">
            <SiGithub size={14} />
            <span className="underline decoration-2">GITHUB</span>
          </a>
          <a href="https://twitter.com/basithladoo" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-[10px] font-black text-retro-black hover:bg-retro-yellow px-1 transition-colors">
            <SiX size={14} />
            <span className="underline decoration-2">TWITTER / X</span>
          </a>
          <a href="https://instagram.com/basithladdu" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-[10px] font-black text-retro-black hover:bg-retro-yellow px-1 transition-colors">
            <SiInstagram size={14} />
            <span className="underline decoration-2">INSTAGRAM</span>
          </a>
          <a href="mailto:basithladoo@gmail.com" className="flex items-center gap-1.5 text-[10px] font-black text-retro-black hover:bg-retro-yellow px-1 transition-colors">
            <BiEnvelope size={14} />
            <span className="underline decoration-2">EMAIL</span>
          </a>
        </div>
      </div>
    </div>
  )
}
