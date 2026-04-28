import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

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

/**
 * Save watchlist data for a user.
 */
export async function saveWatchlist(username, films) {
  if (!username || !films.length) return;
  const userRef = doc(db, "watchlists", username.toLowerCase());
  await setDoc(userRef, {
    films,
    lastUpdated: new Date().toISOString(),
    count: films.length
  });
}

/**
 * Load watchlist data for a user.
 */
export async function getSavedWatchlist(username) {
  if (!username) return null;
  const userRef = doc(db, "watchlists", username.toLowerCase());
  const userSnap = await getDoc(userRef);
  
  if (userSnap.exists()) {
    return userSnap.data().films;
  }
  return null;
}
