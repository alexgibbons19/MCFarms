import { initializeApp } from "firebase/app";
import {
    onSnapshot,
    arrayUnion,
    getDoc,
    doc,
    updateDoc,
    deleteDoc,
    getDocs,
    collection,
    getFirestore,
    addDoc,
    query,
    where,
    Timestamp,
    setDoc
} from "firebase/firestore";
import { 
    getAuth, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    sendEmailVerification 
} from "firebase/auth";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
initializeApp(firebaseConfig);
const db = getFirestore();

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


/*     DISC BOARD FUNCTION   */

  // Function to fetch threads
export const fetchThreads = async () => {
    const colRef = collection(db, 'threads');
    try {
      const snapshot = await getDocs(colRef);
      const threads = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));

      threads.sort((a, b) => new Date(b.created_on) - new Date(a.created_on));
      if(threads.replies){
        threads.replies.sort((a,b) => new Date(a.created_on) - new Date(b.created_on));
      }
      console.log("Threads from firebase: ", threads);
      return threads;
    } catch (error) {
      console.error("Error fetching threads:", error);
      throw error;
    }
    
};

export const listenForUpdates = (callback) => {
  const threadsColRef = collection(db, 'threads');

  const unsubscribe = onSnapshot(threadsColRef, async (threadsSnapshot) => {
    const threads = threadsSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));

    threads.sort((a,b) => new Date(b.created_on) - new Date(a.created_on));
    if(threads.replies){
      threads.replies.sort((a,b) => new Date(a.created_on) - new Date(b.created_on));
    }

    callback({ threads: threads });
  });


  return () => {
    unsubscribe();
  };
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
  try {

      // Update the corresponding thread document to include the new reply
      const threadRef = doc(db, 'threads', replyData.threadId);
      await updateDoc(threadRef, {
          replies: arrayUnion(replyData)
      });

      console.log("Thread updated with new reply.");
  } catch (error) {
      console.error("Error adding reply:", error);
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

/*    END DISC BOARD FUNCTION   */


/* Calendar functions */
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
        comments: comments,
        docID: doc.id
      };
    });
    console.log("from back: ",events);
    return events;

  } catch (error) {
    console.error("Error fetching events",error);
    throw error;
  }
};

export const addCommentToEvent = async (docID, comment) => {
  try {
    const eventRef = doc(db, 'calendar', docID);

    await updateDoc(eventRef, {
      comments: arrayUnion(comment) // Use arrayUnion to safely add the new comment to the existing array (or create a new array if `comments` is `null`)
    });

    console.log('Comment added successfully!');
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error; // Rethrow the error for handling in the caller function
  }
};

export const deleteEvent = async (docID) => {
  try {
    const eventRef = doc(db,'calendar',docID);
    await deleteDoc(eventRef);
    console.log("Event deleted successfully:", docID);
} catch (error) {
    console.error("Error deleting event:", error);
    throw error;
}
};

export const updateEvent = async(docID,eventData) => {
  try {
    const eventRef = doc(db,'calendar',docID);
    const start = new Date(eventData.startDate);
    const end = new Date(eventData.endDate);
    console.log("uE:",start);
    console.log("uE:",end);
    const updatedEvent = {
      user: eventData.user,
      title: eventData.title,
      startDate: Timestamp.fromDate(start),
      endDate: Timestamp.fromDate(end),
      comments: eventData.comments
    }
    await updateDoc(eventRef,updatedEvent);
    console.log('Event updated in firebase');

  } catch (error) {
    console.error("Error updating event in firebase",error);
  }
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

export { auth };




// Account Settings Functions
export const getUserEmailPreference = async (userEmail) => {
  const userRef = doc(db, 'users', userEmail);
  const docSnap = await getDoc(userRef);
  return docSnap.exists() ? docSnap.data().receiveEmails : true; // default to true if not set
};

export const updateEmailPreference = async (userEmail, newPreference) => {
  const userRef = doc(db, 'users', userEmail);

  try {
    await setDoc(userRef, { receiveEmails: newPreference }, { merge: true });
    return newPreference; // Return the updated preference
  } catch (error) {
    console.error("Error updating email preference:", error);
    throw error; // Rethrow the error to be handled or displayed by the calling component
  }
};

export const changePassword = async (newPassword) => {
  const user = auth.currentUser;
  if (user) {
    await user.updatePassword(newPassword);
    return true;
  } else {
    throw new Error("No user logged in.");
  }
};
