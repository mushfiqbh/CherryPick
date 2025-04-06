import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCKI3z9NBzUTVFf9tdOtgDK89uzLmxZdFs",
  authDomain: "cherrypick-ts.firebaseapp.com",
  projectId: "cherrypick-ts",
  storageBucket: "cherrypick-ts.firebasestorage.app",
  messagingSenderId: "649996945411",
  appId: "1:649996945411:web:d27db7ee7822fd3acae636",
  measurementId: "G-NJYS3TLNYV",
};

const app = initializeApp(firebaseConfig);

export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
