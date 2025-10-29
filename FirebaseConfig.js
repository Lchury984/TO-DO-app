// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAteYF0yXFszxDA0CHslatBi1_Uz_guxJg",
  authDomain: "proyecto-37588.firebaseapp.com",
  projectId: "proyecto-37588",
  storageBucket: "proyecto-37588.firebasestorage.app",
  messagingSenderId: "1023629729267",
  appId: "1:1023629729267:web:c4eeaa788ac4c3ded60686",
  measurementId: "G-9L36BXNVLZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db=getFirestore(app);