import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyB_C8Lnbqo72BsL4RxNVVDuZZijqs3JHVA",
  authDomain: "mini-market-9721c.firebaseapp.com",
  projectId: "mini-market-9721c",
  storageBucket: "mini-market-9721c.firebasestorage.app",
  messagingSenderId: "64067443897",
  appId: "1:64067443897:web:586a2bb12281fcb8398f68",
  measurementId: "G-8PGHW9779Y"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
