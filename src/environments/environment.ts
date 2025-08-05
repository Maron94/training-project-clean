
import { initializeApp } from "firebase/app";

export const environment = {
  production: false,
  firebase: {
  apiKey: "AIzaSyAuBHy5k2hgaxirbRRDQ9QpVweBwYKBH1E",
  authDomain: "tranings-selfservice.firebaseapp.com",
  projectId: "tranings-selfservice",
  storageBucket: "tranings-selfservice.firebasestorage.app",
  messagingSenderId: "898856742290",
  appId: "1:898856742290:web:ab6f6b18fea92afe94254b"
  }
};

// Initialize Firebase
const app = initializeApp(environment.firebase);