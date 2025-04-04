import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAn2M-StOa-X950NpGdNXqjJsXR-Q5_Y7k",
  authDomain: "game-web-137d7.firebaseapp.com",
  projectId: "game-web-137d7",
  storageBucket: "game-web-137d7.firebasestorage.app",
  messagingSenderId: "149439902371",
  appId: "1:149439902371:web:c81c52f9535e951cee4516",
  measurementId: "G-Z7MF2C7K9R"
};

const app = initializeApp(firebaseConfig);
const analytics = process.env.NODE_ENV === 'production' ? getAnalytics(app) : null;
const auth = getAuth(app);
const db = getFirestore(app);

if (process.env.NODE_ENV === 'development') {
  connectFirestoreEmulator(db, 'localhost', 8080);
}

export { app, analytics, auth, db };
