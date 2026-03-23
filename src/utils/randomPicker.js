/**
 * Fisher-Yates shuffle, returns a new shuffled array
 */
export function shuffle(array) {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

/**
 * Pick one random element from an array
 */
export function pickRandom(array) {
  if (!array || array.length === 0) return null
  return array[Math.floor(Math.random() * array.length)]
}

/**
 * Build a slot-machine sequence: N random entries ending with the chosen film
 */
export function buildSpinSequence(films, chosen, count = 20) {
  const sequence = []
  for (let i = 0; i < count - 1; i++) {
    sequence.push(films[Math.floor(Math.random() * films.length)])
  }
  sequence.push(chosen)
  return sequence
}
