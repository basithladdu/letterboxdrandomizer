# Letterboxd Randomizer

A lightweight web app to randomly pick a film from your Letterboxd watchlist. No API key needed — it works by fetching public watchlist data directly.

[**Live Demo**](https://letterboxd-randomizer.vercel.app)

---

## 🚀 Features

- **Direct Fetch** — Just enter your username to pull your watchlist.
- **Slot Machine Reveal** — A fun Framer Motion animation to pick your next watch.
- **Poster Previews** — Displays film posters directly from Letterboxd.
- **Mobile Optimized** — Designed to work seamlessly across all devices.
- **Privacy Focused** — No data storage, no tracking, just public data.

## 🛠️ Tech Stack

- **React 18** + **Vite**
- **Framer Motion** (Animations)
- **Tailwind CSS** (Styling)
- **CORS Proxy** (Scraping)

## 💻 Development

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

## 🤝 Contributing

Contributions are welcome! Check out the [Contributing Guide](CONTRIBUTING.md) to get started.

## 📂 CSV Export Method

If the username fetch fails (e.g., due to CORS proxy limits), you can use the direct export method:

1.  Go to your Letterboxd watchlist (e.g., `letterboxd.com/USERNAME/watchlist/`).
2.  Scroll to the bottom and click **Export**.
3.  Upload the `watchlist.csv` file to the **CSV Upload** tab in the app.

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

**Made by [Shaik Abdul Basith](https://letterboxd.com/basithladoo)**

[Letterboxd](https://letterboxd.com/basithladoo) | [GitHub](https://github.com/basithladoo) | [Twitter](https://twitter.com/basithladoo)
