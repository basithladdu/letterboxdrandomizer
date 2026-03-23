# Letterboxd Randomizer

Randomly pick a film from your Letterboxd watchlist. No API key needed — scrapes public watchlists directly.

**Live:** https://letterboxd-randomizer.vercel.app
**GitHub:** https://github.com/basithladdu/letterboxdrandomizer

---

## Features

- **Fetch by Username** — Enter your Letterboxd username and the app scrapes your entire public watchlist (multi-page support)
- **Slot Machine Animation** — Framer Motion-powered spinning wheel that scrolls through random titles
- **Poster Display** — Fetches film posters from Letterboxd thumbnails (no API key required)
- **Letterboxd Integration** — Click to view any film directly on Letterboxd
- **Dark Theme** — Letterboxd-inspired design with green accents
- **No Installation** — Works entirely in the browser

---

## How to Use

### For Users

1. Go to https://letterboxd-randomizer.vercel.app
2. Enter your Letterboxd username
3. **Make sure your watchlist is public** (Settings → Privacy → Watchlist)
4. Click "Fetch Watchlist"
5. Watch the slot machine spin and get a random film!

### For Developers

#### Setup

```bash
git clone https://github.com/basithladdu/letterboxdrandomizer
cd letterboxdrandomizer
npm install
npm run dev
```

Visit `http://localhost:5173`

#### Build

```bash
npm run build
npm run preview
```

#### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

The app deploys automatically with auto-deployment enabled.

---

## Tech Stack

- **React 18** — UI framework
- **Vite 6** — Build tool & dev server
- **Framer Motion 11** — Animations
- **Tailwind CSS 3** — Styling
- **PapaParse 5** — CSV parsing (optional)
- **allorigins** — CORS proxy for scraping (public watchlists)

---

## Architecture

### Data Flow

1. **Input** → User enters Letterboxd username
2. **Scrape** → CORS proxy fetches watchlist pages (`/watchlist/page/1/`, `/page/2/`, etc.)
3. **Parse** → DOMParser extracts film metadata (title, year, slug, poster URL)
4. **Picker** → Random selection with slot-machine animation
5. **Display** → Movie card with poster, title, and Letterboxd link

### Key Services

- **`corsProxy.js`** — Handles CORS with allorigins + corsproxy fallback
- **`letterboxdScraper.js`** — Scrapes watchlist pages, extracts film data
- **`omdbService.js`** — Optional poster lookup (requires API key)
- **`randomPicker.js`** — Fisher-Yates shuffle + random selection

### Selectors

Films are scraped using these CSS selectors:
```javascript
li.griditem div.react-component  // Film entry container
```

Data extracted from attributes:
```javascript
data-item-name    // "The Trial of the Chicago 7 (2020)"
data-item-slug    // "the-trial-of-the-chicago-7"
data-target-link  // "/film/the-trial-of-the-chicago-7/"
```

---

## Limitations

- ✅ Works with any public Letterboxd watchlist
- ⚠️ Watchlist must be **public** (not private)
- ⚠️ Fetches from **watchlist pages only** (not all rated films)
- ⚠️ CORS proxy may rate-limit if abused
- ⚠️ Large watchlists (200+ films) take longer to scrape

---

## Environment Variables

**Optional:** Add an OMDb API key for better poster support on CSV imports.

```bash
# .env
VITE_OMDB_API_KEY=your_key_here
```

Get a free key at https://www.omdbapi.com/apikey.aspx (1,000 requests/day).

---

## Privacy & Disclaimer

- **Not affiliated** with Letterboxd
- **Public data only** — Only scrapes publicly visible watchlists
- **No storage** — Your username is never stored or logged
- **Open source** — Fully transparent code, no tracking

---

## Troubleshooting

### "Watchlist is private"
→ Go to Letterboxd → Settings → Privacy → Toggle "Watchlist" to public

### "No films found"
→ Make sure you have films in your watchlist and it's set to public

### "CORS proxy unavailable"
→ Check your internet connection. The app uses allorigins.win + corsproxy.io as fallbacks

### Slow scraping
→ Large watchlists (100+ films) take 30-60 seconds to scrape all pages

---

## Contributing

Found a bug? Want to add CSV support back or improve the scraper?

Fork, create a branch, and submit a pull request!

```bash
git checkout -b feature/your-feature
git commit -m "Add your feature"
git push origin feature/your-feature
```

---

## License

MIT — Use freely, credit appreciated!

---

**Made with ♥ by [Shaik Abdul Basith](https://letterboxd.com/basithladdu)**

Follow me:
- 🎬 [Letterboxd](https://letterboxd.com/basithladdu)
- 💻 [GitHub](https://github.com/basithladdu)
- 💼 [LinkedIn](https://linkedin.com/in/basithladoo)
