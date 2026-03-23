export default function ProgressBar({ loaded, total, label }) {
  const pct = total > 0 ? Math.min(100, Math.round((loaded / total) * 100)) : 0

  return (
    <div className="w-full space-y-2">
      {label && (
        <p className="text-center text-sm text-lb-text-dim">{label}</p>
      )}
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-lb-surface">
        <div
          className="h-full rounded-full bg-lb-green transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-center text-xs text-lb-text-dim">
        {loaded} film{loaded !== 1 ? 's' : ''} loaded
      </p>
    </div>
  )
}
