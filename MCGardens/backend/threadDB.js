import {
    getDocs,
    collection,
    getFirestore,
    addDoc
} from "firebase/firestore";
import { initializeApp } from "firebase/app";

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

const db = getFirestore();

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
    console.error("Erorr fethcing replies:",error);
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

