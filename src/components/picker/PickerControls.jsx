export default function PickerControls({ onSpin, onBattle, onReset, spinning, filmsCount }) {
  return (
    <div className="space-y-2 sm:space-y-3 w-full mx-auto font-sans">
      <span className="sr-only" aria-live="polite">
        {spinning
          ? 'Choosing a film from your watchlist.'
          : `${filmsCount} film${filmsCount === 1 ? '' : 's'} available.`}
      </span>

      {/* 3 Buttons Grid Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 max-w-2xl mx-auto">
        {/* SPIN Button */}
        <button
          type="button"
          onClick={onSpin}
          disabled={spinning}
          aria-label={spinning ? 'Choosing a film' : 'Spin again to choose another film'}
          aria-busy={spinning}
          className={`
            min-h-[44px] px-2 py-2 sm:py-3 font-black text-xs sm:text-sm uppercase tracking-widest
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
            textShadow: '2px 2px 0 #800000'
          }}
        >
          {spinning ? (
            <>
              <span className="inline-block w-4 h-4 border-2 border-retro-white border-t-transparent animate-spin-retro" />
              SPINNING…
            </>
          ) : (
            <>🎰 SPIN AGAIN</>
          )}
        </button>

        {/* 1v1 BATTLE Button */}
        {onBattle && (
          <button
            type="button"
            onClick={onBattle}
            disabled={spinning || filmsCount < 2}
            className={`
              min-h-[44px] px-2 py-2 sm:py-3 font-black text-xs sm:text-sm uppercase tracking-widest
              border-4 transition-none
              flex items-center justify-center gap-1.5 touch-manipulation
              ${spinning || filmsCount < 2 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#FFE033]'}
            `}
            style={{
              backgroundColor: '#E5A912',
              color: '#111111',
              borderColor: '#FFFFFF #808080 #808080 #FFFFFF',
              boxShadow: 'inset -1px -1px 0 #404040, inset 1px 1px 0 #DFDFDF',
            }}
          >
            🥊 1v1 BATTLE
          </button>
        )}

        {/* RESET Button */}
        <button
          type="button"
          onClick={onReset}
          disabled={spinning}
          aria-label="Start over with a different watchlist"
          className={`
            min-h-[44px] px-2 py-2 sm:py-3 font-black text-xs sm:text-sm uppercase tracking-widest
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
            textShadow: '2px 2px 0 #000080'
          }}
        >
          START OVER
        </button>
      </div>
    </div>
  )
}
