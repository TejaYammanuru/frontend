import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Avatar,
  Paper,
  Alert,
  Collapse,
  IconButton,
} from "@mui/material";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";


const MemberSignup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError(null);
  setSuccessMsg("");

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
        },
      }),
    });

    const data = await response.json();
    const authToken = response.headers.get("Authorization");

    if (response.ok && authToken) {
      localStorage.setItem("token", authToken); 
      setSuccessMsg("Member registered successfully!");
      setTimeout(() => navigate("/member/dashboard/overview"), 1000); 
    } else {
      setError(data.message || "Signup failed.");
    }
  } catch (err) {
    setError("Something went wrong. Please try again.");
  }
};


  return (
    <Box
      sx={{
        maxWidth: 480,
        mx: "auto",
        mt: 8,
        mb: 8,
        px: 4,
        py: 6,
        bgcolor: "#f9fafb",
        borderRadius: 3,
        boxShadow: 4,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 5,
          borderRadius: 3,
          bgcolor: "background.paper",
          boxShadow: "0 10px 20px rgba(25, 118, 210, 0.2)",
        }}
      >
        <Box textAlign="center" mb={4}>
          <Avatar sx={{ bgcolor: "#1976d2", width: 50, height: 50, m: "auto" }}>
            <PersonAddAlt1Icon />
          </Avatar>
          <Typography component="h1" variant="h5" fontWeight="700" mt={1}>
            Member Sign Up
          </Typography>
        </Box>

        {/* Success and Error Alerts */}
        <Collapse in={!!successMsg}>
          <Alert severity="success" sx={{ mb: 2 }}>
            {successMsg}
          </Alert>
        </Collapse>

        <Collapse in={!!error}>
          <Alert
            severity="error"
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => setError(null)}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
            sx={{ mb: 2 }}
          >
            {error}
          </Alert>
        </Collapse>

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Full Name"
            fullWidth
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            margin="normal"
          />
          <TextField
            label="Email"
            type="email"
            fullWidth
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
          />
          <TextField
            label="Confirm Password"
            type="password"
            fullWidth
            required
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            margin="normal"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            sx={{ mt: 3, py: 1.5, fontWeight: "bold" }}
          >
            Sign Up
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default MemberSignup;
