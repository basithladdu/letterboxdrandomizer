import slotMachineSoundUrl from '../assets/slot-machine-10-16.mp3'

// The supplied clip is just over six seconds after MP3 encoding.
export const SLOT_SOUND_DURATION = 6.1

// Retro arcade spin sound - preserved as the browser fallback for the supplied clip.
let audioContext = null
const activeLegacySources = new Set()
let soundPlaybackToken = 0

function preloadSlotMachineSound() {
  if (typeof Audio === 'undefined') return null

  const audio = new Audio(slotMachineSoundUrl)
  audio.preload = 'auto'
  audio.playsInline = true
  audio.load()
  return audio
}

// Start buffering during app load so the first user-triggered spin can play immediately.
let slotMachineAudio = preloadSlotMachineSound()

export function preloadSpinSound() {
  slotMachineAudio ||= preloadSlotMachineSound()
  slotMachineAudio?.load()
}

function getAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)()
  }
  return audioContext
}

function playLegacySpinSound() {
  try {
    stopLegacySpinSound()
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

      activeLegacySources.add(osc)
      osc.addEventListener('ended', () => activeLegacySources.delete(osc), { once: true })

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

    activeLegacySources.add(motorOsc)
    motorOsc.addEventListener('ended', () => activeLegacySources.delete(motorOsc), { once: true })

    motorOsc.start(now)
    motorOsc.stop(now + SPIN_DURATION)
  } catch (err) {
    console.warn('Could not play spin sound:', err?.message || err)
  }
}

function stopLegacySpinSound() {
  activeLegacySources.forEach((source) => {
    try {
      source.stop()
    } catch {
      // The source may already have finished.
    }
    try {
      source.disconnect()
    } catch {
      // Disconnect is best effort for finished sources.
    }
  })
  activeLegacySources.clear()
}

function playSlotMachineSound(playbackToken) {
  if (typeof Audio === 'undefined') return false

  try {
    slotMachineAudio ||= preloadSlotMachineSound()
    if (!slotMachineAudio) return false
    slotMachineAudio.currentTime = 0
    slotMachineAudio.volume = 0.65
    const playRequest = slotMachineAudio.play()
    playRequest?.catch(() => {
      // Mobile autoplay policies can reject the element even after preload;
      // keep the spin usable with the Web Audio fallback.
      if (playbackToken === soundPlaybackToken) playLegacySpinSound()
    })
    return true
  } catch {
    return false
  }
}

export function stopSpinSound() {
  soundPlaybackToken += 1
  if (slotMachineAudio) {
    slotMachineAudio.pause()
    try {
      slotMachineAudio.currentTime = 0
    } catch {
      // Resetting a not-yet-ready audio element is not supported everywhere.
    }
  }
  stopLegacySpinSound()
}

export function playSpinSound() {
  stopSpinSound()
  const playbackToken = soundPlaybackToken
  if (!playSlotMachineSound(playbackToken)) {
    playLegacySpinSound()
  }
}
