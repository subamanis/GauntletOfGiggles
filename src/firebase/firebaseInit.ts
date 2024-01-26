// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCLsxipmZ25yaRj5CZMiD67VHmaKVLegVk",
    authDomain: "gauntlet-of-giggles.firebaseapp.com",
    databaseURL: "https://gauntlet-of-giggles-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "gauntlet-of-giggles",
    storageBucket: "gauntlet-of-giggles.appspot.com",
    messagingSenderId: "340002520558",
    appId: "1:340002520558:web:74127fcba595792343a2ff"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
export const realTimeDatabase = getDatabase(app);


