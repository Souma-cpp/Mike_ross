// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GithubAuthProvider, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey:import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "cortex-25152.firebaseapp.com",
  projectId: "cortex-25152",
  storageBucket: "cortex-25152.firebasestorage.app",
  messagingSenderId: "486830014111",
  appId: "1:486830014111:web:4014e1a17946ed404a6caa"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth=getAuth(app)
export const googleProvider =new GoogleAuthProvider();

export const githubProvider =new GithubAuthProvider();
