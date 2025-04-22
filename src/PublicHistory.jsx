import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from './firebase'; // Ensure correct Firebase import
import { doc, getDoc } from 'firebase/firestore';

import './PublicHistory.css'; // Import the CSS file

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';
import Typography from '@mui/material/Typography';
import Navbar from './Navbar';
import SYNTHETICAImage from './SYNTHETICA.webp'; // Import the image

const PublicHistory = () => {
  const { username, tokenid } = useParams();
  const [searchInput, setSearchInput] = useState('');
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (username && tokenid) {
      fetchTokenData(username, tokenid);
    }
  }, [username, tokenid]);

  const handleSearchInputChange = (event) => {
    setSearchInput(event.target.value);
  };

  const handleSearch = async () => {
    const [username, tokenId] = searchInput.split('/');
    
    if (username && tokenId) {
      fetchTokenData(username, tokenId);
    } else {
      setResult({ error: 'Invalid format. Use "username/token_id".' });
    }
  };

  const fetchTokenData = async (username, tokenId) => {
    try {
      const tokenDocRef = doc(db, 'users', username, 'tokens', tokenId);
      const tokenDoc = await getDoc(tokenDocRef);

      if (tokenDoc.exists()) {
        setResult(tokenDoc.data());
      } else {
        setResult({ error: 'No such document!' });
      }
    } catch (e) {
      console.error("Error fetching document: ", e);
      setResult({ error: 'Error fetching document.' });
    }
  };

  return (
    <div>
      <header>
        <Navbar />
      </header>
      <div className="image-container">
        <img src={SYNTHETICAImage} alt="SYNTHETICA" />
      </div>
      <div className="search-container">
        <TextField
          fullWidth
          className="search-field"
          label="Search (username/token_id)"
          value={searchInput}
          onChange={handleSearchInputChange}
          variant="outlined"
          InputProps={{
            endAdornment: (
              <Button variant="contained" className="search-button" onClick={handleSearch} sx={{backgroundColor:'black', "&:hover": {backgroundColor:'black'}}}>
                <SearchIcon sx={{ backgroundColor: 'black' }} />
              </Button>
            ),
          }}
        />
      </div>
      <div className="container">
        {result && (
          <div className="result-container">
            {result.error ? (
              <Typography variant="h6" className="error-text">
                {result.error}
              </Typography>
            ) : (
              <div className="glassmorphism-effect">
                <Typography variant="h6" className="final-verdict-text">
                  Analysis Result
                </Typography>
                <div className="final-verdict-content">
                <h1 className="accuracy-text">
                  {result.accuracy.toFixed(2)} % AI
                </h1>
                  <Typography variant="body1" className="body-text">
                    {result.text}
                  </Typography>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicHistory;
