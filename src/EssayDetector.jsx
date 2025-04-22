import React, { useState, useRef, useEffect } from 'react';
import './EssayDetector.css';
import MenuIcon from '@mui/icons-material/Menu'; // Add this import
import { motion } from 'framer-motion';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import IconButton from '@mui/material/IconButton';
import History from './History';
import TextField from '@mui/material/TextField';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Navbar from './Navbar';
import Stack from '@mui/material/Stack';
import SendIcon from '@mui/icons-material/Send';
import Avatar from '@mui/material/Avatar';
import Paper from '@mui/material/Paper';
import { Doughnut } from 'react-chartjs-2';
import { InputAdornment } from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import GenerateId from './GenerateId';
import { auth, db } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import ProgressBar from './ProgressBar';
import CircularProgress from '@mui/material/CircularProgress';

const BotAvatar = () => (
  <Avatar alt="Bot" src="/static/images/avatar/bot.jpg" sx={{ width: 64, height: 64 }} />
);

const UserAvatar = () => (
  <Avatar alt="User" src="/static/images/avatar/user.jpg" sx={{ width: 64, height: 64 }} />
);

const EssayMessage = ({ avatar, message }) => {
  return (
    <Stack direction="row" spacing={2} alignItems="top" sx={{ padding: '8px', justifyContent: 'flex-start' }}>
      {avatar}
      <Paper sx={{ padding: '10px', borderRadius: '10px', backgroundColor: '#222222', width: '70%', wordWrap: 'break-word' }}>
        {message}
      </Paper>
    </Stack>
  );
};

const EssayDetector = () => {
  const [essayInput, setEssayInput] = useState('');
  const [tokenInput, setTokenInput] = useState('');
  const [progressInput, setprogressInput] = useState();
  const [output, setOutput] = useState([]);
  const [doughnutChartData, setDoughnutChartData] = useState({
    labels: ['AI', 'Human'],
    datasets: [{
      label: 'AI vs Human',
      data: [50, 50],
      backgroundColor: ['#4194D5', '#ffffff'],
      borderWidth: 1
    }]
  });
  const [verdict, setVerdict] = useState('');
  const [accuracyScore, setAccuracyScore] = useState(0);
  const chatContainerRef = useRef(null);
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const fetchUsername = async (email) => {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', email));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        setUsername(userDoc.id);
      } else {
        console.error('No user found with the given email');
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUsername(user.email);
      } else {
        setUsername('');
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [output]);

  const handleInputChange = (event) => {
    setEssayInput(event.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setLoading(true);  // Add this line
    setEssayInput('');
  
    try {
      const response = await fetch('https://craigdsouza.pythonanywhere.com/classify/essay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ essay: essayInput }),
      });
  
      const data = await response.json();
  
      setDoughnutChartData(prevData => ({
        ...prevData,
        datasets: [{
          ...prevData.datasets[0],
          data: [data.stats.ai, data.stats.human]
        }]
      }));
  
      setprogressInput(data.stats.ai);
      setVerdict(data.verdict);
      setAccuracyScore(data.stats.ai);
  
      const colorizedSentences = data.sentences.map(sentence => (
        <span style={{ color: sentence.result === 'AI-generated text' ? '#4194D5' : '#FFFFFF' }}>{sentence.text}</span>
      ));
      const joinedMessage = <React.Fragment>{colorizedSentences}</React.Fragment>;
  
      setOutput(prevOutput => [
        ...prevOutput,
        { message: joinedMessage },
      ]);
  
      setTokenInput(data.text);
    } catch (error) {
      console.error('Error fetching essay analysis:', error);
    } finally {
      setLoading(false);  // Add this line
    }
  };
  
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
  
    setLoading(true);  // Add this line
  
    const formData = new FormData();
    formData.append('file', file);
  
    try {
      const response = await fetch('https://craigdsouza2.pythonanywhere.com/upload/essay', {
        method: 'POST',
        body: formData,
      });
  
      const data = await response.json();
  
      setDoughnutChartData(prevData => ({
        ...prevData,
        datasets: [{
          ...prevData.datasets[0],
          data: [data.stats.ai, data.stats.human]
        }]
      }));
  
      setVerdict(data.verdict);
      setAccuracyScore(data.stats.ai);
      setTokenInput(data.text);
  
      const colorizedSentences = data.sentences.map(sentence => (
        <span style={{ color: sentence.result === 'AI-generated text' ? '#4194D5' : '#FFFFFF' }}>{sentence.text}</span>
      ));
      const joinedMessage = <React.Fragment>{colorizedSentences}</React.Fragment>;
  
      setOutput(prevOutput => [
        ...prevOutput,
        { message: joinedMessage },
      ]);
  
      setEssayInput('');
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setLoading(false);  // Add this line
    }
  };
  
  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
  
    setLoading(true);  // Add this line
  
    const formData = new FormData();
    formData.append('file', file);
  
    try {
      const response = await fetch('https://craigdsouza2.pythonanywhere.com/ocr/essay', {
        method: 'POST',
        body: formData,
      });
  
      const data = await response.json();
  
      setDoughnutChartData(prevData => ({
        ...prevData,
        datasets: [{
          ...prevData.datasets[0],
          data: [data.stats.ai, data.stats.human]
        }]
      }));
  
      setVerdict(data.verdict);
      setAccuracyScore(data.stats.ai);
      setTokenInput(data.text);
  
      const colorizedSentences = data.sentences.map(sentence => (
        <span style={{ color: sentence.result === 'AI-generated text' ? '#4194D5' : '#FFFFFF'}}>{sentence.text}</span>
      ));
      const joinedMessage = <React.Fragment>{colorizedSentences}</React.Fragment>;
  
      setOutput(prevOutput => [
        ...prevOutput,
        { message: joinedMessage },
      ]);
  
      setEssayInput('');
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setLoading(false);  // Add this line
    }
  };
  



  return (
    <React.Fragment>
      <CssBaseline />
      <Navbar />
      <Container className='bigcontainer' maxWidth="xl" sx={{ display: 'flex', height: '100vh', backgroundColor: '#000', p: 2, overflow: 'hidden', "@media (max-width: 1439px) and (min-width: 899px)": {paddingLeft: '24px', paddingRight: '24px', height: '92vh', width: '100%',scrollbarWidth: 'thin', scrollbarColor: '#fff #222'}}}>
        <motion.div
          className='history'
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          style={{ flex: '1', overflow: 'auto', color: '#fff', backgroundColor: '#222', p: 2, borderRadius: '20px', mr: 2, scrollbarWidth: 'thin', scrollbarColor: '#fff #222', justifyContent: 'center', marginRight: '20px' }}
        >
          <History username={username} />
        </motion.div>
        <div className='chatbox'style={{ flex: '2', display: 'flex', flexDirection: 'column', color: '#fff' }}>
          <div ref={chatContainerRef} style={{ flex: '1', overflowY: 'auto', backgroundColor: '#000', mb: 2, p: 2, borderRadius: '20px', scrollbarWidth: 'thin', scrollbarColor: '#fff #222', marginLeft: '10px' }}>
            <Stack direction="column" spacing={1}>
              {output.map((essay, index) => (
                <EssayMessage
                  key={index}
                  avatar={essay.type === 'user' ? <UserAvatar /> : <BotAvatar />}
                  message={essay.message}
                  type={essay.type}
                />
              ))}
              {loading && <CircularProgress sx={{ color: '#fff', mt: 2 }} />}
            </Stack>
          </div>
          <TextField
            fullWidth
            multiline
            rows={2}
            label="Search token here..."
            value={essayInput}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            variant="outlined"
            sx={{
              backgroundColor: '#222',
              color: 'white',
              mb: 2,
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#fff',
                },
                '&:hover fieldset': {
                  borderColor: '#fff',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#fff',
                },
              },
              '& .MuiInputLabel-root': {
                color: '#fff',
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#fff',
              },
            }}
            InputProps={{
              inputProps: { style: { color: '#fff' } },
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleSubmit} sx={{ color: '#fff' }}>
                    <SendIcon />
                  </IconButton>
                  <input
                    accept="application/pdf"
                    style={{ display: 'none' }}
                    id="upload-file"
                    type="file"
                    onChange={handleFileChange}
                  />
                  <label htmlFor="upload-file">
                    <IconButton component="span" sx={{ color: '#fff' }}>
                      <PictureAsPdfIcon />
                    </IconButton>
                  </label>
                  <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="upload-image"
                    type="file"
                    onChange={handleImageChange}
                  />
                  <label htmlFor="upload-image">
                    <IconButton component="span" sx={{ color: '#fff' }}>
                      <ImageIcon />
                    </IconButton>
                  </label>
                </InputAdornment>
              )
            }}
          />
          <ProgressBar className='progress' bgcolor={"#6a1b9a"} completed={progressInput} />
          <GenerateId username={username} recentText={tokenInput} accuracyScore={accuracyScore} />
        </div>

        <motion.div
          className='Donut'
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          style={{ flex: '1', paddingLeft: '20px', color: '#ffffff' }}
        >
          <div style={{ backgroundColor: '#222222', borderRadius: '20px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)', padding: '10px', height: '100%' }}>
            <h4 style={{ textAlign: 'center', marginBottom: '20px' }}>RESULTS</h4>
            <motion.div
              whileHover={{ scale: 1.1 }}
              style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '20px' }}
            >
              <Doughnut data={doughnutChartData} />
            </motion.div>
            <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>FINAL VERDICT</h3>
            <p style={{ fontSize: '18px', color: '#ffffff', textAlign: 'center', marginTop: '0' }}>{verdict}</p>
          </div>
        </motion.div>
      </Container>
    </React.Fragment>
  );
};

export default EssayDetector;
