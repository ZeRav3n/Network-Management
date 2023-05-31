// src/components/Auth.js
import React, { useState } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  Grid,
  Container,
} from "@mui/material";

const Auth = ({ setIsAuthenticated }) => {
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`http://localhost:5000/${mode}`, {
        username,
        password,
      });

      if (mode === "login") {
        localStorage.setItem("access_token", response.data.access_token);
        setIsAuthenticated(true);
      } else {
        setMode("login");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ paddingTop: 4 }}>
        <Paper sx={{ padding: 3 }}>
          <Typography variant="h5" align="center">
            {mode === "login" ? "Login" : "Register"}
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ marginTop: 2 }}>
            <TextField
              label="Username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              margin="normal"
              required
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ marginTop: 2 }}
            >
              {mode === "login" ? "Login" : "Register"}
            </Button>
          </Box>
          <Grid container justifyContent="center" sx={{ marginTop: 2 }}>
            <Grid item>
              <Button
                onClick={() => setMode(mode === "login" ? "register" : "login")}
              >
                {mode === "login"
                  ? "Don't have an account? Register"
                  : "Already have an account? Login"}
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Container>
  );
};

export default Auth;
