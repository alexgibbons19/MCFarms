const functions = require('firebase-functions');
const admin = require('firebase-admin');
const axios = require('axios');
const cors = require('cors')();
const express = require('express');

const app = express();

app.use(cors);

admin.initializeApp();

const db = admin.firestore();

const OPENAI_API_KEY = functions.config().openai.key;

async function checkPlantInFirebase(plantName) {
    const plantRef = db.doc(`plants/${plantName}`);
    const docSnap = await plantRef.get();

    if (docSnap.exists) {
        const data = docSnap.data();
        return [data['how to take care'], data['how to plant'], data.bio];
    } else {
        return null;
    }
}

async function askGpt(plantInput) {
    plantInput = plantInput.toLowerCase();

    const firebaseData = await checkPlantInFirebase(plantInput);
    if (firebaseData) {
        return firebaseData;
    }

    try {
        const chatSession = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: "gpt-3.5-turbo",
                messages: [
                    {
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
                            'The output will be the header then under that will be the information. An example header is: --bio'
                    },
                    {
                        role: "user",
                        content: plantInput
                    }
                ]
            },
            {
                headers: {
                    'Authorization': `Bearer ${OPENAI_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        const reply = chatSession.data.choices[0].message.content;
        const { bio, howToPlant, howToTakeCare } = parseReply(reply);

        await db.doc(`plants/${plantInput}`).set({
            bio, 'how to plant': howToPlant, 'how to take care': howToTakeCare
        });

        return [howToTakeCare, howToPlant, bio];
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

exports.askGptFunction = functions.https.onCall(async (data, context) => {
    const plantInput = data.plantInput;
    if (!plantInput) {
        throw new functions.https.HttpsError('invalid-argument', 'The function must be called with one argument "plantInput".');
    }
    return askGpt(plantInput);
});
