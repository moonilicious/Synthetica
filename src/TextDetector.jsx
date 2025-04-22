import React, { useState, useRef, useEffect } from 'react';
import './TextDetector.css';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Paper from '@mui/material/Paper';
import { Line, Doughnut } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import 'chartjs-adapter-moment';
import Navbar from './Navbar';
import { Typography } from '@mui/material';

Chart.register(...registerables);

const BotAvatar = () => (
  <Avatar alt="Bot" src="/static/images/avatar/bot.jpg" sx={{ width: 64, height: 64 }} />
);

const UserAvatar = () => (
  <Avatar alt="User" src="/static/images/avatar/user.jpg" sx={{ width: 64, height: 64 }} />
);

const ChatMessage = ({ avatar, message, type }) => (
  <Stack direction="row" spacing={2} alignItems="center" sx={{ padding: '8px', justifyContent: type === 'user' ? 'flex-end' : 'flex-start' }}>
    {avatar}
    <Paper sx={{ padding: '10px', borderRadius: '10px', backgroundColor: type === 'user' ? '#007bff' : '#f0f0f0', color: type === 'user' ? '#fff' : '#333', width: '70%', wordWrap: 'break-word' }}>
      <Typography>{message}</Typography>
    </Paper>
  </Stack>
);

const TextDetector = () => {
  const [userInput, setUserInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [lineChartData, setLineChartData] = useState({
    labels: [],
    datasets: [{
      label: 'Confidence',
      data: [],
      fill: false,
      borderColor: '#36a2eb',
      tension: 0.1
    }]
  });
  const [doughnutChartData, setDoughnutChartData] = useState({
    labels: ['AI', 'Human'],
    datasets: [{
      label: 'AI vs Human',
      data: [50, 50],
      backgroundColor: ['#36a2eb', '#ff6384'],
      borderWidth: 0
    }]
  });
  const [userText, setUserText] = useState(''); // State for user text display

  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleInputChange = (event) => {
    setUserInput(event.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      sendMessage();
    }
  };

  const handlePredict = async () => {
    // Simulate API call
    const response = await fetch('http://localhost:5000/classify/text', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: userInput }),
    });
    const data = await response.json();
    console.log(data)
    setLineChartData(prevData => ({
      ...prevData,
      labels: [...prevData.labels, new Date()],
      datasets: [{
        ...prevData.datasets[0],
        data: [...prevData.datasets[0].data, data.stats.ai_percentage]
      }]
    }));

    setDoughnutChartData(prevData => ({
      ...prevData,
      datasets: [{
        ...prevData.datasets[0],
        data: [data.stats.ai_percentage, data.stats.human_percentage]
      }]
    }));

    return data.result;
  };

  const sendMessage = async () => {
    const message = userInput;
    setUserText(message); // Update user text display
    setChatHistory([...chatHistory, { message, type: 'user' }]);
    setUserInput('');
    
    const botMessage = 'Processing...';
    setChatHistory([...chatHistory, { message: botMessage, type: 'bot' }]);
    const prediction = await handlePredict();
    setChatHistory([...chatHistory, { message: prediction, type: 'bot' }]);
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <Navbar/>
      <Container maxWidth="xl" style={{ display: 'flex', justifyContent: 'space-between', height: '100vh', backgroundColor: '#f9f9f9' }}>
        <div className="chat-section" style={{ width: 'calc(100% - 20px)', margin: '20px', padding: '20px', boxSizing: 'border-box', overflow: 'auto' }}>
          <div className="chat-box" ref={chatContainerRef} style={{ maxHeight: 'calc(100% - 200px)', overflowY: 'auto' }}>
            <Stack direction="column" spacing={1}>
              {chatHistory.map((chat, index) => (
                <ChatMessage
                  key={index}
                  avatar={chat.type === 'user' ? <UserAvatar /> : <BotAvatar />}
                  message={chat.message}
                  type={chat.type}
                />
              ))}
            </Stack>
          </div>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Enter your message here:"
            value={userInput}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            variant="outlined"
            style={{ marginTop: '20px' }}
          />
          <Button variant="contained" disableElevation onClick={sendMessage} style={{ backgroundColor: '#007bff', color: '#fff', marginTop: '10px', width: '100%' }}>
            Send
          </Button>
        </div>
        <div className="result-section" style={{ width: 'calc(50% - 20px)', margin: '20px', padding: '20px', boxSizing: 'border-box', backgroundColor: '#f0f0f0', overflow: 'auto' }}>
          <h2 style={{ marginBottom: '20px' }}>Text Detection Result</h2>
          <div>
            <Typography variant="h6">User Input:</Typography>
            <Paper sx={{ padding: '10px', borderRadius: '10px', backgroundColor: '#f0f0f0', marginBottom: '20px' }}>
              <Typography>{userText}</Typography>
            </Paper>
          </div>
          <div style={{ width: '100%', height: '250px', marginBottom: '20px' }}>
            <Line
              data={lineChartData}
              options={{
                scales: {
                  x: {
                    type: 'time',
                    time: {
                      unit: 'second'
                    }
                  },
                  y: {
                    type: 'linear',
                    min: 0,
                    max: 100
                  }
                }
              }}
            />
          </div>
          <div style={{ width: '50%', height: '250px', marginLeft: 'auto', marginRight: 'auto' }}>
            <Doughnut data={doughnutChartData} />
          </div>
        </div>
      </Container>
    </React.Fragment>
  );
};

export default TextDetector;
