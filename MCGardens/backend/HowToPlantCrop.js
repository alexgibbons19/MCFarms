const fs = require('fs');
const axios = require('axios');
require('dotenv').config();

const OPENAI_API_KEY = process.env.REACT_APP_GPT_TOKEN;

async function askGpt(plantInput) {
    plantInput = plantInput.toLowerCase();
    const filename = `./backend/database/crops/${plantInput}.txt`;

    try {
        if (fs.existsSync(filename)) {
            const content = fs.readFileSync(filename, 'utf8');
            return content;
        } else {
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
            fs.writeFileSync(filename, reply);
            return reply;
        }
    } catch (error) {
        console.error(`An error occurred: ${error}`);
        return `An error occurred: ${error}`;
    }
}

module.exports.askGpt = askGpt;

// Example usage
// (async () => {
//     const userInput = "cucumber";
//     const reply = await askGpt(userInput);
//     console.log(reply);
// })();
