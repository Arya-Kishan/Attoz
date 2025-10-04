// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBViTkOq8xYc2OFlK7ngEW7Y1QLW-DDoCA",
  authDomain: "attoz-4b613.firebaseapp.com",
  projectId: "attoz-4b613",
  storageBucket: "attoz-4b613.firebasestorage.app",
  messagingSenderId: "653495892097",
  appId: "1:653495892097:web:c870c2f3bc952a6ca6b580",
  measurementId: "G-2EKB5EZSK9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);


// Export Firebase services
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)