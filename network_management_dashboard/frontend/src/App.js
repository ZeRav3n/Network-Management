// src/App.js
import React, { useState, useEffect } from 'react';
import DeviceManagement from './components/DeviceManagement';
import Ping from './components/Ping';
import DnsLookup from './components/DnsLookup';
import SubnetCalculator from './components/SubnetCalculator';
import Auth from './components/Auth';
import Traceroute from './components/Traceroute';
import { ThemeProvider } from '@mui/material/styles';
import theme from './styles/theme';
import PortScanner from './components/PortScanner';
import NetworkMonitoring from './components/NetworkMonitoring';
import { Container, Grid, Box, AppBar, Toolbar, Typography, Button } from "@mui/material";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('access_token');
    setIsAuthenticated(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Network Management Dashboard
          </Typography>
          {isAuthenticated && (
            <Button color="inherit" onClick={logout}>
              Logout
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <Container>
        <Box sx={{ paddingTop: 4 }}>
          {isAuthenticated ? (
            <>
              <DeviceManagement />
              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  <Ping />
                  <SubnetCalculator />
                </Grid>
                <Grid item xs={12} md={6}>
                  <DnsLookup />
                  <Traceroute />
                </Grid>
              </Grid>
              <PortScanner />
              <NetworkMonitoring />
            </>
          ) : (
            <Auth setIsAuthenticated={setIsAuthenticated} />
          )}
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
