import axios from 'axios';
import dotenv from 'dotenv';
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

dotenv.config();

// Assuming Firebase is configured elsewhere and imported here, or configure it in this file
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
initializeApp(firebaseConfig);
const db = getFirestore();

const OPENAI_API_KEY = process.env.REACT_APP_GPT_TOKEN;

async function askOptimalCrops(locationInput) {
    locationInput = locationInput.toLowerCase();
    const locationRef = doc(db, 'optimalCrops', locationInput);

    try {
        const docSnap = await getDoc(locationRef);
        if (docSnap.exists()) {
            return docSnap.data().crops; // Assuming 'crops' is the stored field
        } else {
            const chatSession = await axios.post(
                'https://api.openai.com/v1/chat/completions',
                {
                    model: "gpt-3.5-turbo",
                    messages: [
                        {
                            role: "system",
                            content: 'You are an application for people to ' +
                                'tell the users what the best crops for their location is. The user will ' +
                                'input a location and you will respond strictly only with a list of 20 ' +
                                'best garden plants for the location that you receive. You will not respond ' +
                                'with anything other than just the top 20 plants.'
                        },
                        {
                            role: "user",
                            content: locationInput
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

            const crops = chatSession.data.choices[0].message.content;
            await setDoc(locationRef, { crops }); // Store the response in Firebase
            return crops;
        }
    } catch (error) {
        console.error(`An error occurred: ${error}`);
        return `An error occurred: ${error}`;
    }
}

export { askOptimalCrops };
