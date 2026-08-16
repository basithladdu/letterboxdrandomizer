# Letterboxd Watchlist Mixer

A retro lightweight web app that picks a random film from public Letterboxd watchlists, finds common films across pairs, or pools watchlists for group movie nights with up to 6 friends. No API key or account is needed.

[Live Demo](https://letterboxdrandomizer.wedevit.in/)

---

## Features

- **Watchlist Picker** — Picks a random film from any public Letterboxd watchlist.
- **Common Films (2 Users)** — Compares two public watchlists and picks from shared titles.
- **🍿 Group Movie Night (3–6 Friends)** — Pools watchlists for 3 to 6 people with **100% Unanimous** or **Majority (2+ Friends)** matching modes.
- **🎟️ Retro Cinema Ticket Generator** — Generates a vintage perforated cinema ticket stub with 1-click high-res PNG download, image copying, and social sharing.
- **📊 Watchlist Roaster & Diagnostic Stats** — Analyzes watchlist depth, backlog clear timeline (at 1 film/night), dominant decade, oldest hoarded film, and dynamic cinephile roasts.
- **📺 Where to Watch** — 1-click streaming availability search via JustWatch.
- **Slot Machine Reveal** — A retro Framer Motion slot animation with authentic 8-bit sound effects.
- **Poster Previews** — Displays film posters directly from Letterboxd with OMDB fallback.
- **Mobile Optimized & Fast** — Works seamlessly across mobile and desktop.

## Tech Stack

- **React 18** + **Vite**
- **Framer Motion** (retro animation)
- **Tailwind CSS** (styling)
- **HTML5 Canvas** (cinema ticket export)
- **Vercel serverless proxy** (Letterboxd fetching)

## Development

1. Clone the repo:
   ```bash
   git clone https://github.com/basithladoo/letterboxdrandomizer.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run locally:
   ```bash
   npm run dev
   ```

## Watchlist Modes

1. **Watchlist Picker**: Enter one Letterboxd username or profile link to roll from all public films in that watchlist.
2. **Common Films**: Enter two usernames to find intersection films both people want to watch.
3. **Group Movie Night**: Enter 3 to 6 usernames. Choose **Unanimous** mode (films shared by all friends) or **Majority** mode (films shared by 2+ friends with friend badges).

## Contributing

Contributions are welcome. Check out the [Contributing Guide](CONTRIBUTING.md).

## License

This project is licensed under the [MIT License](LICENSE).

---

Made by [Shaik Abdul Basith](https://letterboxd.com/basithladoo) & [WEDEVIT.IN](https://wedevit.in)
