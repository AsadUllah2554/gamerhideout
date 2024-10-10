// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage} from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyClpqKnuU3LDrKwwQF0tIGK2r9Gibc4riw",
  authDomain: "uolsocialmedia-bbe7f.firebaseapp.com",
  projectId: "uolsocialmedia-bbe7f",
  storageBucket: "uolsocialmedia-bbe7f.appspot.com",
  messagingSenderId: "947455180687",
  appId: "1:947455180687:web:a23451ee605176902fd5fa"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage();
