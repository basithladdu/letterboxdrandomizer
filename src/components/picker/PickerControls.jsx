export default function PickerControls({ onSpin, onReset, spinning, filmsCount }) {
  return (
    <div className="space-y-2 sm:space-y-3 w-full mx-auto">
      <span className="sr-only" aria-live="polite">
        {spinning
          ? 'Choosing a film from your watchlist.'
          : `${filmsCount} film${filmsCount === 1 ? '' : 's'} available.`}
      </span>
      {/* Buttons Section */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3 max-w-2xl mx-auto">
        {/* SPIN Button */}
        <button
          type="button"
          onClick={onSpin}
          disabled={spinning}
          aria-label={spinning ? 'Choosing a film' : 'Spin again to choose another film'}
          aria-busy={spinning}
          className={`
            min-h-[44px] px-2 py-2 sm:py-4 font-black text-xs sm:text-base uppercase tracking-widest
            border-4 transition-none
            flex items-center justify-center gap-2 touch-manipulation
            ${spinning ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          style={{
            backgroundColor: '#FF0000',
            color: '#FFFFFF',
            borderColor: spinning ? '#808080 #FFFFFF #FFFFFF #808080' : '#FFFFFF #808080 #808080 #FFFFFF',
            boxShadow: spinning
              ? 'inset 1px 1px 0 #404040, inset -1px -1px 0 #DFDFDF'
              : 'inset -1px -1px 0 #404040, inset 1px 1px 0 #DFDFDF',
            transform: spinning ? 'translate(1px, 1px)' : 'translate(0, 0)',
            textShadow: '2px 2px 0 #800000'
          }}
          onMouseDown={(e) => {
            if (!spinning) {
              e.currentTarget.style.borderColor = '#808080 #FFFFFF #FFFFFF #808080'
              e.currentTarget.style.boxShadow = 'inset 1px 1px 0 #404040, inset -1px -1px 0 #DFDFDF'
              e.currentTarget.style.transform = 'translate(1px, 1px)'
            }
          }}
          onMouseUp={(e) => {
            if (!spinning) {
              e.currentTarget.style.borderColor = '#FFFFFF #808080 #808080 #FFFFFF'
              e.currentTarget.style.boxShadow = 'inset -1px -1px 0 #404040, inset 1px 1px 0 #DFDFDF'
              e.currentTarget.style.transform = 'translate(0, 0)'
            }
          }}
        >
          {spinning ? (
            <>
              <span className="inline-block w-4 h-4 border-2 border-retro-white border-t-transparent animate-spin-retro" />
              SPINNING…
            </>
          ) : (
            <>SPIN AGAIN</>
          )}
        </button>

        {/* RESET Button */}
        <button
          type="button"
          onClick={onReset}
          disabled={spinning}
          aria-label="Start over with a different watchlist"
          className={`
            min-h-[44px] px-2 py-2 sm:py-4 font-black text-xs sm:text-base uppercase tracking-widest
            border-4 transition-none
            touch-manipulation
            ${spinning ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          style={{
            backgroundColor: '#0000FF',
            color: '#FFFFFF',
            borderColor: spinning ? '#808080 #FFFFFF #FFFFFF #808080' : '#FFFFFF #808080 #808080 #FFFFFF',
            boxShadow: spinning
              ? 'inset 1px 1px 0 #404040, inset -1px -1px 0 #DFDFDF'
              : 'inset -1px -1px 0 #404040, inset 1px 1px 0 #DFDFDF',
            transform: spinning ? 'translate(1px, 1px)' : 'translate(0, 0)',
            textShadow: '2px 2px 0 #000080'
          }}
          onMouseDown={(e) => {
            if (!spinning) {
              e.currentTarget.style.borderColor = '#808080 #FFFFFF #FFFFFF #808080'
              e.currentTarget.style.boxShadow = 'inset 1px 1px 0 #404040, inset -1px -1px 0 #DFDFDF'
              e.currentTarget.style.transform = 'translate(1px, 1px)'
            }
          }}
          onMouseUp={(e) => {
            if (!spinning) {
              e.currentTarget.style.borderColor = '#FFFFFF #808080 #808080 #FFFFFF'
              e.currentTarget.style.boxShadow = 'inset -1px -1px 0 #404040, inset 1px 1px 0 #DFDFDF'
              e.currentTarget.style.transform = 'translate(0, 0)'
            }
          }}
        >
          START OVER
        </button>
      </div>
    </div>
  )
}
