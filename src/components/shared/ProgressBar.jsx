export default function ProgressBar({ loaded, total, label }) {
  const pct = total > 0 ? Math.min(100, Math.round((loaded / total) * 100)) : 0

  return (
    <div className="w-full space-y-2">
      {label && (
        <p className="text-center text-xs sm:text-sm font-bold text-retro-black uppercase tracking-widest">{label}</p>
      )}
      <div className="retro-inset bg-retro-white border-2 overflow-hidden" style={{height: '20px'}}>
        <div
          className="h-full bg-retro-green transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-center text-xs font-mono text-retro-black font-bold">
        {loaded}/{total} • {pct}%
      </p>
    </div>
  )
}
