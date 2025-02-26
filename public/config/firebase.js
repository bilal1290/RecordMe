// Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, set, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyAat9ej8Xz9i4jrEF4p9ttnBmqLyhLNKWQ",
    authDomain: "flysecurity-790c8.firebaseapp.com",
    databaseURL: "https://flysecurity-790c8-default-rtdb.firebaseio.com",
    projectId: "flysecurity-790c8",
    storageBucket: "flysecurity-790c8.appspot.com",
    messagingSenderId: "864348312200",
    appId: "1:864348312200:web:82c514a6edddea84cd853d",
    measurementId: "G-S2FY7EVTEW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const employeesRef = ref(database, "employees");

// Export Firebase functions
export { database, employeesRef, ref, set, push, onValue, remove };
