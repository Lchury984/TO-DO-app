import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyAteYF0yXFszxDA0CHslatBi1_Uz_guxJg",
  authDomain: "proyecto-37588.firebaseapp.com",
  projectId: "proyecto-37588",
  storageBucket: "proyecto-37588.firebasestorage.app",
  messagingSenderId: "1023629729267",
  appId: "1:1023629729267:web:c4eeaa788ac4c3ded60686",
  measurementId: "G-9L36BXNVLZ"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
