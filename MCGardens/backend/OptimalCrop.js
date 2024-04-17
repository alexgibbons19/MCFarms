const fs = require('fs');
const axios = require('axios');
require('dotenv').config();

const OPENAI_API_KEY = process.env.REACT_APP_GPT_TOKEN;

async function askOptimalCrops(locationInput) {
    locationInput = locationInput.toLowerCase();
    const filename = `./backend/database/locations/${locationInput}.txt`;

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

            const reply = chatSession.data.choices[0].message.content;
            fs.writeFileSync(filename, reply);
            return reply;
        }
    } catch (error) {
        console.error(`An error occurred: ${error}`);
        return `An error occurred: ${error}`;
    }
}

module.exports.askOptimalCrops = askOptimalCrops;

// Example usage
// (async () => {
//     const userInput = "new york";
//     const reply = await askOptimalCrops(userInput);
//     console.log(reply);
// })();
