import { initializeApp } from "firebase/app";

export const environment = {
    production: false,
    firebase: {
      apiKey: 'AIzaSyDpU-bwy2G7T7TekZCp5or6VYUkC34VbdI',
      authDomain: 'trainingproject-b19b5.firebaseapp.com',
      projectId: 'trainingproject-b19b5',
      storageBucket: 'trainingproject-b19b5.appspot.com',
      messagingSenderId: '404868348449',
      appId: '1:404868348449:web:4c10d1999f1aea9b7075a0'
    }
  };
  const app = initializeApp(environment.firebase);