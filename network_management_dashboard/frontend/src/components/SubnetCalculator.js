// src/components/SubnetCalculator.js
import React, { useState } from "react";
import axios from "axios";
import { Container, TextField, Button, Typography, Box } from "@mui/material";

const SubnetCalculator = () => {
  const [ip, setIp] = useState("");
  const [subnetMask, setSubnetMask] = useState("");
  const [networkInfo, setNetworkInfo] = useState(null);

  const handleSubnetCalculation = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/subnet_calculator",
        {
          ip,
          subnet_mask: subnetMask,
        }
      );
      setNetworkInfo(response.data);
    } catch (error) {
      console.error(error);
      setNetworkInfo(null);
    }
  };

  return (
    <Container>
      <br/>
      <Typography variant="h6">Subnet Calculator</Typography>
      <Box>
        <TextField
          label="IP Address"
          value={ip}
          onChange={(e) => setIp(e.target.value)}
          margin="normal"
          required
          sx={{ marginRight: 7 }}
        />
        <TextField
          label="Subnet Mask"
          value={subnetMask}
          onChange={(e) => setSubnetMask(e.target.value)}
          margin="normal"
          required
        />
      </Box>
      <Button
        variant="contained"
        color="primary"
        onClick={handleSubnetCalculation}
      >
        Calculate
      </Button>
      {networkInfo && (
        <Box>
          <Typography sx={{marginTop: 1}}>
          Network Address: {networkInfo.network_address ? networkInfo.network_address : "Not available"}
          </Typography>
          <Typography>
            Broadcast Address: {networkInfo.broadcast_address ? networkInfo.broadcast_address : "Not available"}
          </Typography>
          <Typography>
            Number of Addresses: {networkInfo.num_addresses ? networkInfo.num_addresses : "Not available"}
          </Typography>
          <Typography>
            Usable Hosts Range:{" "}
            {networkInfo.usable_hosts_range
              ? `${networkInfo.usable_hosts_range.first_usable_ip} - ${networkInfo.usable_hosts_range.last_usable_ip}`
              : "Not available"}
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default SubnetCalculator;
