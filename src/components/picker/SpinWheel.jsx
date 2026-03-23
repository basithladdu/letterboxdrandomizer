import { useEffect, useRef, useState } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { buildSpinSequence } from '../../utils/randomPicker.js'

const ITEM_HEIGHT = 72

// Confetti effect for celebration
function createConfetti() {
  const colors = ['#FF0000', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#00FF00']
  for (let i = 0; i < 30; i++) {
    const confetti = document.createElement('div')
    confetti.className = 'confetti'
    confetti.style.left = Math.random() * 100 + '%'
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)]
    confetti.style.width = (Math.random() * 10 + 5) + 'px'
    confetti.style.height = (Math.random() * 10 + 5) + 'px'
    confetti.style.animationDelay = Math.random() * 0.5 + 's'
    document.body.appendChild(confetti)
    setTimeout(() => confetti.remove(), 3500)
  }
}

export default function SpinWheel({ films, chosen, onComplete, spinning }) {
  const controls = useAnimation()
  const [sequence, setSequence] = useState([])
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (!spinning || !chosen || !films.length) return
    if (hasAnimated.current) {
      hasAnimated.current = false
    }

    const seq = buildSpinSequence(films, chosen, 25)
    setSequence(seq)

    // Reset to top, then animate
    controls.set({ y: 0 })

    const totalDistance = (seq.length - 1) * ITEM_HEIGHT

    controls.start({
      y: -totalDistance,
      transition: {
        duration: 3.2,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    }).then(() => {
      hasAnimated.current = true
      // Add celebration effect
      createConfetti()
      onComplete?.()
    })
  }, [spinning, chosen])

  if (!spinning && !sequence.length) {
    return null
  }

  return (
    <div className="relative w-full mx-auto">
      {/* Highlight bar with 3D effect */}
      <div
        className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[72px] pointer-events-none z-10 border-y-4 border-retro-yellow"
        style={{
          backgroundColor: 'rgba(255, 255, 0, 0.2)',
          boxShadow: 'inset 0 4px 0 rgba(255,255,0,0.3), inset 0 -4px 0 rgba(0,0,0,0.2)'
        }}
      />

      {/* Spin window with beveled frame */}
      <div
        className="spin-window retro-inset border-4"
        style={{
          height: ITEM_HEIGHT,
          backgroundColor: '#FFFFFF',
          borderColor: '#808080 #FFFFFF #FFFFFF #808080'
        }}
      >
        <motion.div animate={controls} style={{ y: 0 }}>
          {sequence.map((film, i) => (
            <div
              key={i}
              className="flex items-center justify-center px-4 border-b-2 border-retro-lightgray"
              style={{
                height: ITEM_HEIGHT,
                backgroundColor: i % 2 === 0 ? '#FFFFFF' : '#E8E8E8'
              }}
            >
              <p className="text-center font-black text-retro-black leading-tight line-clamp-2 text-lg uppercase tracking-tight">
                {film.title}
                {film.year && (
                  <span className="block text-sm font-mono text-retro-muted">
                    ({film.year})
                  </span>
                )}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
