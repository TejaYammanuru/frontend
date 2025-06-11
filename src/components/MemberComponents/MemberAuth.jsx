import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  Paper,
  Alert,
  Collapse,
  IconButton,
  Tabs,
  Tab,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";

const MemberAuth = () => {
  const [tab, setTab] = useState(0); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setPasswordConfirmation("");
    setName("");
  };

  const handleTabChange = (_, newValue) => {
    setTab(newValue);
    setError(null);
    setSuccess(null);
    resetForm();
  };

  // Function to extract error message from backend response
  const extractErrorMessage = (data) => {
    if (data.errors && Array.isArray(data.errors)) {
      return data.errors.join(", ");
    } else if (data.message) {
      return data.message;
    } else if (typeof data === 'string') {
      return data;
    }
    return "An unexpected error occurred.";
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      const response = await fetch("http://localhost:3001/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ user: { email, password } }),
      });

      const data = await response.json();
      const token = response.headers.get("Authorization");

      if (response.ok && token) {
        localStorage.setItem("token", token);
        setSuccess("Login successful! Redirecting...");
        setTimeout(() => navigate("/member/dashboard"), 1500);
      } else {
        // Extract error message using the helper function
        const errorMessage = extractErrorMessage(data);
        setError(errorMessage);
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An error occurred during login. Please try again.");
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (password !== passwordConfirmation) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          user: {
            name,
            email,
            password,
            password_confirmation: passwordConfirmation,
            role: 0,
          },
        }),
      });

      const data = await response.json();
      const token = response.headers.get("Authorization");

      if (response.ok && token) {
        localStorage.setItem("token", token);
        setSuccess("Signup successful! Redirecting...");
        setTimeout(() => navigate("/member/dashboard"), 1500);
      } else {
        // Extract error message using the helper function
        const errorMessage = extractErrorMessage(data);
        setError(errorMessage);
      }
    } catch (err) {
      console.error("Signup error:", err);
      setError("An error occurred during signup. Please try again.");
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 480,
        mx: "auto",
        mt: 8,
        px: 4,
        py: 6,
        bgcolor: "#f9fafb",
        borderRadius: 3,
        boxShadow: 4,
      }}
    >
      <Box textAlign="center" mb={4}>
        <Avatar
          sx={{
            bgcolor: "#1976d2",
            width: 70,
            height: 70,
            mx: "auto",
            mb: 2,
          }}
        >
          {tab === 0 ? (
            <LockOutlinedIcon fontSize="large" />
          ) : (
            <PersonAddAlt1Icon fontSize="large" />
          )}
        </Avatar>
        <Typography variant="h5" fontWeight="700">
          {tab === 0 ? "Member Login" : "Member Signup"}
        </Typography>
      </Box>

      <Tabs
        value={tab}
        onChange={handleTabChange}
        variant="fullWidth"
        sx={{ mb: 3 }}
      >
        <Tab label="Login" />
        <Tab label="Signup" />
      </Tabs>

      <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
        <Collapse in={error !== null}>
          <Alert
            severity="error"
            sx={{ 
              mb: 3,
              backgroundColor: '#f8d7da',
              color: '#721c24',
              border: '1px solid #f5c6cb'
            }}
            action={
              <IconButton onClick={() => setError(null)} size="small">
                <CloseIcon fontSize="small" />
              </IconButton>
            }
          >
            {error}
          </Alert>
        </Collapse>

        <Collapse in={success !== null}>
          <Alert
            severity="success"
            sx={{ 
              mb: 3,
              backgroundColor: '#d4edda',
              color: '#155724',
              border: '1px solid #c3e6cb'
            }}
            action={
              <IconButton onClick={() => setSuccess(null)} size="small">
                <CloseIcon fontSize="small" />
              </IconButton>
            }
          >
            {success}
          </Alert>
        </Collapse>

        <Box
          component="form"
          onSubmit={tab === 0 ? handleLogin : handleSignup}
          autoComplete="off"
        >
          {tab === 1 && (
            <TextField
              fullWidth
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              sx={{ mb: 2 }}
            />
          )}

          <TextField
            fullWidth
            type="email"
            label="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            type="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            sx={{ mb: 2 }}
            helperText={tab === 1 ? "Password must be at least 6 characters" : ""}
          />

          {tab === 1 && (
            <TextField
              fullWidth
              type="password"
              label="Confirm Password"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              required
              sx={{ mb: 3 }}
            />
          )}

          {tab === 0 && <Box mb={3} />}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            sx={{
              py: 1.5,
              fontWeight: 700,
              letterSpacing: 1,
              bgcolor: "#1976d2",
              "&:hover": {
                bgcolor: "#155a9a",
              },
            }}
          >
            {tab === 0 ? "SIGN IN" : "SIGN UP"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default MemberAuth;