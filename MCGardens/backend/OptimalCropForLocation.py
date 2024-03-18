import openai
import os
from dotenv import load_dotenv

load_dotenv()

openai.api_key = os.getenv('GPT_TOKEN')

def chat_with_gpt(prompt):
    prompt = prompt.lower()
    filename = f"./backend/database/{prompt}.txt"  # File name based on user input
    if os.path.exists(filename):
        # If the file exists, read and print its content instead of making a new request
        with open(filename, 'r') as file:
            print(file.read())
    else:
        try:
            # Initialize the chat session
            chat_session = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": 'You are an application for people to '
                            'tell the users what the best crops for their location is. The user will '
                            'input a location and you will respond strictly only with a list of 10 '
                            'best garden plants for the location that you receive. You will not respond '
                            'with anything other than just the top 10 plants.'},
                    {"role": "user", "content": prompt}
                ]
            )
            # Extract the response
            reply = chat_session.choices[0].message["content"]
            
            # Save the response to a file
            with open(filename, 'w') as file:
                file.write(reply)
            
            print(reply)
        except Exception as e:
            print(f"An error occurred: {e}")

# Example usage
user_input = input("User: ")
chat_with_gpt(prompt=user_input)
