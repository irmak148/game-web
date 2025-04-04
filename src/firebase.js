import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";

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
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);
