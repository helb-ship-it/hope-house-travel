import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA8qmX9snL69hb_Vv59uFk5Oak9Vmv4hmA",
  authDomain: "hope-house-travel.firebaseapp.com",
  projectId: "hope-house-travel",
  storageBucket: "hope-house-travel.firebasestorage.app",
  messagingSenderId: "831184251484",
  appId: "1:831184251484:web:59e26d5f0f32690144d499"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);