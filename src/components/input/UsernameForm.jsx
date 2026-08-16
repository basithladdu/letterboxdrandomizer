import { useRef, useState } from 'react'
import LoadingSpinner from '../shared/LoadingSpinner.jsx'
import HelpDialog from '../shared/HelpDialog.jsx'
import { normalizeLetterboxdUsername } from '../../utils/letterboxdInput.js'

export default function UsernameForm({ onSubmit, loading, mode = 'solo' }) {
  const [usernames, setUsernames] = useState(['', ''])
  const [validationError, setValidationError] = useState(null)
  const [showHelp, setShowHelp] = useState(false)
  const helpButtonRef = useRef(null)

  function handleSubmit(e) {
    e.preventDefault()
    const submittedUsernames = mode === 'compare' ? usernames : [usernames[0]]
    const trimmed = submittedUsernames.map(normalizeLetterboxdUsername)

    if (trimmed.some((username) => !username)) {
      setValidationError(mode === 'compare' ? 'ENTER TWO USERNAMES OR LETTERBOXD LINKS' : 'ENTER A USERNAME OR LETTERBOXD LINK')
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
      ? usernames.every((username) => normalizeLetterboxdUsername(username))
      : Boolean(normalizeLetterboxdUsername(usernames[0]))

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

  function closeHelp() {
    setShowHelp(false)
    requestAnimationFrame(() => helpButtonRef.current?.focus())
  }

  const visibleUsernames = usernames.slice(0, mode === 'compare' ? 2 : 1)
  const hasEmptyUsername = visibleUsernames.some((username) => !normalizeLetterboxdUsername(username))

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
                  USERNAME
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
                  autoCapitalize="none"
                  enterKeyHint={mode === 'compare' && index === 0 ? 'next' : 'go'}
                  spellCheck={false}
                  className="
                    flex-1 border-2 border-retro-muted bg-retro-white px-2 sm:px-3 py-1.5 sm:py-2
                    text-retro-black placeholder:text-retro-muted
                    font-mono text-xs sm:text-sm uppercase tracking-widest
                    focus-visible:outline-dotted focus-visible:outline-2 focus-visible:outline-retro-black
                    disabled:opacity-50 min-w-[100px]
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
            mode === 'compare' ? <>&#9654; FIND COMMON FILMS</> : <>&#9654; FETCH WATCHLIST</>
          )}
        </button>
      </form>

      <div className="retro-outset-deep bg-retro-gray border-4">
        <div className="retro-titlebar px-2 sm:px-3 py-1 flex items-center justify-between gap-2">
          <span className="font-bold text-xs uppercase">Important Information</span>
          <button
            ref={helpButtonRef}
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

      {showHelp && <HelpDialog mode={mode} onClose={closeHelp} />}

    </div>
  )
}
