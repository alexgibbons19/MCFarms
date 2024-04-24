import 'dotenv/config';
import nodemailer from 'nodemailer';
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import admin from 'firebase-admin';
import { createRequire } from 'module';
import cron from 'node-cron';
const require = createRequire(import.meta.url);

// Initialize Firebase
const app = !getApps().length ? initializeApp({
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
}) : getApp();
const db = getFirestore(app);

// Initialize Firebase Admin SDK
const serviceAccount = require('../credentials.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.VITE_FIREBASE_DATABASE_URL,
});

// Email sending function
const sendEmail = async (email, events) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const eventsHtml = events.map(event => `<li>${event.title} from ${event.startDate} to ${event.endDate}</li>`).join('');
  const eventsText = events.map(event => `${event.title} from ${event.startDate} to ${event.endDate}`).join(', ');

  await transporter.sendMail({
    from: '"MCGardens" <mcgardens.reminders@gmail.com>',
    to: email,
    subject: "Your Events Today",
    text: "Here are your events for today: " + eventsText,
    html: "<b>Here are your events for today:</b><ul>" + eventsHtml + "</ul>",
  });

  console.log("Email sent to: %s", email);
};

// Function to format date to a 12-hour string
function formatDateTo12Hour(date) {
  return date.toLocaleString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: true
  });
}

// Updated fetchEventsForToday function
const fetchEventsForToday = async (localPartEmail) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Start of today
  const endOfDay = new Date(today);
  endOfDay.setDate(today.getDate() + 1); // Start of the next day

  // Firestore queries
  const eventsRef = collection(db, 'calendar');
  const q = query(eventsRef, where('user', '==', localPartEmail));
  const snapshot = await getDocs(q);

  return snapshot.docs
    .map(doc => ({ ...doc.data(), id: doc.id }))
    .filter(event => {
      const eventStart = event.startDate.toDate();
      return eventStart >= today && eventStart < endOfDay;
    })
    .map(event => ({
      ...event,
      // Format the start and end dates to 12-hour format
      startDate: formatDateTo12Hour(event.startDate.toDate()),
      endDate: formatDateTo12Hour(event.endDate.toDate())
    }));
};

// Main function to get verified users and send them an email with today's events
const sendDailyEventsToVerifiedUsers = async () => {
  const listUsersResult = await admin.auth().listUsers();
  const verifiedUsers = listUsersResult.users.filter(user => user.emailVerified);

  for (const user of verifiedUsers) {
    const localPartEmail = user.email.split('@')[0];
    const events = await fetchEventsForToday(localPartEmail);

    if (events.length > 0) {
      await sendEmail(user.email, events);
      console.log(`Events sent to ${user.email}`);
    } else {
      console.log(`No events for today for user ${user.email}`);
    }
  }
};

// sendDailyEventsToVerifiedUsers().catch(console.error);



// A function to call your fetchEventsForTodayByEmail and log results
const logEventsForUser = async (localPartEmail) => {
  try {
    const events = await fetchEventsForToday(localPartEmail);
    console.log(`Events for ${localPartEmail}:`, events);
  } catch (error) {
    console.error(`Error fetching events for ${localPartEmail}:`, error);
  }
};

// Now call this function instead of just logging the promise
// logEventsForUser('dottycr02');