import React, { useState } from 'react';
import axios from 'axios';
import './Gemini.css'; // Optional: Create a CSS file for styles

const Gemini = () => {
    const [file, setFile] = useState(null);
    const [convertedText, setConvertedText] = useState('');
    const [error, setError] = useState('');

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
        setConvertedText('');  // Reset converted text on new file selection
        setError('');          // Reset error message on new file selection
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!file) {
            setError('Please upload an image file.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('http://127.0.0.1:5000/convert', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setConvertedText(response.data.text);
            setError('');
        } catch (err) {
            setError(err.response ? err.response.data.error : 'An error occurred while converting the image.');
        }
    };

    return (
        <div className="gemini-container">
            <h1>Gemini Handwriting Converter</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    required
                    style={{ display: 'none' }} // Hide the default file input
                    id="file-upload" // Add an id for the label to reference
                />
                <label htmlFor="file-upload" className="upload-button">
                    Upload Image
                </label>
                <button type="submit" className="convert-button">Convert</button>
            </form>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            {convertedText && (
                <div>
                    <h2>Converted Text:</h2>
                    <p>{convertedText}</p>
                </div>
            )}
        </div>
    );
};

export default Gemini;
