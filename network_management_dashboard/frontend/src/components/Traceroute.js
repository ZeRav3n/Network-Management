// src/components/Traceroute.js
import React, { useState } from 'react';
import axios from 'axios';
import { Container, TextField, Button, Typography, Box } from '@mui/material';

const Traceroute = () => {
  const [target, setTarget] = useState('');
  const [hops, setHops] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleTraceroute = async () => {
    try {
      const response = await axios.post('http://localhost:5000/traceroute', { target });
      console.log("Response from server:", response);
  
      if (response.data.status === 'error') {
        setErrorMessage(response.data.message);
      } else {
        setErrorMessage('');
        console.log("Hops received:", response.data.hops);
        setHops(response.data.hops);
      }
    } catch (error) {
      console.error("Error during traceroute:", error);
      setHops([]);
    }
  };
  
  
  return (
    <Container>
      <br/>
      <Typography variant="h6">Traceroute Utility</Typography>
      <Box>
        <TextField
          label="Domain or IP Address"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          margin="normal"
          required
        />
      </Box>
      <Button variant="contained" color="primary" onClick={handleTraceroute}>
          Trace
        </Button>
      {hops && (
  <Box>
    <Typography>Traceroute:</Typography>
    <pre>
      {hops.map((hop, index) => (
        <div key={index}>{`${index + 1}. ${hop}`}</div>
      ))}
    </pre>
  </Box>
)}
{errorMessage && (
    <Box>
      <Typography color="error">Error: {errorMessage}</Typography>
    </Box>
  )}
    </Container>
  );
};

export default Traceroute;
