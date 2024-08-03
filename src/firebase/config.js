import { initializeApp } from 'firebase/app';

 const firebaseConfig = {
  apiKey: "AIzaSyDzhyvhnnRl0FP3x9vCg66lXwYud0cDSJI",
  authDomain: "bottak-15afa.firebaseapp.com",
  databaseURL: "https://bottak-15afa-default-rtdb.firebaseio.com",
  projectId: "bottak-15afa",
  storageBucket: "bottak-15afa.appspot.com",
  messagingSenderId: "408389195712",
  appId: "1:408389195712:web:84a5bf3459b766bb3d9a25",
  measurementId: "G-NJXYTNE72D"
};


const app = initializeApp(firebaseConfig)

export { app }