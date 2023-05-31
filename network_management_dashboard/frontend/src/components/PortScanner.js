import React, { useState } from 'react';
import axios from 'axios';
import { Container, TextField, Button, Typography, Box } from '@mui/material';

const PortScanner = () => {
  const [target, setTarget] = useState('');
  const [startPort, setStartPort] = useState('');
  const [endPort, setEndPort] = useState('');
  const [openPorts, setOpenPorts] = useState(null);

  const handlePortScan = async () => {
    try {
      const response = await axios.post('http://localhost:5000/port_scan', {
        target,
        start_port: startPort,
        end_port: endPort,
      });

      setOpenPorts(response.data.open_ports);
    } catch (error) {
      console.error('Error during port scan:', error);
    }
  };

  return (
    <Container>
      <br/>
      <Typography variant="h6">Port Scanner</Typography>
      <Box>
        <TextField
          label="Target"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          margin="normal"
          required
          sx={{ marginRight: 8 }}
        />
        <TextField
          label="Start Port"
          value={startPort}
          onChange={(e) => setStartPort(e.target.value)}
          margin="normal"
          type="number"
          required
          sx={{ marginRight: 8 }}
        />
        <TextField
          label="End Port"
          value={endPort}
          onChange={(e) => setEndPort(e.target.value)}
          margin="normal"
          type="number"
          required
          sx={{ marginRight: 8 }}
        />
      </Box>
      <Button variant="contained" color="primary" onClick={handlePortScan}>
          Scan
        </Button>
      {openPorts && (
        <Box>
          <Typography>Open Ports:
          
            {openPorts.map((port, index) => (
              <div key={index}>{port}</div>
            ))}
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default PortScanner;
