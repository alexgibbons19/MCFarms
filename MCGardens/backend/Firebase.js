
import { initializeApp } from "firebase/app";
import {
    getDocs,
    collection,
    getFirestore,
    addDoc
} from "firebase/firestore";
import { 
    getAuth, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword } from "firebase/auth";

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

export const createUser = async (email, password) => {
    const auth = getAuth();
    return createUserWithEmailAndPassword(auth, email, password);
  };



  // Function to fetch threads
export const fetchThreads = async () => {
    const colRef = collection(db, 'threads');
    try {
      const snapshot = await getDocs(colRef);
      const threads = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      return threads;
    } catch (error) {
      console.error("Error fetching threads:", error);
      throw error;
    }
    
};

export const fetchReplies = async () => {
	const colRef = collection(db, 'replies');
  try{
    const snapshot = await getDocs(colRef);
    const replies = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    return replies;
  } catch (error) {
    console.error("Error fetching replies:",error);
    throw error;
  }
    
};

export const addThread = async(threadData) => {
  const threadRef = collection(db, 'threads');
  try {
    await addDoc(threadRef, threadData);
    console.log("Thread added successfully:", threadData);
  } catch (error) {
    console.error("Error adding thread:", error);
    throw error;
  }
};

export const addReply = async (replyData) => {
  const replyRef = collection(db, 'replies');
  try {
      await addDoc(replyRef, replyData);
      console.log("Reply added successfully:", replyData);
  } catch (error) {
      console.error("Error adding reply:", error);
      throw error;
  }
};

export const getUser = () => {
  const user = auth.currentUser;
  if (user) {
      const userEmail = user.email;
      const emailWithoutDomain = userEmail.split('@')[0];
      return emailWithoutDomain;
  } else {
      return null;
  }
};


