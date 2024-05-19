import { initializeApp } from "firebase/app";
import { getStorage } from 'firebase/storage'
import { getDatabase } from 'firebase/database'
import { getAuth } from 'firebase/auth'


const firebaseConfig = {

  apiKey: "AIzaSyC_Uo6CuuEcr1jJgmANmf_2yISW_z9Murg",
  authDomain: "waggly-website.firebaseapp.com",
  databaseURL: "https://waggly-website-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "waggly-website",
  storageBucket: "waggly-website.appspot.com",
  messagingSenderId: "736341666472",
  appId: "1:736341666472:web:bcd64ae70579d73331709d"

};


// Initialize Firebase

const app = initializeApp(firebaseConfig);
const database = getDatabase(app)
const auth = getAuth(app);
const storage = getStorage(app)


export { auth, database, storage}

