function filmKey(film) {
  if (film?.letterboxdSlug) {
    return `slug:${film.letterboxdSlug.toLowerCase()}`
  }

  if (film?.letterboxdUri) {
    return `uri:${film.letterboxdUri.toLowerCase()}`
  }

  return `title:${(film?.title || '').trim().toLowerCase()}|year:${film?.year || ''}`
}

export function findSharedFilms(firstWatchlist, secondWatchlist, owners = []) {
  const secondKeys = new Set(secondWatchlist.map(filmKey))
  const seen = new Set()

  return firstWatchlist
    .filter((film) => {
      const key = filmKey(film)
      if (seen.has(key) || !secondKeys.has(key)) return false
      seen.add(key)
      return true
    })
    .map((film) => ({
      ...film,
      watchlistOwners: owners,
    }))
}
