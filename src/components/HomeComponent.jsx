import React from "react";
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
} from "@mui/material";
import { Login } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #e3f2fd, #ffffff)",
      }}
    >
      <Container maxWidth="md" sx={{ flexGrow: 1, py: 6 }}>
        {/* Banner and Title */}
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Box
            sx={{
              width: "100%",
              height: 250,
              borderRadius: 3,
              overflow: "hidden",
              mb: 3,
              boxShadow: 3,
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
              alt="Library Banner"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </Box>
          <Typography variant="h3" fontWeight="bold" gutterBottom color="primary">
            LIBROLINK
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Discover. Manage. Borrow — Your Digital Library.
          </Typography>
        </Box>

        {/* Login Card */}
        <Paper elevation={4} sx={{ p: 4, textAlign: "center", borderRadius: 3, backgroundColor: "#ffffffcc" }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Ready to dive in?
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={<Login />}
            onClick={() => navigate("/login")}
            sx={{
              bgcolor: "#1976d2",
              px: 4,
              py: 1.5,
              fontWeight: 600,
              fontSize: "1rem",
              "&:hover": { bgcolor: "#0039CB" },
            }}
          >
            Login
          </Button>

          {/* Register Prompt */}
          <Box sx={{ mt: 3 }}>
            <Typography variant="body2" color="text.secondary">
              New here?
              <Button
                size="small"
                onClick={() => navigate("/member/signup")}
                sx={{
                  fontWeight: 600,
                  color: "#1976d2",
                  ml: 1,
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                Create an account
              </Button>
            </Typography>
          </Box>
        </Paper>
      </Container>

      <Box mt="auto">
        <Footer />
      </Box>
    </Box>
  );
};

export default HomePage;
