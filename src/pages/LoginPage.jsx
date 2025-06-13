import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Collapse,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

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
      const token = response.headers.get("Authorization");

      if (response.ok && token) {
        localStorage.setItem("token", token);
        localStorage.setItem("userName", data.user.name);
        localStorage.setItem("role", data.user.role);

        // Redirect based on role
        switch (data.user.role) {
          case "admin":
            navigate("/admin/dashboard");
            break;
          case "librarian":
            navigate("/librarian/dashboard");
            break;
          case "member":
            navigate("/member/dashboard/overview");
            break;
          default:
            setError("Unknown role. Cannot redirect.");
        }
      } else {
        setError(data.message || "Invalid login credentials.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An error occurred during login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Card>
        <CardContent sx={{ py: 5 }}>
          <Box textAlign="center" mb={3}>
            <LockOutlinedIcon fontSize="large" color="primary" />
            <Typography variant="h5" fontWeight={600}>
              Sign In
            </Typography>
          </Box>

          <Collapse in={error !== null}>
            <Alert
              severity="error"
              sx={{ mb: 2 }}
              action={
                <IconButton onClick={() => setError(null)} size="small">
                  <CloseIcon fontSize="small" />
                </IconButton>
              }
            >
              {error}
            </Alert>
          </Collapse>

          <Box component="form" onSubmit={handleLogin}>
            <TextField
              fullWidth
              type="email"
              label="Email"
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <TextField
              fullWidth
              type="password"
              label="Password"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 3 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Sign In"}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default LoginPage;
