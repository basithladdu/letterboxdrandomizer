# Letterboxd Watchlist Mixer

A lightweight web app that picks a random film from one public Letterboxd watchlist or finds common films across two public lists. No API key or account is needed.

[Live Demo](https://letterboxd-randomizer.vercel.app)

---

## Features

- **Random Film** - The default mode picks a film from one public watchlist.
- **Common Films** — Enter two usernames and find the films both people want to watch.
- **Full Fetch** — Every available watchlist page is fetched, with pagination and retry handling.
- **Slot Machine Reveal** — A retro Framer Motion animation picks the next film.
- **Poster Previews** — Displays film posters directly from Letterboxd.
- **Mobile Optimized** — Designed to work on narrow screens and touch devices.
- **Privacy Focused** — No account required; only public watchlist data is used.

## Tech Stack

- **React 18** + **Vite**
- **Framer Motion** (animation)
- **Tailwind CSS** (styling)
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

Random Film mode is the default. Enter one Letterboxd username and spin every film in that public watchlist.

Common Films mode accepts two Letterboxd usernames. Both watchlists must be public. The app fetches every available page for each user, matches films by their Letterboxd slug, and spins only films that appear in both lists.

The CSV parser remains in the source for compatibility, but CSV upload is not exposed in the app interface.

## Contributing

Contributions are welcome. Check out the [Contributing Guide](CONTRIBUTING.md).

## License

This project is licensed under the [MIT License](LICENSE).

---

Made by [Shaik Abdul Basith](https://letterboxd.com/basithladoo)
