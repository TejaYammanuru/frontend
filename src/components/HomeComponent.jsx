import React from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Container,
  Grid,
  Typography,
  Avatar,
} from "@mui/material";
import {
  AdminPanelSettings,
  School,
  Person,
  Login,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer"; // Make sure Footer.jsx is created and exported

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "#f5f7fa" }}>
      <Container maxWidth="md" sx={{ flexGrow: 1, py: 6 }}>
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Box
            sx={{
              width: "100%",
              height: 200,
              borderRadius: 2,
              overflow: "hidden",
              mb: 3,
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
              alt="Library Banner"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Online Library Portal
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Manage and explore our book collection
          </Typography>
        </Box>

        <Grid container spacing={4} justifyContent="center">
          {/* Admin Card */}
          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                borderRadius: 2,
                boxShadow: 3,
                transition: "transform 0.3s",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: 6,
                },
              }}
            >
              <CardContent sx={{ textAlign: "center", p: 3 }}>
                <Avatar sx={{ bgcolor: "#3F51B5", width: 60, height: 60, mb: 2, mx: "auto" }}>
                  <AdminPanelSettings />
                </Avatar>
                <Typography variant="h6" gutterBottom>
                  Admin
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Manage books and staff
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: "center", p: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<Login />}
                  onClick={() => navigate("/admin/login")}
                  sx={{ bgcolor: "#3F51B5", width: "90%", "&:hover": { bgcolor: "#303F9F" } }}
                >
                  Login
                </Button>
              </CardActions>
            </Card>
          </Grid>

          {/* Librarian Card */}
          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                borderRadius: 2,
                boxShadow: 3,
                transition: "transform 0.3s",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: 6,
                },
              }}
            >
              <CardContent sx={{ textAlign: "center", p: 3 }}>
                <Avatar sx={{ bgcolor: "#00897B", width: 60, height: 60, mb: 2, mx: "auto" }}>
                  <School />
                </Avatar>
                <Typography variant="h6" gutterBottom>
                  Librarian
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Manage borrowing records
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: "center", p: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<Login />}
                  onClick={() => navigate("/librarian/login")}
                  sx={{ bgcolor: "#00897B", width: "90%", "&:hover": { bgcolor: "#00695C" } }}
                >
                  Login
                </Button>
              </CardActions>
            </Card>
          </Grid>

          {/* Member Card */}
          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                borderRadius: 2,
                boxShadow: 3,
                transition: "transform 0.3s",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: 6,
                },
              }}
            >
              <CardContent sx={{ textAlign: "center", p: 3 }}>
                <Avatar sx={{ bgcolor: "#1976d2", width: 60, height: 60, mb: 2, mx: "auto" }}>
                  <Person />
                </Avatar>
                <Typography variant="h6" gutterBottom>
                  Member
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Borrow and return books
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: "center", p: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<Login />}
                  onClick={() => navigate("/member/login")}
                  sx={{ bgcolor: "#1976d2", width: "90%", "&:hover": { bgcolor: "#0039CB" } }}
                >
                  Login
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>

        {/* Register Prompt */}
        <Box sx={{ textAlign: "center", mt: 5 }}>
          <Typography variant="body2" color="text.secondary">
            Not registered?
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
      </Container>

     
      <Footer />
    </Box>
  );
};

export default HomePage;
