import React from 'react';
import { db } from './firebase'; // Ensure correct Firebase import
import { doc, collection, setDoc, getDocs, query, where } from 'firebase/firestore';
import Button from '@mui/material/Button';

const GenerateId = ({ username, recentText, accuracyScore }) => {
  // Function to generate a random six-digit token ID with letters and numbers
  const generateTokenId = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let tokenId = '';
    for (let i = 0; i < 6; i++) {
      tokenId += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return tokenId;
  };

  const handleGenerateId = async () => {
    let uniqueTokenId = '';
    let tokenExists = true;

    // Keep generating token IDs until a unique one is found
    while (tokenExists) {
      uniqueTokenId = generateTokenId();
      const userDocRef = doc(db, 'users', username);
      const tokensCollectionRef = collection(userDocRef, 'tokens');
      const tokenQuery = query(tokensCollectionRef, where('tokenId', '==', uniqueTokenId));
      const querySnapshot = await getDocs(tokenQuery);
      tokenExists = !querySnapshot.empty;
    }

    try {
      // Reference to the Firestore document: users/{username}/tokens/{tokenId}
      const userDocRef = doc(db, 'users', username);
      const tokensCollectionRef = collection(userDocRef, 'tokens');
      const tokenDocRef = doc(tokensCollectionRef, uniqueTokenId);

      // Set the document with the text, accuracy score, and createdAt timestamp
      await setDoc(tokenDocRef, {
        tokenId: uniqueTokenId,
        text: recentText,
        accuracy: accuracyScore,
        createdAt: new Date() // Add createdAt field to ensure ordering
      });

      console.log("Document written with ID: ", uniqueTokenId);
      const link = `https://synthetica.in/token/${username}/${uniqueTokenId}`;

      // Copy the generated link to the clipboard
      if (navigator.clipboard) {
        navigator.clipboard.writeText(link)
          .then(() => {
            alert('Link copied to clipboard!');
          })
          .catch((err) => {
            console.error('Error copying link: ', err);
            fallbackCopyTextToClipboard(link);
          });
      } else {
        fallbackCopyTextToClipboard(link);
      }
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const fallbackCopyTextToClipboard = (text) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';  // Avoid scrolling to bottom
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      const successful = document.execCommand('copy');
      const message = successful ? 'Link copied to clipboard!' : 'Unable to copy link.';
      alert(message);
    } catch (err) {
      console.error('Fallback: Oops, unable to copy', err);
    }

    document.body.removeChild(textArea);
  };

  return (
    <Button
      variant="contained"
      color="primary"
      sx={{
        background: 'linear-gradient(90deg, rgba(144,74,216,1) 23%, rgba(65,148,213,1) 92%)',
        '&:hover': {
          background: 'linear-gradient(90deg, rgba(144,74,216,1) 23%, rgba(65,148,213,1) 92%)',
        },
      }}
      onClick={handleGenerateId}
    >
      Generate ID
    </Button>
  );
};

export default GenerateId;
