import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc, collection, getDocs, serverTimestamp, query, orderBy, limit, increment } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAEaHWsYmyRAWAuwiefAV1BjJpV7xEPrd4",
  authDomain: "letterboxd-rand-91b1.firebaseapp.com",
  projectId: "letterboxd-rand-91b1",
  storageBucket: "letterboxd-rand-91b1.firebasestorage.app",
  messagingSenderId: "584050348726",
  appId: "1:584050348726:web:2521a03fdcd5ed2a510c17"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Bump when the scraper changes in a way that makes old cached data suspect.
// v1 caches were written by the scraper that silently truncated long
// watchlists, so they must never be served again. v2 caches predate the
// poster-resolution fixes (a.ltrbxd.com CDN mapping + empty-poster
// filtering) and can carry baked-in broken posterUrl values. v3 caches
// still trusted Letterboxd's data-poster-url grid attribute, which is
// actually a client-side-JS-only lazy-load resolver endpoint ("/film/
// slug/image-150/") that 403s as a direct image - so v3 posterUrl values
// can be silently broken images too.
const CACHE_VERSION = 4;

// Re-scrape watchlists older than this so new films show up.
const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000;

// Firestore documents are capped at 1 MiB; stay well clear of it.
const MAX_CACHE_BYTES = 800_000;

// Firestore is commonly blocked by ad blockers and privacy browsers. When it is
// unreachable its promises simply never settle (setDoc waits for a server ack),
// so every call is raced against a timeout. Analytics must never be able to
// stop someone from getting their film.
const FIRESTORE_TIMEOUT_MS = 4000;

function withTimeout(promise, ms = FIRESTORE_TIMEOUT_MS) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Firestore timed out")), ms)
    ),
  ]);
}

/**
 * Save watchlist data for a user. Caching is best-effort: a failure here must
 * never stop the user from getting their film.
 */
export async function saveWatchlist(username, films, meta = {}) {
  try {
    if (!username || !films.length) return;

    // Only cache a scrape we believe is complete.
    if (meta.complete === false) return;

    const payload = {
      films,
      lastUpdated: new Date().toISOString(),
      count: films.length,
      version: CACHE_VERSION,
    };

    if (JSON.stringify(payload).length > MAX_CACHE_BYTES) return;

    const userRef = doc(db, "watchlists", username.toLowerCase());
    await withTimeout(setDoc(userRef, payload));
  } catch (err) {
    console.warn("Watchlist cache write skipped:", err?.message || err);
  }
}

/**
 * Load watchlist data for a user, ignoring stale or incomplete caches.
 */
export async function getSavedWatchlist(username) {
  try {
    if (!username) return null;
    const userRef = doc(db, "watchlists", username.toLowerCase());
    const userSnap = await withTimeout(getDoc(userRef));

    if (!userSnap.exists()) return null;

    const data = userSnap.data();

    // Written by an older, truncation-prone scraper.
    if (data.version !== CACHE_VERSION) return null;

    // Stored count disagrees with the array: partial write.
    if (!Array.isArray(data.films) || data.films.length === 0) return null;
    if (data.count != null && data.count !== data.films.length) return null;

    const age = Date.now() - new Date(data.lastUpdated).getTime();
    if (!Number.isFinite(age) || age > CACHE_TTL_MS) return null;

    return data.films;
  } catch (err) {
    console.warn("Watchlist cache read skipped:", err?.message || err);
    return null;
  }
}

/**
 * Log a user search for analytics.
 */
export async function logUserSearch(username) {
  try {
    if (!username) return;
    const searchRef = doc(db, "searches", username.toLowerCase());
    await withTimeout(setDoc(searchRef, {
      username: username.toLowerCase(),
      timestamp: serverTimestamp(),
      count: increment(1)
    }, { merge: true }));
  } catch (err) {
    console.warn("Search analytics skipped:", err?.message || err);
  }
}

/**
 * Get analytics data for the admin page.
 */
export async function getAnalytics() {
  const searchesRef = collection(db, "searches");
  const q = query(searchesRef, orderBy("timestamp", "desc"), limit(100));
  const querySnapshot = await getDocs(q);
  
  const searches = [];
  querySnapshot.forEach((doc) => {
    searches.push(doc.data());
  });
  
  return {
    totalCount: querySnapshot.size,
    searches
  };
}
