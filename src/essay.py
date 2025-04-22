from flask import Flask, request, jsonify
from flask_cors import CORS
import spacy
import joblib
import numpy as np

app = Flask(__name__)
CORS(app)

# Load the model and vectorizer
model_path = './models/text_classification_model.joblib'
vectorizer_path = './models/tfidf_vectorizer_combined.joblib'
loaded_model = joblib.load(model_path)
loaded_vectorizer = joblib.load(vectorizer_path)

# Load SpaCy model for sentence segmentation
nlp = spacy.load("en_core_web_sm")

def classify_sentence(sentence):
    # Vectorize the sentence using the loaded vectorizer
    X_sentence = loaded_vectorizer.transform([sentence])
    # Get the raw decision function scores
    decision_values = loaded_model.decision_function(X_sentence)
    # The absolute value of the decision function score can be interpreted as confidence
    confidence = np.abs(decision_values[0])
    # Predict using the trained model
    prediction = loaded_model.predict(X_sentence)[0]
    # Interpret the prediction
    result = "AI-generated text" if prediction == 1 else "Human-generated text"
    return {'sentence': sentence, 'result': result, 'confidence': confidence}

@app.route('/essay', methods=['POST'])
def essay():
    if request.method == 'POST':
        essay_input = request.json['essay']
        # Process the essay using SpaCy
        doc = nlp(essay_input)
        # Classify each sentence
        sentences = [sent.text.strip() for sent in doc.sents]
        results = [classify_sentence(sentence) for sentence in sentences]
        
        # Calculate statistics for the pie chart
        ai_count = sum(1 for result in results if result['result'] == 'AI-generated text')
        human_count = sum(1 for result in results if result['result'] == 'Human-generated text')
        total_sentences = len(results)
        
        stats = {
            'ai': (ai_count / total_sentences) * 100 if total_sentences else 0,
            'human': (human_count / total_sentences) * 100 if total_sentences else 0
        }
        
        # Determine the overall verdict
        verdict = "Primarily AI-generated" if ai_count > human_count else "Primarily Human-generated"
        
        # Include the stats and verdict in the response
        response_data = {
            'sentences': results,
            'stats': stats,
            'verdict': verdict
        }
        
        return jsonify(response_data)

if __name__ == '__main__':
    app.run(debug=True)
