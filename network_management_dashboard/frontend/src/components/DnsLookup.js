import React, { useState } from "react";
import axios from "axios";
import { Container, TextField, Button, Typography, Box } from "@mui/material";

const DnsLookup = () => {
  const [domain, setDomain] = useState("");
  const [ipAddress, setIpAddress] = useState("");

  const handleDnsLookup = async () => {
    try {
      const response = await axios.post("http://localhost:5000/dns_lookup", {
        target: domain,
      });
      console.log(response);
      setIpAddress(response.data.ip_addresses.join(', '));
    } catch (error) {
      console.error(error);
      setIpAddress("Error: Could not perform DNS lookup.");
    }
  };

  return (
    <Container>
      <br/>
      <Typography variant="h6">DNS Lookup</Typography>
      <Box>
        <TextField
          label="Domain"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          margin="normal"
          required
        />
      </Box>
      <Button variant="contained" color="primary" onClick={handleDnsLookup}>
          Lookup
        </Button>
      {ipAddress && (
        <Box>
          <Typography>IP Address: {ipAddress}</Typography>
        </Box>
      )}
    </Container>
  );
};

export default DnsLookup;
