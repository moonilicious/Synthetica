import os
from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS
import google.generativeai as genai
from PIL import Image
import io

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Set your API key here or use an environment variable
os.environ['API_KEY'] = 'AIzaSyDasBoWwOIXNSuztG_8E4YktWX17xA-KQc'  # Your API key
genai.configure(api_key=os.environ['API_KEY'])

@app.route('/convert', methods=['POST'])
def convert_handwritten_notes():
    # Check if an image file was uploaded
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    try:
        # Open the image using PIL
        image = Image.open(file.stream)

        # Optionally, convert the image to a format suitable for the API (e.g., PNG)
        img_byte_arr = io.BytesIO()
        image.save(img_byte_arr, format='PNG')
        img_byte_arr.seek(0)

        # Call the Gemini API to process the image
        response = genai.generate_content([{"image": img_byte_arr}, {"prompt": "Convert this handwritten note to text."}])

        # Extract and return the text from the response
        converted_text = response.text
        return jsonify({'text': converted_text})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
