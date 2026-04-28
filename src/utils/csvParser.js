import Papa from 'papaparse'

export function parseLetterboxdCSV(file) {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const films = results.data.map((row) => {
            const title = row['Name'] || row['Title'] || ''
            const year = row['Year'] || ''
            const uri = row['Letterboxd URI'] || ''
            const dateAdded = row['Date'] || ''
            
            let slug = ''
            if (uri) {
              const parts = uri.split('/')
              slug = parts[parts.length - 1] || parts[parts.length - 2]
            }

            return {
              title,
              year,
              letterboxdUri: uri,
              letterboxdSlug: slug,
              dateAdded,
              posterUrl: null,
            }
          }).filter(f => f.title)

          if (films.length === 0) {
            reject(new Error('No valid films found in the CSV file.'))
          } else {
            resolve(films)
          }
        } catch (err) {
          reject(new Error('Failed to parse CSV format.'))
        }
      },
      error: (err) => {
        reject(new Error('Error reading the CSV file.'))
      }
    })
  })
}
