import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyArrO2h4ezOzt_ydwhgxPkyQjpRscNTD-s",
  authDomain: "india-style.firebaseapp.com",
  projectId: "india-style",
  storageBucket: "india-style.firebasestorage.app",
  messagingSenderId: "795212867130",
  appId: "1:795212867130:web:bb68c3f5dbdd5b7870f703"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
