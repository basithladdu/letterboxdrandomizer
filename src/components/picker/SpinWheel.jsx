import { useEffect, useRef, useState } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { buildSpinSequence } from '../../utils/randomPicker.js'
import { playSpinSound, preloadSpinSound, stopSpinSound, SLOT_SOUND_DURATION } from '../../utils/spinSound.js'

const ITEM_HEIGHT = 72

let confettiAudioContext = null

function playConfettiSound() {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext
    if (!AudioContextClass) return
    confettiAudioContext ||= new AudioContextClass()
    const ctx = confettiAudioContext
    if (ctx.state === 'suspended') ctx.resume()

    const now = ctx.currentTime
    // Bright ascending arpeggio - a quick "ta-da" chime for the win moment.
    const notes = [523.25, 659.25, 783.99, 1046.5]

    notes.forEach((freq, idx) => {
      const startTime = now + idx * 0.08
      const duration = 0.35

      const osc = ctx.createOscillator()
      osc.type = 'square'
      osc.frequency.setValueAtTime(freq, startTime)

      const gain = ctx.createGain()
      gain.gain.setValueAtTime(0.001, startTime)
      gain.gain.linearRampToValueAtTime(0.18, startTime + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(startTime)
      osc.stop(startTime + duration)
    })
  } catch (err) {
    console.warn('Could not play confetti sound:', err?.message || err)
  }
}

function createConfetti() {
  playConfettiSound()
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
    preloadSpinSound()
    return () => stopSpinSound()
  }, [])

  useEffect(() => {
    if (!spinning || !chosen || !films.length) return
    if (hasAnimated.current) {
      hasAnimated.current = false
    }

    const seq = buildSpinSequence(films, chosen, 25)
    setSequence(seq)

    controls.set({ y: 0 })

    const totalDistance = (seq.length - 1) * ITEM_HEIGHT

    playSpinSound()

    let cancelled = false

    controls.start({
      y: -totalDistance,
      transition: {
        duration: SLOT_SOUND_DURATION,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    }).then(() => {
      if (cancelled) return
      stopSpinSound()
      hasAnimated.current = true
      createConfetti()
      onComplete?.()
    })

    return () => {
      cancelled = true
      controls.stop()
      stopSpinSound()
    }
  }, [spinning, chosen])

  if (!spinning && !sequence.length) {
    return null
  }

  return (
    <div className="relative w-full mx-auto">
      <div
        className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[72px] pointer-events-none z-10 border-y-4 border-retro-yellow"
        style={{
          backgroundColor: 'rgba(255, 255, 0, 0.2)',
          boxShadow: 'inset 0 4px 0 rgba(255,255,0,0.3), inset 0 -4px 0 rgba(0,0,0,0.2)'
        }}
      />

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
              <p className="text-center font-black text-retro-black leading-tight line-clamp-2 text-base sm:text-lg uppercase tracking-tight">
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
