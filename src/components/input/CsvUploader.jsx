import { useState, useRef } from 'react'

export default function CsvUploader({ onFile, loading }) {
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef(null)

  function handleDrop(e) {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) onFile(file)
  }

  function handleChange(e) {
    const file = e.target.files?.[0]
    if (file) onFile(file)
    e.target.value = ''
  }

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => !loading && inputRef.current?.click()}
        className={`
          relative cursor-pointer rounded-xl border-2 border-dashed p-10
          flex flex-col items-center gap-3 transition-all duration-200
          ${dragging
            ? 'border-lb-green bg-lb-green/10'
            : 'border-lb-border hover:border-lb-green/60 hover:bg-lb-surface/50'
          }
          ${loading ? 'pointer-events-none opacity-60' : ''}
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".csv"
          className="hidden"
          onChange={handleChange}
        />
        {/* Icon */}
        <div className={`text-4xl transition-transform duration-200 ${dragging ? 'scale-110' : ''}`}>
          📋
        </div>
        <div className="text-center">
          <p className="text-lb-text-bright font-medium">
            {dragging ? 'Drop it!' : 'Drop your CSV here'}
          </p>
          <p className="mt-1 text-sm text-lb-text-dim">
            or click to browse
          </p>
        </div>
      </div>

      {/* Instructions */}
      <div className="rounded-lg bg-lb-surface/50 p-4 text-xs text-lb-text-dim space-y-1">
        <p className="font-medium text-lb-text mb-2">How to get your CSV:</p>
        <ol className="list-decimal list-inside space-y-1">
          <li>Go to <strong className="text-lb-text">letterboxd.com</strong> → Settings</li>
          <li>Click <strong className="text-lb-text">Import &amp; Export</strong></li>
          <li>Under "Export Your Data", click <strong className="text-lb-text">Export</strong></li>
          <li>Extract the ZIP and upload <strong className="text-lb-green">watchlist.csv</strong></li>
        </ol>
      </div>
    </div>
  )
}
