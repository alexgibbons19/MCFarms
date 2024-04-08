
import { initializeApp } from "firebase/app";
import {
    getDocs,
    collection,
    getFirestore
} from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBdBh6oBgnUZJ6dROPNOp5Wwxyvrr8epLQ",
    authDomain: "mcgardens-bd0b1.firebaseapp.com",
    databaseURL: "https://mcgardens-bd0b1-default-rtdb.firebaseio.com",
    projectId: "mcgardens-bd0b1",
    storageBucket: "mcgardens-bd0b1.appspot.com",
    messagingSenderId: "102086093090",
    appId: "1:102086093090:web:f8c4183ccf4594d6eedd7b",
    measurementId: "G-G642QLL9KX"
  };

// Initialize Firebase
initializeApp(firebaseConfig);
const db = getFirestore();

// Function to fetch users
export const fetchUsers = async () => {
    const colRef = collection(db, 'users');
    const snapshot = await getDocs(colRef);
    const users = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    return users;
};

// Initialize Firebase Authentication
const auth = getAuth();

// Function to sign in a user
export const signIn = async (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
};
