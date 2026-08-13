import slotMachineSoundUrl from '../assets/slot-machine-10-16.mp3'

// The supplied clip is just over six seconds after MP3 encoding.
export const SLOT_SOUND_DURATION = 6.1

// Retro arcade spin sound - preserved as the browser fallback for the supplied clip.
let audioContext = null

function preloadSlotMachineSound() {
  if (typeof Audio === 'undefined') return null

  const audio = new Audio(slotMachineSoundUrl)
  audio.preload = 'auto'
  audio.load()
  return audio
}

// Start buffering during app load so the first user-triggered spin can play immediately.
let slotMachineAudio = preloadSlotMachineSound()

function getAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)()
  }
  return audioContext
}

function playLegacySpinSound() {
  try {
    const ctx = getAudioContext()
    if (ctx.state === 'suspended') ctx.resume()

    const now = ctx.currentTime
    const SPIN_DURATION = SLOT_SOUND_DURATION

    // Create a classic arcade spin with accelerating pitch drops
    // Pattern: high -> low -> high -> low (repeating) but accelerating
    const baseNotes = [800, 400, 750, 380, 700, 350, 650, 320]
    const timePerNote = SPIN_DURATION / baseNotes.length

    baseNotes.forEach((freq, idx) => {
      const startTime = now + idx * timePerNote
      const duration = timePerNote * 0.9 // Slight gap between notes

      const osc = ctx.createOscillator()
      osc.type = 'square' // Square wave for retro 8-bit sound
      osc.frequency.setValueAtTime(freq, startTime)
      // Slight frequency sweep down during the note
      osc.frequency.linearRampToValueAtTime(freq * 0.9, startTime + duration)

      const gain = ctx.createGain()
      gain.gain.setValueAtTime(0.15, startTime)
      gain.gain.exponentialRampToValueAtTime(0.02, startTime + duration)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(startTime)
      osc.stop(startTime + duration)
    })

    // Add a subtle rising pitch underneath (like a motor spinning up)
    const motorOsc = ctx.createOscillator()
    motorOsc.type = 'triangle'
    motorOsc.frequency.setValueAtTime(200, now)
    motorOsc.frequency.exponentialRampToValueAtTime(800, now + SPIN_DURATION)

    const motorGain = ctx.createGain()
    motorGain.gain.setValueAtTime(0.06, now)
    motorGain.gain.linearRampToValueAtTime(0.12, now + SPIN_DURATION * 0.5)
    motorGain.gain.linearRampToValueAtTime(0.02, now + SPIN_DURATION)

    motorOsc.connect(motorGain)
    motorGain.connect(ctx.destination)

    motorOsc.start(now)
    motorOsc.stop(now + SPIN_DURATION)
  } catch (err) {
    console.warn('Could not play spin sound:', err?.message || err)
  }
}

function playSlotMachineSound() {
  if (typeof Audio === 'undefined') return false

  try {
    slotMachineAudio ||= preloadSlotMachineSound()
    if (!slotMachineAudio) return false
    slotMachineAudio.currentTime = 0
    slotMachineAudio.volume = 0.65
    const playRequest = slotMachineAudio.play()
    playRequest?.catch(() => {})
    return true
  } catch {
    return false
  }
}

export function playSpinSound() {
  if (!playSlotMachineSound()) {
    playLegacySpinSound()
  }
}
