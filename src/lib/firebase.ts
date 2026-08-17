import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "gen-lang-client-0439282256",
  appId: "1:110217308159:web:a587c2f10870517f6269ca",
  apiKey: "AIzaSyDurdgKPj80ZqddR7CqEGoZIZZHsAYNF-w",
  authDomain: "gen-lang-client-0439282256.firebaseapp.com",
  storageBucket: "gen-lang-client-0439282256.firebasestorage.app",
  messagingSenderId: "110217308159",
  measurementId: ""
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
