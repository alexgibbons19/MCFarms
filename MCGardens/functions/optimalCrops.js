const functions = require('firebase-functions');
const admin = require('firebase-admin');
const axios = require('axios');
const cors = require('cors');
const express = require('express');

const appCrops = express();

// Check if admin apps are already initialized
if (admin.apps.length === 0) {
    admin.initializeApp();
}

const db = admin.firestore();
const OPENAI_API_KEY = functions.config().openai.key;

appCrops.use(cors({ origin: true }));

appCrops.post('/askOptimalCrops', async (req, res) => {
    const locationInput = req.body.location;
    if (!locationInput) {
        return res.status(400).send('The function must be called with one argument "location".');
    }
    try {
        const crops = await askOptimalCrops(locationInput);
        res.json({ crops });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send(`Error processing request: ${error.message}`);
    }
});

async function askOptimalCrops(locationInput) {
    const locationRef = db.doc(`optimalCrops/${locationInput}`);
    try {
        const docSnap = await locationRef.get();
        if (docSnap.exists) {
            return docSnap.data().crops;
        } else {
            const chatSession = await axios.post('https://api.openai.com/v1/chat/completions', {
                model: "gpt-3.5-turbo",
                messages: [{
                    role: "system",
                    content: 'You are an application for people to ' +
                                'tell the users what the best crops for their location is. The user will ' +
                                'input a location and you will respond strictly only with a list of 20 ' +
                                'best garden plants for the location that you receive. You will not respond ' +
                                'with anything other than just the top 20 plants.'
                }, {
                    role: "user",
                    content: locationInput
                }]
            }, {
                headers: {
                    'Authorization': `Bearer ${OPENAI_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            });
            const crops = chatSession.data.choices[0].message.content;
            await locationRef.set({ crops });
            return crops;
        }
    } catch (error) {
        console.error(`An error occurred: ${error}`);
        throw new functions.https.HttpsError('internal', `An error occurred: ${error}`);
    }
}

module.exports = appCrops;
