const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const cors = require('cors');
const express = require('express');

const appEmail = express();

// Initialize Firebase Admin SDK
if (admin.apps.length === 0) {
    admin.initializeApp();
}

const db = admin.firestore();
const auth = admin.auth();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: functions.config().email.user,
        pass: functions.config().email.pass,
    },
});

appEmail.use(cors({ origin: true }));

appEmail.post('/sendDailyEmails', async (req, res) => {
    try {
        await sendEmailsForTodayEvents();
        res.status(200).send('Daily emails sent successfully.');
    } catch (error) {
        console.error('Error sending daily emails:', error);
        res.status(500).send(`Error processing request: ${error.message}`);
    }
});

async function sendEmailsForTodayEvents() {
    // List all users, but filter those who are verified and have opted-in for emails
    const listUsersResult = await auth.listUsers();
    const verifiedUsers = listUsersResult.users.filter(user => user.emailVerified);

    const emailsToSend = [];
    for (const user of verifiedUsers) {
        const userRef = db.collection('users').doc(user.email);
        const doc = await userRef.get();
        if (doc.exists && doc.data().receiveEmails) {
            emailsToSend.push(user.email);
        }
    }

    // Fetch events and send emails to the filtered users
    for (const email of emailsToSend) {
        const localPartEmail = email.split('@')[0];
        const events = await fetchEventsForToday(localPartEmail);
        if (events.length > 0) {
            const emailBody = events.map(event => `<li>${event.title} from ${event.startDate} to ${event.endDate}</li>`).join('');
            await transporter.sendMail({
                from: '"MCGardens" <your-email@gmail.com>',
                to: email,
                subject: "Your Events Today",
                html: `<b>Here are your events for today:</b><ul>${emailBody}</ul>`,
            });
        }
    }
}

async function fetchEventsForToday(localPartEmail) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startOfDay = admin.firestore.Timestamp.fromDate(today);
    const endOfDay = admin.firestore.Timestamp.fromDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1));

    const eventsRef = db.collection('calendar');
    const snapshot = await eventsRef.where('user', '==', localPartEmail).get();

    return snapshot.docs
        .map(doc => doc.data())
        .filter(event => event.startDate.toDate() >= startOfDay.toDate() && event.startDate.toDate() < endOfDay.toDate())
        .map(event => ({
            ...event,
            startDate: formatDateTo12Hour(event.startDate.toDate()),
            endDate: formatDateTo12Hour(event.endDate.toDate()),
        }));
}

function formatDateTo12Hour(date) {
    return date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true });
}

module.exports = { appEmail, sendEmailsForTodayEvents };
