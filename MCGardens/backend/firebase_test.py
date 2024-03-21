import os
import firebase_admin
from firebase_admin import credentials, firestore

# Authenticate to Firebase
cred = credentials.Certificate("credentials.json")
firebase_admin.initialize_app(cred)

# Get a reference to the Firestore service
db = firestore.client()

# Retrieve all documents from the 'crops' collection
crops_ref = db.collection('crops')
docs = crops_ref.stream()

print("Data in 'crops' collection:")
for doc in docs:
    doc_dict = doc.to_dict()
    print(f"{doc.id} => {doc_dict}")
    
    # Assuming each document has a 'file' field specifying the filename
    filename = doc_dict.get('file')
    if filename:
        file_path = f'./backend/database/crops/{filename}'
        if os.path.exists(file_path):
            # If the file exists, read and print its content
            with open(file_path, 'r') as file:
                print(file.read())
        else:
            print(f"File {filename} does not exist.")
