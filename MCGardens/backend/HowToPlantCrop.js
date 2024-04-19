import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

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
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

const OPENAI_API_KEY = process.env.REACT_APP_GPT_TOKEN;

async function checkPlantInFirebase(plantName) {
    const plantRef = doc(db, 'plants', plantName);
    const docSnap = await getDoc(plantRef);

    if (docSnap.exists()) {
        const data = docSnap.data();
        return [data['how to take care'], data['how to plant'], data.bio];
    } else {
        return null;
    }
}

async function askGpt(plantInput) {
    plantInput = plantInput.toLowerCase();

    // Check in Firebase first
    const firebaseData = await checkPlantInFirebase(plantInput);
    if (firebaseData) {
        return firebaseData;
    }

    // If not found, request from OpenAI
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
                            'The output will be the header then under that will be the information. The three headers that you ' +
                            'will use are "--bio", "--how to plant" and "--how to take care". You will only use these headers strictly.'
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

        const { bio, howToPlant, howToTakeCare } = parseReply(chatSession.data.choices[0].message.content);
        
        // Save new plant data to Firebase
        const plantRef = doc(db, 'plants', plantInput);
        await setDoc(plantRef, {
            bio: bio,
            'how to plant': howToPlant,
            'how to take care': howToTakeCare
        });

        return [howToTakeCare, howToPlant, bio];
    } catch (error) {
        console.error(`An error occurred: ${error}`);
        return `An error occurred: ${error}`;
    }
}

function parseReply(reply) {
    // Extract information based on --bio, --how to plant, --how to take care
    const bio = reply.match(/--bio\s*(.*?)(?=(--|$))/s)[1].trim();
    const howToPlant = reply.match(/--how to plant\s*(.*?)(?=(--|$))/s)[1].trim();
    const howToTakeCare = reply.match(/--how to take care\s*(.*?)(?=(--|$))/s)[1].trim();

    return { bio, howToPlant, howToTakeCare };
}

export { askGpt };
