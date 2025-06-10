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

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "#f5f7fa",
        py: 4,
        display: "flex",
        alignItems: "center",
      }}
    >
      <Container maxWidth="md">
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Box
            sx={{
              width: "100%",
              height: "200px",
              borderRadius: 2,
              mb: 3,
              overflow: "hidden",
              position: "relative",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
              alt="Library Bookshelf"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </Box>
          <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
            Online Library Portal
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Manage and explore our book collection
          </Typography>
        </Box>

        <Grid container spacing={3} justifyContent="center">
          {/* Admin Card */}
          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                borderRadius: 2,
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                transition: "transform 0.3s",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                },
              }}
            >
              <CardContent sx={{ flexGrow: 1, textAlign: "center", p: 3 }}>
                <Avatar
                  sx={{
                    bgcolor: "#3F51B5",
                    width: 60,
                    height: 60,
                    margin: "0 auto 16px",
                  }}
                >
                  <AdminPanelSettings fontSize="medium" />
                </Avatar>
                <Typography variant="h6" component="h3" gutterBottom>
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
                  sx={{
                    bgcolor: "#3F51B5",
                    width: "100%",
                    mx: 2,
                    mb: 1,
                    "&:hover": {
                      bgcolor: "#303F9F",
                    },
                  }}
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
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                transition: "transform 0.3s",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                },
              }}
            >
              <CardContent sx={{ flexGrow: 1, textAlign: "center", p: 3 }}>
                <Avatar
                  sx={{
                    bgcolor: "#00897B",
                    width: 60,
                    height: 60,
                    margin: "0 auto 16px",
                  }}
                >
                  <School fontSize="medium" />
                </Avatar>
                <Typography variant="h6" component="h3" gutterBottom>
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
                  sx={{
                    bgcolor: "#00897B",
                    width: "100%",
                    mx: 2,
                    mb: 1,
                    "&:hover": {
                      bgcolor: "#00695C",
                    },
                  }}
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
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                transition: "transform 0.3s",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                },
              }}
            >
              <CardContent sx={{ flexGrow: 1, textAlign: "center", p: 3 }}>
                <Avatar
                  sx={{
                    bgcolor: "#1976d2",
                    width: 60,
                    height: 60,
                    margin: "0 auto 16px",
                  }}
                >
                  <Person fontSize="medium" />
                </Avatar>
                <Typography variant="h6" component="h3" gutterBottom>
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
                  sx={{
                    bgcolor: "#1976d2",
                    width: "100%",
                    mx: 2,
                    mb: 1,
                    "&:hover": {
                      bgcolor: "#0039CB",
                    },
                  }}
                >
                  Login
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>

        {/* Footer */}
        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Typography variant="body2" color="text.secondary">
            Not registered?{" "}
            <Button
              size="small"
              onClick={() => navigate("/member/signup")}
              sx={{
                fontWeight: 600,
                color: "#1976d2",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              Create an account
            </Button>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default HomePage;
