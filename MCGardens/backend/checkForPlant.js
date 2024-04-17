import * as v2 from 'firebase-functions/v2';
import OpenAI from "openai";
import fs from 'fs';

// api config
require('dotenv').config();

const apiKey = process.env.CHAT_KEY;
const openai = new OpenAI({
    apiKey: apiKey,
});

export const checkForPlant = v2.https.onRequest(async (request, response) => {
    const plantName = request.params[0].toLowerCase();
    const fileName = "./backend/crops/${plantName}.txt";

    // check if file exists in firebase
    try{
        const fileExists = await checkFileExists(fileName);

        if (fileExists){
            const content = fs.readFileSync(fileName,'utf8');
            response.send(content);// returns file content
        } else {
            // if file doesnt exist, call gbt function
            const generatedResp = await ask_GPT(plantName);// gives file content and saves to firebase
            response.send(generatedResp);// returns file content
        }
    } catch (error){
        console.error("Error:",error);
        response.status(500).send('Error processing request');// request error
    }
});
// verify this
// function to check if a file exists
function checkFileExists(fileName) {
    return new Promise((resolve, reject) => {
        fs.access(fileName, fs.constants.F_OK, (error) => {
            if (!error) {
                resolve(true);
            } else {
                resolve(false);
            }
        });
    });
}

// Faddi's ask GPT
async function ask_GPT(plantName) {
    try {
        const getResponse = async () =>{
            const response = await openai.chat.completitions.create({
                messages : [
                    {"role": "system", "content": 'You are an application for people to '+
                            'tell the users how to plant the crop the most optimal way and '+
                            'take care of it for the future. The user will ' +
                            'input a crop and you will respond strictly only with the steps to '+
                            'plant the crop and a short biography of the crop. Then after that you will respond with how to take care of it. '+
                            'In the directions to take care of the crop, you will give precise details. '+
                            'For example, you will give the exact amount someone will have to '+
                            'water the plant for it to have the best life. '+
                            'The output will be sorted by biography, how to plant, then how to take care of the crop.'},
                    {"role": "user", "content": plantName},
                ],
                model: "gpt-3.5-turbo",
            });

            reply = response.choices[0].message["content"]; // save response
            console.log(reply)
            let filePath = "./backend/crops/${plantName}.txt";
                fs.writeFile(filePath,reply,(err)=>{
                    if (err) throw err;
            })
            return reply.trim();// give response to parent function
        }
    } catch (error) {
        console.error('Error calling GPT:', error);
        throw error;
    }
}