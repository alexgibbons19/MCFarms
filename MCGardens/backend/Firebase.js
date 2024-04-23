import { initializeApp } from "firebase/app";
import {
    onSnapshot,
    getDoc,
    doc,
    updateDoc,
    getDocs,
    collection,
    getFirestore,
    addDoc,
    query,
    where,
    Timestamp
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

export const fetchEvents = async (username) => {
  const colRef = collection(db,'calendar');
  const q = query(colRef, where('user','==',username));
  try{
    const snapshot = await getDocs(q);
    const events = snapshot.docs.map(doc => {
      const eventData = doc.data();

      const start = eventData.startDate.toDate(); 
      const end = eventData.endDate.toDate(); 

      const formattedStartDate = start.toISOString().slice(0, 16);
      const formattedEndDate = end.toISOString().slice(0, 16);
      
      const comments = eventData.comments || [];
      
      return {
        ...eventData,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        comments
      };
    });
    return events;

  } catch (error) {
    console.error("Error fetching events",error);
    throw error;
  }
};

export const addCommentToEvent = async (docID, comment) => {
  try {
    const eventRef = doc(db, 'calendar', docID);
    const eventSnapshot = await getDoc(eventRef);

    if (!eventSnapshot.exists()) {
      throw new Error(`Event with docID ${docID} does not exist.`);
    }

    const eventData = eventSnapshot.data();

    const currentComments = Array.isArray(eventData.comments) ? eventData.comments : [];
    const updatedComments = [...(eventData.comments || []), comment];

    await updateDoc(eventRef, { comments: updatedComments });

    console.log('Comment added successfully!');

  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};

export const deleteEvent = async (docID) => {
  const eventRef = collection(db,'calendar').doc(docID);
  await eventRef.delete();
};

export const addEvent = async ({username,title, start, end}) => {
  console.log("params passed:",username,title,start,end);
  
  if(!username||!title||!start||!end){
    throw new Error("Missing required parameters");
  }  
  
  const calendarRef = collection(db,'calendar');
  const newEvent = {
      user: username,
      title: title,
      startDate: Timestamp.fromDate(start),
      endDate: Timestamp.fromDate(end),
      comments: []
  }
	try {
      const docRef = await addDoc(calendarRef, newEvent);
      console.log("Event added successfully:", newEvent);
      console.log("Event has docId:", docRef.id);

      return docRef.id;

  } catch (error) {
      console.error("Error adding event:", error);
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


