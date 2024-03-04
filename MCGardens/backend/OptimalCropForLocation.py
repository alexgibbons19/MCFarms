import openai

# Set your OpenAI API key here
openai.api_key = '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'

def chat_with_gpt(prompt="Hello, who are you?"):
    try:
        # Initialize the chat session
        chat_session = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": 'You are an application for people to '
                        'tell the users what the best crops for their location is. The user will' 
                        'input a location and you will respond strictly only with a list of 10 '
                        'best garden plants for the location that you recieve. You will not respond '
                        'with anything other than just the top 10 plants.'},
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
