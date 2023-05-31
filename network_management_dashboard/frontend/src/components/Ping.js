// src/components/Ping.js
import React, { useState } from 'react';
import axios from 'axios';
import { Container, TextField, Button, Typography, Box } from '@mui/material';

const Ping = () => {
  const [ip, setIp] = useState('');
  const [pingResponse, setPingResponse] = useState(null);

  const handlePing = async () => {
    try {
      const response = await axios.post('http://localhost:5000/ping', {
        target: ip,
        count: 10,
      });
      
      // Check if the response data is a string and parse it
      if (typeof response.data === 'string') {
        const regex = /Sent:\s(\d+),\sReceived:\s(\d+),\sPacket\sLoss:\s(\d+(?:\.\d+)?%)\s+Min\sTime:\s(\d+(?:\.\d+)?)\sms,\sMax\sTime:\s(\d+(?:\.\d+)?)\sms,\sAvg\sTime:\s(\d+(?:\.\d+)?)\sms/;
        const match = response.data.match(regex);
        if (match) {
          const parsedData = {
            sentPackets: parseInt(match[1]),
            receivedPackets: parseInt(match[2]),
            packetLoss: parseFloat(match[3]),
            minTime: parseFloat(match[4]),
            maxTime: parseFloat(match[5]),
            avgTime: parseFloat(match[6]),
          };
          setPingResponse(parsedData);
        } else {
          setPingResponse(response.data);
        }
      } else {
        setPingResponse(response.data);
      }
    } catch (error) {
      console.error(error);
      setPingResponse(null);
    }
  };

  return (
    <Container>
      <br/>
      <Typography variant="h6">Ping Utility</Typography>
      <Box>
        <TextField
          label="IP Address"
          value={ip}
          onChange={(e) => setIp(e.target.value)}
          margin="normal"
          required
        />
      </Box>
      <Button variant="contained" color="primary" onClick={handlePing}>
          Ping
        </Button>
      {pingResponse && (
  <Box>
  {pingResponse && pingResponse.responseTime !== undefined ? (
    <>
      <Typography>Response Time: {pingResponse.responseTime.toFixed(5)} ms</Typography>
      <Typography>Packet Loss: {pingResponse.packetLoss.toFixed(2)}%</Typography>
      <Typography>Minimum Time: {pingResponse.minTime.toFixed(5)} ms</Typography>
      <Typography>Maximum Time: {pingResponse.maxTime.toFixed(5)} ms</Typography>
      <Typography>Sent Packets: {pingResponse.sentPackets}</Typography>
      <Typography>Received Packets: {pingResponse.receivedPackets}</Typography>
    </>
  ) : (
    <Typography>
      <pre>{pingResponse}</pre>
    </Typography>
  )}
</Box>

)}
    </Container>
 );
};
export default Ping;