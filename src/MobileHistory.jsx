import React, { useState, useEffect } from 'react';
import { doc, collection, query, getDocs, getDoc, orderBy, updateDoc, deleteDoc, setDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Container,
  IconButton,
  Tooltip,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from '@mui/material';
import { ContentCopy as ContentCopyIcon, Search as SearchIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { db } from './firebase'; // Import your Firebase configuration here
import Navbar from './Navbar';

const MobileHistory = ({ username }) => {
  const [tokenIds, setTokenIds] = useState([]);
  const [selectedToken, setSelectedToken] = useState(null);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [newTokenId, setNewTokenId] = useState('');

  useEffect(() => {
    const fetchTokenIds = async () => {
      const userDocRef = doc(db, 'users', username);
      const tokensCollectionRef = collection(userDocRef, 'tokens');
      const tokensQuery = query(tokensCollectionRef, orderBy('createdAt', 'desc'));
      const tokensSnapshot = await getDocs(tokensQuery);
      const tokenIdsArray = [];
      tokensSnapshot.forEach((doc) => {
        tokenIdsArray.push(doc.id);
      });
      setTokenIds(tokenIdsArray);
    };

    if (username) {
      fetchTokenIds();
    }
  }, [username]);

  const handleCopyLink = (tokenId) => {
    const link = `https://synthetica.in/token/${username}/${tokenId}`;

    // Attempt to copy to clipboard using navigator.clipboard
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
      // Fallback for browsers that do not support navigator.clipboard
      fallbackCopyTextToClipboard(link);
    }
  };

  const handleDeleteToken = async (tokenId) => {
    const userDocRef = doc(db, 'users', username);
    const tokenDocRef = doc(userDocRef, 'tokens', tokenId);
    try {
      await deleteDoc(tokenDocRef);
      setTokenIds((prevIds) => prevIds.filter(id => id !== tokenId));
      alert('Token deleted successfully.');
    } catch (error) {
      console.error('Error deleting token:', error);
      alert('Error deleting token.');
    }
  };

  // Fallback function for browsers that do not support navigator.clipboard
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

  const handleRenameClick = (tokenId) => {
    setSelectedToken(tokenId);
    setRenameDialogOpen(true);
  };

  const handleRenameDialogClose = () => {
    setRenameDialogOpen(false);
    setNewTokenId('');
  };

  const handleRenameChange = (e) => {
    setNewTokenId(e.target.value);
  };

  const handleRenameSubmit = async () => {
    if (!newTokenId.match(/^[a-zA-Z0-9]+$/)) {
      alert('Token ID can only contain alphanumeric characters.');
      return;
    }

    const userDocRef = doc(db, 'users', username);
    const oldTokenDocRef = doc(userDocRef, 'tokens', selectedToken);
    const newTokenDocRef = doc(userDocRef, 'tokens', newTokenId);

    try {
      const tokenDocSnapshot = await getDoc(oldTokenDocRef);
      if (tokenDocSnapshot.exists()) {
        const tokenData = tokenDocSnapshot.data();
        await setDoc(newTokenDocRef, tokenData);
        await deleteDoc(oldTokenDocRef);
        setTokenIds((prevTokenIds) =>
          prevTokenIds.map((tokenId) => (tokenId === selectedToken ? newTokenId : tokenId))
        );
        setSelectedToken(newTokenId);
        handleRenameDialogClose();
      }
    } catch (error) {
      console.error('Error renaming token:', error);
    }
  };

  return (
    <div>
    <Navbar />
    <Container
      sx={{
        background: 'linear-gradient(-260deg, rgba(144,74,216,1) 23%, rgba(65,148,213,1) 92%)',
        color: '#ffffff',
        p: 3,
        borderRadius: '10px',
        boxShadow: 3
      }}
    >
      <Typography variant="h4" gutterBottom>
        History
      </Typography>
      <TableContainer
        component={Paper}
        sx={{
          backgroundColor: 'transparent',
          borderRadius: '10px',
          overflow: 'hidden',
          boxShadow: 3
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: '#ffffff', borderBottom: '1px solid #ffffff' }}>Token ID</TableCell>
              <TableCell sx={{ color: '#ffffff', borderBottom: '1px solid #ffffff' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tokenIds.map((tokenId) => (
              <TableRow
                key={tokenId}
                component={motion.tr}
                whileHover={{ scale: 1.05, backgroundColor: 'transparent' }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                sx={{
                  cursor: 'pointer',
                  '&:nth-of-type(odd)': { backgroundColor: 'transparent' },
                  '&:nth-of-type(even)': { backgroundColor: 'transparent' },
                  '&:hover': { boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)' },
                }}
              >
                <TableCell
                  component="th"
                  scope="row"
                  sx={{
                    color: '#ffffff',
                    borderBottom: '1px solid #ffffff',
                    padding: '16px',
                    textAlign: 'center',
                  }}
                >
                  {tokenId}
                </TableCell>
                <TableCell
                  sx={{
                    borderBottom: '1px solid #ffffff',
                    padding: '16px',
                    textAlign: 'center',
                  }}
                >
                  <Tooltip title="Copy Link">
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopyLink(tokenId);
                      }}
                      sx={{ color: '#ffffff' }}
                    >
                      <ContentCopyIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="View Details">
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        window.location.href = `https://synthetica.in/token/${username}/${tokenId}`;
                      }}
                      sx={{ color: '#ffffff' }}
                    >
                      <SearchIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Rename Token">
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRenameClick(tokenId);
                      }}
                      sx={{ color: '#ffffff' }}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete Token">
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteToken(tokenId);
                      }}
                      sx={{ color: '#ffffff' }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={renameDialogOpen} onClose={handleRenameDialogClose}>
        <DialogTitle>Rename Token</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="New Token ID"
            type="text"
            fullWidth
            value={newTokenId}
            onChange={handleRenameChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRenameDialogClose}>Cancel</Button>
          <Button onClick={handleRenameSubmit}>Rename</Button>
        </DialogActions>
      </Dialog>
    </Container>
    </div>
  );
};

export default MobileHistory;
