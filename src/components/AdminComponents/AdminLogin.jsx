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
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import CloseIcon from "@mui/icons-material/Close";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch("http://localhost:3001/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          user: {
            email,
            password,
          },
        }),
      });

      const data = await response.json();
     
      localStorage.setItem("userName", data.user.name);
      const token = response.headers.get("Authorization");

      if (response.ok && token) {
        localStorage.setItem("token", token);
        navigate("/admin/dashboard");
      } else {
        setError(data.message || "Invalid login credentials.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An error occurred during login. Please try again.");
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
            bgcolor: "#3F51B5",
            width: 70,
            height: 70,
            mx: "auto",
            mb: 2,
          }}
        >
          <AdminPanelSettingsIcon fontSize="large" />
        </Avatar>
        <Typography variant="h5" fontWeight="700">
          Admin Login
        </Typography>
      </Box>

      <Paper
        elevation={4}
        sx={{
          p: 4,
          borderRadius: 3,
        }}
      >
        <Collapse in={error !== null}>
          <Alert
            severity="error"
            sx={{ mb: 3 }}
            action={
              <IconButton onClick={() => setError(null)} size="small">
                <CloseIcon fontSize="small" />
              </IconButton>
            }
          >
            {error}
          </Alert>
        </Collapse>

        <Box component="form" onSubmit={handleSubmit} autoComplete="off">
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
            sx={{ mb: 3 }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            sx={{
              py: 1.5,
              fontWeight: 700,
              letterSpacing: 1,
              bgcolor: "#3F51B5",
              "&:hover": {
                bgcolor: "#2c3e9e",
              },
            }}
          >
            SIGN IN
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default AdminLogin;
