import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const NetworkMonitoring = () => {
  const [networkStats, setNetworkStats] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchNetworkStats = async () => {
      try {
        const response = await axios.get('http://localhost:5000/network_stats');
        if (response.data.status === 'error') {
          setErrorMessage(response.data.message);
        } else {
          setErrorMessage('');
          setNetworkStats(response.data);
        }
      } catch (error) {
        console.error("Error fetching network stats:", error);
      }
    };

    fetchNetworkStats();
    const interval = setInterval(fetchNetworkStats, 10000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <Container>
      <br/>
    <Typography variant="h6">Network Monitoring</Typography>
    {networkStats ? (
      <>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Network I/O counters</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <pre>{JSON.stringify(networkStats.net_io_counters, null, 2)}</pre>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Number of network connections</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>{networkStats.net_connections}</Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Network interfaces</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <pre>{JSON.stringify(networkStats.net_if_addrs, null, 2)}</pre>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Network interface stats</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <pre>{JSON.stringify(networkStats.net_if_stats, null, 2)}</pre>
          </AccordionDetails>
        </Accordion>
      </>
    ) : (
      <Typography>Loading...</Typography>
    )}
    {errorMessage && (
      <Box>
        <Typography color="error">Error: {errorMessage}</Typography>
      </Box>
    )}
  </Container>
  );
};

export default NetworkMonitoring;