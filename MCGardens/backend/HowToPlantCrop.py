import openai
import os
from dotenv import load_dotenv

load_dotenv()

# Set your OpenAI API key here
openai.api_key = os.getenv('GPT_TOKEN')

def chat_with_gpt(prompt):
    try:
        # Initialize the chat session
        chat_session = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": 'You are an application for people to '
                        'tell the users how to plant the crop the most optimal way and '
                        'take care of it for the future. The user will ' 
                        'input a crop and you will respond strictly only with the steps to '
                        'plant the crop. Then after that you will respond with how to take care of it. '
                        'In the directions to take care of the crop, you will give precise details. '
                        'For example, you will give the exact amout the someone will have to '
                        'water the plant for it to have the best life.'},
                {"role": "user", "content": prompt}
            ]
        )
        # Extract and print the response
        reply = chat_session.choices[0].message["content"]
        print(f"{reply}")
    except Exception as e:
        print(f"An error occurred: {e}")

# Example usage
user_input = input("User: ")
chat_with_gpt(prompt=user_input)
