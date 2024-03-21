import openai
import os
from dotenv import load_dotenv

load_dotenv()

openai.api_key = os.getenv('GPT_TOKEN')

def ask_gpt(prompt):
    prompt = prompt.lower()
    filename = f"./backend/database/locations/{prompt}.txt"  # File name based on user input
    if os.path.exists(filename):
        with open(filename, 'r') as file:
            content = file.read()
        return filename, content  # Ensure to return both values
    else:
        try:
            # Initialize the chat session
            chat_session = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": 'You are an application for people to '
                            'tell the users what the best crops for their location is. The user will '
                            'input a location and you will respond strictly only with a list of 20 '
                            'best garden plants for the location that you receive. You will not respond '
                            'with anything other than just the top 20 plants.'},
                    {"role": "user", "content": prompt}
                ]
            )
            # Extract the response
            reply = chat_session.choices[0].message["content"]
            
            with open(filename, 'w') as file:
                file.write(reply)
            return filename, reply  # Return both filename and content
        except Exception as e:
            print(f"An error occurred: {e}")

# Example usage
user_input = "carmel ny"
fileName, reply = ask_gpt(prompt=user_input)
print(fileName, reply)