export function filmKey(film) {
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
      sharedBy: owners,
      overlapCount: 2,
      totalUsers: 2,
      isUnanimous: true,
    }))
}

export function findGroupSharedFilms(watchlistsWithOwners, options = {}) {
  const { mode = 'intersection', minOverlap = 2 } = options
  const totalUsers = watchlistsWithOwners.length
  const filmMap = new Map()

  watchlistsWithOwners.forEach(({ username, films }) => {
    const userSeen = new Set()
    films.forEach((film) => {
      const key = filmKey(film)
      if (userSeen.has(key)) return
      userSeen.add(key)

      if (!filmMap.has(key)) {
        filmMap.set(key, {
          film,
          sharedBy: [username],
        })
      } else {
        const entry = filmMap.get(key)
        if (!entry.sharedBy.includes(username)) {
          entry.sharedBy.push(username)
        }
      }
    })
  })

  const allOwners = watchlistsWithOwners.map((item) => item.username)

  const entries = Array.from(filmMap.values()).map(({ film, sharedBy }) => ({
    ...film,
    watchlistOwners: allOwners,
    sharedBy,
    overlapCount: sharedBy.length,
    totalUsers,
    isUnanimous: sharedBy.length === totalUsers,
  }))

  if (mode === 'intersection') {
    return entries.filter((film) => film.overlapCount === totalUsers)
  }

  // Majority / Overlap mode: at least minOverlap friends share it
  return entries
    .filter((film) => film.overlapCount >= Math.min(minOverlap, totalUsers))
    .sort((a, b) => b.overlapCount - a.overlapCount)
}
