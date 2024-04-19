const functions = require('firebase-functions');
const admin = require('firebase-admin');
const axios = require('axios');
const cors = require('cors');
const express = require('express');

const appPlant = express();
appPlant.use(cors());  // Allowing all origins can be a start to test if CORS is the issue
appPlant.options('*', cors());  // This will enable preflight across all routes if specific OPTIONS handling is needed
appPlant.use(express.json());

const appCrops = express();
appCrops.use(cors());  // Allowing all origins can be a start to test if CORS is the issue
appCrops.options('*', cors());  // This will enable preflight across all routes if specific OPTIONS handling is needed
appCrops.use(express.json());


// Initialize Firebase Admin
admin.initializeApp();
const db = admin.firestore();
const OPENAI_API_KEY = functions.config().openai.key;

async function checkPlantInFirebase(plantName) {
    const plantRef = db.doc(`plants/${plantName}`);
    const docSnap = await plantRef.get();
    if (docSnap.exists()) {
        const data = docSnap.data();
        return [data['how to take care'], data['how to plant'], data.bio];
    } else {
        return null;
    }
}

appPlant.post('/askGptFunction', async (req, res) => {
    const plantInput = req.body.plantInput;
    if (!plantInput) {
        return res.status(400).send('The function must be called with one argument "plantInput".');
    }
    try {
        const plantDetails = await checkPlantInFirebase(plantInput) || await askGpt(plantInput);
        res.send(plantDetails);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send(`Error processing request: ${error.message}`);
    }
});

async function askGpt(plantInput) {
    try {
        const chatSession = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: "gpt-3.5-turbo",
            messages: [{
                role: "system",
                content: 'You are an application for people to ' +
                            'tell the users how to plant the crop the most optimal way and ' +
                            'take care of it for the future. The user will ' +
                            'input a crop and you will respond strictly only with the steps to ' +
                            'plant the crop and a short biography of the crop. Then after that you will respond with how to take care of it. ' +
                            'In the directions to take care of the crop, you will give precise details. ' +
                            'For example, you will give the exact amount someone will have to ' +
                            'water the plant for it to have the best life. ' +
                            'The output will be sorted by biography, how to plant, then how to take care of the crop. ' + 
                            'The header of all the outputs will start with -- then the name of the output. ' +
                            'The output will be the header then under that will be the information. The three headers that you ' +
                            'will use are "--bio", "--how to plant" and "--how to take care". You will only use these headers strictly.'
            }, {
                role: "user",
                content: plantInput
            }]
        }, {
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        const reply = chatSession.data.choices[0].message.content;
        return parseReply(reply);
    } catch (error) {
        console.error(`An error occurred: ${error}`);
        throw new functions.https.HttpsError('internal', `An error occurred: ${error}`);
    }
}

function parseReply(reply) {
    const bio = reply.match(/--bio\s*(.*?)(?=(--|$))/s)[1].trim();
    const howToPlant = reply.match(/--how to plant\s*(.*?)(?=(--|$))/s)[1].trim();
    const howToTakeCare = reply.match(/--how to take care\s*(.*?)(?=(--|$))/s)[1].trim();
    return { bio, howToPlant, howToTakeCare };
}


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
        if (docSnap.exists()) {
            return docSnap.data().crops;
        } else {
            const chatSession = await axios.post('https://api.openai.com/v1/chat/completions', {
                model: "gpt-3.5-turbo",
                messages: [{
                    role: "system",
                    content: 'You are an application for people to ' +
                                'tell the users what the best crops for their location are. The user will ' +
                                'input a location and you will respond strictly only with a list of 20 ' +
                                'best garden plants for that location.'
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

exports.askGptFunction = functions.https.onRequest(appPlant);
exports.askOptimalCrops = functions.https.onRequest(appCrops);
