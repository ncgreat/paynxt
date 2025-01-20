// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'; // Import getAuth function
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDUS6ix0vCmhiFUE57zswX1ysQn0E8YnAE",
  authDomain: "megadeals-d12b0.firebaseapp.com",
  projectId: "megadeals-d12b0",
  storageBucket: "megadeals-d12b0.firebasestorage.app",
  messagingSenderId: "476176345263",
  appId: "1:476176345263:web:4de7b41b45411669828c5a",
  measurementId: "G-VR652QKMFS"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };