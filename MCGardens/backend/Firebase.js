import { initializeApp } from "firebase/app";
import {
    onSnapshot,
    getDocs,
    collection,
    getFirestore,
    addDoc
} from "firebase/firestore";
import { 
    getAuth, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    sendEmailVerification 
} from "firebase/auth";

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

// Function to sign in a user and check email verification
export const signIn = async (email, password) => {
    const auth = getAuth();
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    if (!userCredential.user.emailVerified) {
        throw new Error("Please verify your email before signing in.");
    }
    return userCredential;
};

export const createUser = async (email, password) => {
    const auth = getAuth();
    return createUserWithEmailAndPassword(auth, email, password);
  };

export const resetPassword = async (email) => {
    try {
        await sendPasswordResetEmail(auth, email);
        console.log("Password reset email sent successfully.");
        return { success: true, message: "Password reset email sent successfully." };
    } catch (error) {
        console.error("Error sending password reset email:", error);
        return { success: false, message: error.message };
    }
};

// Function to create a user and send verification email
export const createUserAndSendVerification = async (email, password) => {
    const auth = getAuth();
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await sendEmailVerification(userCredential.user);
    console.log("Verification email sent.");
    return userCredential;
};

// Function to resend the verification email
export const resendVerificationEmail = async (email) => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user && !user.emailVerified) {
        await sendEmailVerification(user);
        return { success: true, message: "Verification email sent successfully." };
    }
    return { success: false, message: "User not found or already verified." };
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

export const listenForThreadsUpdates = (callback) => {
  const colRef = collection(db, 'threads');
  return onSnapshot(colRef, (snapshot) => {
      const threads = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      callback(threads);
  });
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

export const deleteThread = async(threadId) => {
  const threadRef = doc(db, 'threads', threadId);
  try {
      await deleteDoc(threadRef);
      console.log("Thread deleted successfully:", threadId);
  } catch (error) {
      console.error("Error deleting thread:", error);
      throw error;
  }
};

export const listenForRepliesUpdates = (callback) => {
  const colRef = collection(db, 'replies');
  return onSnapshot(colRef, (snapshot) => {
      const replies = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      callback(replies);
  });
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

export const deleteReply = async(replyId) => {
  const replyRef = doc(db, 'replies', replyId);
  try {
      await deleteDoc(replyRef);
      console.log("Reply deleted successfully:", replyId);
  } catch (error) {
      console.error("Error deleting reply:", error);
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


