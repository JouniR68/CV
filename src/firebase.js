
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth"


const firebaseConfig = {
  apiKey: "AIzaSyDeBnDCtHTEiO9RXwWauj_w9QtjXkfBjz0",
  authDomain: "firma-ed35a.firebaseapp.com",
  projectId: "firma-ed35a",
  storageBucket: "firma-ed35a.appspot.com",
  messagingSenderId: "350355976791",
  appId: "1:350355976791:web:e8262de3a9a02fca44a912",
  measurementId: "G-3NRNRNJMH8"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app)