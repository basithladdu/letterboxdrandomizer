/**
 * Normalize a row from Letterboxd CSV export into our Film shape.
 * CSV columns: Date, Name, Year, Letterboxd URI, Rating
 */
export function normalizeRow(row) {
  const uri = row['Letterboxd URI'] || ''
  const slug = uri.replace(/\/$/, '').split('/').pop() || ''

  return {
    title: row['Name'] || row['name'] || '',
    year: String(row['Year'] || row['year'] || ''),
    letterboxdUri: uri,
    letterboxdSlug: slug,
    rating: row['Rating'] || row['rating'] || null,
    posterUrl: null,
  }
}

export function normalizeRows(rows) {
  return rows
    .map(normalizeRow)
    .filter((f) => f.title.trim() !== '')
}
