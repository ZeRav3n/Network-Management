// src/components/DeviceManagement.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";


const DeviceManagement = () => {
  const [devices, setDevices] = useState([]);
  const [deviceName, setDeviceName] = useState("");
  const [deviceIp, setDeviceIp] = useState("");
  const [deviceType, setDeviceType] = useState("");
  const [updatingDevice, setUpdatingDevice] = useState(null);

  useEffect(() => {
    getDevices();
  }, []);

  const getDevices = async () => {
    const response = await axios.get("http://localhost:5000/devices");
    setDevices(response.data);
  };

  const addDevice = async () => {
    await axios.post("http://localhost:5000/devices", {
      name: deviceName,
      ip_address: deviceIp,
      device_type: deviceType,
    });
    setDeviceName("");
    setDeviceIp("");
    getDevices();
  };
  const updateDevice = async () => {
    await axios.put(`http://localhost:5000/devices/${updatingDevice.id}`, {
      name: deviceName,
      ip_address: deviceIp,
      device_type: deviceType,
    });
    setDeviceName("");
    setDeviceIp("");
    setDeviceType("");
    setUpdatingDevice(null);
    getDevices();
  };

  const deleteDevice = async (deviceId) => {
    await axios.delete(`http://localhost:5000/devices/${deviceId}`);
    getDevices();
  };

  const startUpdatingDevice = (device) => {
    setDeviceName(device.name);
    setDeviceIp(device.ip_address);
    setDeviceType(device.device_type);
    setUpdatingDevice(device);
  };

  return (
    <Container>
      <Typography variant="h6">Device Management</Typography>
      <Box>
      <Box>
        <TextField
          label="Device Name"
          value={deviceName}
          onChange={(e) => setDeviceName(e.target.value)}
          margin="normal"
          required
          sx={{ marginRight: 8 }}
        />
        <TextField
          label="Device IP"
          value={deviceIp}
          onChange={(e) => setDeviceIp(e.target.value)}
          margin="normal"
          required
          sx={{ marginRight: 8 }}
        />
        <TextField
          label="Device Type"
          value={deviceType}
          onChange={(e) => setDeviceType(e.target.value)}
          margin="normal"
          required
        />
        </Box>
        
        <Button
          variant="contained"
          color="primary"
          onClick={updatingDevice ? updateDevice : addDevice}
        >
          {updatingDevice ? "Update Device" : "Add Device"}
        </Button>
      </Box>
      <br/>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>IP Address</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {devices.map((device) => (
              <TableRow key={device.id}>
                <TableCell>{device.name}</TableCell>
                <TableCell>{device.ip_address}</TableCell>
                <TableCell>{device.device_type}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => startUpdatingDevice(device)}
                    sx={{ marginRight: 2 }}
                  >
                    Update
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => deleteDevice(device.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};
export default DeviceManagement;