export default function ErrorBanner({ message, onDismiss }) {
  if (!message) return null
  return (
    <div className="flex items-start gap-3 rounded-lg border border-red-800/50 bg-red-950/40 px-4 py-3 text-sm text-red-300">
      <span className="mt-0.5 text-red-400">⚠</span>
      <span className="flex-1">{message}</span>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-red-400 hover:text-red-200 transition-colors"
          aria-label="Dismiss"
        >
          ✕
        </button>
      )}
    </div>
  )
}
