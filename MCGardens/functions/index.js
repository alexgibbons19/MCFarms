const functions = require('firebase-functions');
const appPlant = require('./askGpt');
const appCrops = require('./optimalCrops');
const { appEmail, sendEmailsForTodayEvents } = require('./emailReminders');

exports.askGpt = functions.https.onRequest(appPlant);
exports.askOptimalCrops = functions.https.onRequest(appCrops);
exports.emailReminders = functions.https.onRequest(appEmail);
exports.scheduledEmailReminders = functions.pubsub.schedule('0 8 * * *')
    .timeZone('America/New_York')
    .onRun((context) => {
        console.log('Scheduled Email Function is running');
        return sendEmailsForTodayEvents().then(() => {
            console.log('Scheduled Email Function completed successfully');
        }).catch((error) => {
            console.error('Scheduled Email Function failed:', error);
        });
    });
