export default function ErrorBanner({ message, onDismiss }) {
  if (!message) return null
  return (
    <div className="retro-outset-deep border-4 overflow-hidden">
      <div className="retro-titlebar px-3 py-1 flex justify-between items-center">
        <span className="font-bold text-xs uppercase">ERROR MESSAGE</span>
        <div className="flex gap-2">
          <div className="w-3 h-3 retro-outset bg-retro-red" />
        </div>
      </div>
      <div className="retro-inset bg-retro-panelYellow p-3 flex items-start gap-3">
        <span className="font-bold text-retro-red text-sm flex-shrink-0">!</span>
        <span className="flex-1 text-xs sm:text-sm font-bold text-retro-black">{message}</span>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="font-bold text-retro-black hover:bg-retro-yellow text-xs px-2 py-1 border-2"
            style={{borderColor: '#FFFFFF #808080 #808080 #FFFFFF', boxShadow: 'inset -1px -1px 0 #404040, inset 1px 1px 0 #DFDFDF'}}
            aria-label="Dismiss"
          >
            CLOSE
          </button>
        )}
      </div>
    </div>
  )
}
