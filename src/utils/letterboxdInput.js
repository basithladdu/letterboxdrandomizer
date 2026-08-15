const RESERVED_PROFILE_PATHS = new Set([
  'about',
  'films',
  'journal',
  'lists',
  'login',
  'search',
  'settings',
  'film',
])

function isLetterboxdUrl(value) {
  return /^(?:https?:\/\/)?(?:www\.)?letterboxd\.com\//i.test(value)
}

/**
 * Accept a Letterboxd username, @username, or a full profile/watchlist URL.
 * Returning an empty string for an unsupported Letterboxd path lets the form
 * show its normal validation message instead of sending a malformed request.
 */
export function normalizeLetterboxdUsername(value) {
  const input = String(value ?? '').trim()
  if (!input) return ''

  if (!isLetterboxdUrl(input)) {
    return input.replace(/^@/, '').replace(/^\/+|\/+$/g, '')
  }

  try {
    const url = new URL(/^https?:\/\//i.test(input) ? input : `https://${input}`)
    const hostname = url.hostname.toLowerCase()
    if (hostname !== 'letterboxd.com' && hostname !== 'www.letterboxd.com') return ''

    const [profilePath] = url.pathname.split('/').filter(Boolean)
    if (!profilePath || RESERVED_PROFILE_PATHS.has(profilePath.toLowerCase())) return ''

    return decodeURIComponent(profilePath).replace(/^@/, '').trim()
  } catch {
    return ''
  }
}
