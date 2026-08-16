import { useRef, useState, useEffect } from 'react'
import LoadingSpinner from '../shared/LoadingSpinner.jsx'
import HelpDialog from '../shared/HelpDialog.jsx'
import { normalizeLetterboxdUsername } from '../../utils/letterboxdInput.js'
import { BiUserPlus, BiTrash } from 'react-icons/bi'

const MAX_GROUP_USERS = 6
const MIN_GROUP_USERS = 3

export default function UsernameForm({ onSubmit, loading, mode = 'solo' }) {
  const [usernames, setUsernames] = useState(['', '', ''])
  const [groupStrategy, setGroupStrategy] = useState('majority') // 'intersection' | 'majority'
  const [validationError, setValidationError] = useState(null)
  const [showHelp, setShowHelp] = useState(false)
  const helpButtonRef = useRef(null)

  // Reset or adjust username input count when tab mode changes
  useEffect(() => {
    setValidationError(null)
    if (mode === 'solo') {
      setUsernames((prev) => [prev[0] || ''])
    } else if (mode === 'compare') {
      setUsernames((prev) => [prev[0] || '', prev[1] || ''])
    } else if (mode === 'group') {
      setUsernames((prev) => {
        const clean = prev.filter(Boolean)
        return [
          clean[0] || '',
          clean[1] || '',
          clean[2] || '',
          ...(clean.slice(3, MAX_GROUP_USERS)),
        ]
      })
    }
  }, [mode])

  function handleSubmit(e) {
    if (e) e.preventDefault()

    const targetUsernames = mode === 'solo'
      ? [usernames[0]]
      : mode === 'compare'
      ? usernames.slice(0, 2)
      : usernames

    const trimmed = targetUsernames.map(normalizeLetterboxdUsername)

    if (trimmed.some((u) => !u)) {
      if (mode === 'group') {
        setValidationError(`ENTER ALL ${targetUsernames.length} USERNAMES OR LETTERBOXD LINKS`)
      } else if (mode === 'compare') {
        setValidationError('ENTER TWO USERNAMES OR LETTERBOXD LINKS')
      } else {
        setValidationError('ENTER A USERNAME OR LETTERBOXD LINK')
      }
      return
    }

    // Check for duplicates
    const lowerSet = new Set(trimmed.map((u) => u.toLowerCase()))
    if (lowerSet.size !== trimmed.length) {
      setValidationError('ALL USERNAMES MUST BE UNIQUE — NO DUPLICATES')
      return
    }

    setValidationError(null)
    if (mode === 'solo') {
      onSubmit(trimmed[0])
    } else if (mode === 'compare') {
      onSubmit(trimmed)
    } else {
      onSubmit(trimmed, { groupMode: groupStrategy })
    }
  }

  function handleKeyDown(e, index) {
    const ready = usernames.every((u) => normalizeLetterboxdUsername(u))
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

  function addFriendSlot() {
    if (usernames.length >= MAX_GROUP_USERS) return
    setUsernames((current) => [...current, ''])
  }

  function removeFriendSlot(index) {
    if (usernames.length <= MIN_GROUP_USERS) return
    setUsernames((current) => current.filter((_, itemIndex) => itemIndex !== index))
  }

  function closeHelp() {
    setShowHelp(false)
    requestAnimationFrame(() => helpButtonRef.current?.focus())
  }

  const hasEmptyUsername = usernames.some((u) => !normalizeLetterboxdUsername(u))

  const placeholders = [
    'basithladoo',
    'connoreatspants',
    'kurstboy',
    'zoerosebryant',
    'davidehrlich',
    'cinema_lover',
  ]

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-2 sm:space-y-3">
        {mode === 'group' && (
          <div className="retro-outset bg-retro-gray p-2 border-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <span className="text-[10px] sm:text-xs font-black text-retro-black uppercase">
              MATCH STRATEGY:
            </span>
            <div className="flex gap-1.5 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setGroupStrategy('majority')}
                className={`flex-1 sm:flex-initial px-2 py-1 text-[10px] font-black uppercase border-2 transition-none ${
                  groupStrategy === 'majority'
                    ? 'bg-retro-yellow text-retro-black border-retro-black shadow-[inset_1px_1px_0_#FFF]'
                    : 'bg-retro-white text-retro-muted border-retro-muted'
                }`}
              >
                🍿 MAJORITY (2+ FRIENDS)
              </button>
              <button
                type="button"
                onClick={() => setGroupStrategy('intersection')}
                className={`flex-1 sm:flex-initial px-2 py-1 text-[10px] font-black uppercase border-2 transition-none ${
                  groupStrategy === 'intersection'
                    ? 'bg-retro-yellow text-retro-black border-retro-black shadow-[inset_1px_1px_0_#FFF]'
                    : 'bg-retro-white text-retro-muted border-retro-muted'
                }`}
              >
                🎯 100% UNANIMOUS (ALL)
              </button>
            </div>
          </div>
        )}

        {usernames.map((username, index) => (
          <div key={index} className="retro-outset-deep bg-retro-gray border-4">
            <div className="retro-titlebar px-2 sm:px-3 py-1 flex items-center justify-between">
              <span className="font-bold text-xs sm:text-sm">
                {mode === 'group'
                  ? `FRIEND #${index + 1} LETTERBOXD`
                  : mode === 'compare'
                  ? `USER ${String(index + 1).padStart(2, '0')} WATCHLIST`
                  : 'LETTERBOXD USERNAME'}
              </span>

              {mode === 'group' && usernames.length > MIN_GROUP_USERS && (
                <button
                  type="button"
                  onClick={() => removeFriendSlot(index)}
                  className="retro-outset bg-retro-red text-retro-white px-1.5 py-0.5 text-[9px] font-black hover:bg-red-700 flex items-center gap-0.5"
                  title="Remove friend slot"
                  aria-label={`Remove friend ${index + 1}`}
                >
                  <BiTrash size={12} /> REMOVE
                </button>
              )}
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
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  placeholder={placeholders[index % placeholders.length]}
                  disabled={loading}
                  autoComplete="off"
                  autoCapitalize="none"
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

        {mode === 'group' && usernames.length < MAX_GROUP_USERS && (
          <button
            type="button"
            onClick={addFriendSlot}
            className="w-full py-2 bg-retro-gray border-2 border-dashed border-retro-black font-black text-xs uppercase hover:bg-retro-yellow flex items-center justify-center gap-1.5 text-retro-black"
          >
            <BiUserPlus size={16} /> + ADD ANOTHER FRIEND ({usernames.length}/{MAX_GROUP_USERS})
          </button>
        )}

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
              <span>
                {mode === 'group'
                  ? `FETCHING ${usernames.length} PUBLIC WATCHLISTS...`
                  : mode === 'compare'
                  ? 'FETCHING BOTH WATCHLISTS...'
                  : 'FETCHING WATCHLIST...'}
              </span>
            </>
          ) : (
            mode === 'group' ? <>🍿 SPIN GROUP MOVIE NIGHT</> : mode === 'compare' ? <>▶ FIND COMMON FILMS</> : <>▶ FETCH WATCHLIST</>
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
            {mode === 'group'
              ? <>All {usernames.length} Letterboxd watchlists must be set to <span className="badge-new">PUBLIC</span></>
              : mode === 'compare'
              ? <>Both watchlists must be set to <span className="badge-new">PUBLIC</span></>
              : <>Your watchlist must be set to <span className="badge-new">PUBLIC</span></>}
          </p>
        </div>
      </div>

      {showHelp && <HelpDialog mode={mode} onClose={closeHelp} />}
    </div>
  )
}
