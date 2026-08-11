// Retro 8-bit spin sound generated with Web Audio API.
// Creates a descending pitch sweep with some noise for a classic arcade feel.

let audioContext = null

function getAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)()
  }
  return audioContext
}

export function playSpinSound() {
  try {
    const ctx = getAudioContext()

    // Resume context if suspended (required by browsers after user interaction)
    if (ctx.state === 'suspended') {
      ctx.resume()
    }

    const now = ctx.currentTime
    const SPIN_DURATION = 3.2 // Match the spin animation duration
    const PATTERN_DURATION = 0.4 // One "chirp" pattern

    // Create a sustained noise background throughout the entire spin
    const noise = ctx.createBufferSource()
    const bufferSize = ctx.sampleRate * SPIN_DURATION
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const noiseData = noiseBuffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      noiseData[i] = (Math.random() * 2 - 1) * 0.3
    }
    noise.buffer = noiseBuffer
    noise.loop = false

    // Create filter for the noise
    const filter = ctx.createBiquadFilter()
    filter.type = 'highpass'
    filter.frequency.value = 400
    filter.Q.value = 0.5

    // Noise gain with slow fade-in and fade-out
    const noiseGain = ctx.createGain()
    noiseGain.gain.setValueAtTime(0, now)
    noiseGain.gain.linearRampToValueAtTime(0.1, now + 0.1)
    noiseGain.gain.linearRampToValueAtTime(0.1, now + SPIN_DURATION - 0.2)
    noiseGain.gain.linearRampToValueAtTime(0, now + SPIN_DURATION)

    noise.connect(filter)
    filter.connect(noiseGain)
    noiseGain.connect(ctx.destination)
    noise.start(now)
    noise.stop(now + SPIN_DURATION)

    // Repeat the pitch pattern every PATTERN_DURATION throughout the spin
    const pitches = [
      { freq: 600, duration: 0.08 },
      { freq: 500, duration: 0.08 },
      { freq: 400, duration: 0.1 },
      { freq: 300, duration: 0.14 },
    ]

    for (let cycle = 0; cycle < Math.ceil(SPIN_DURATION / PATTERN_DURATION); cycle++) {
      const cycleStart = cycle * PATTERN_DURATION
      if (cycleStart >= SPIN_DURATION) break

      pitches.forEach(({ freq, duration }) => {
        const startTime = now + cycleStart + pitches.slice(0, pitches.indexOf({ freq, duration })).reduce((sum, p) => sum + p.duration, 0)
        if (startTime + duration > now + SPIN_DURATION) return

        const osc = ctx.createOscillator()
        osc.frequency.value = freq
        osc.type = 'sine'

        const gain = ctx.createGain()
        gain.gain.setValueAtTime(0.08, startTime)
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration)

        osc.connect(gain)
        gain.connect(ctx.destination)

        osc.start(startTime)
        osc.stop(startTime + duration)
      })
    }
  } catch (err) {
    console.warn('Could not play spin sound:', err?.message || err)
  }
}
