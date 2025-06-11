import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  CssBaseline,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  useTheme,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert,
} from "@mui/material";
import {
  MenuBook,
  History,
  Logout,
  Home,
  Menu as MenuIcon,
  ChevronLeft,
  Person,
  NotificationsNone,
  AssignmentReturn,
} from "@mui/icons-material";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import BooksPage from "./BooksPage";
import Book from "./Book";
import BorrowingHistory from "./BorrowingHistory";
import Notifications from "./Notifications";
import ReturnBook from "./ReturnBook";
import MemberSignup from "./MemberSignup";
import MyBorrowRequests from "./MyBorrowRequests";
import axios from "axios";
import ReturnBooks from "./ReturnBooks"
import MemberOverdueBooks from "./MemberOverdueBooks";

const drawerWidth = 240;
const miniDrawerWidth = 64;

const MemberDashboard = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [logoutError, setLogoutError] = useState(null);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [updateMessage, setUpdateMessage] = useState(null);
  const [updateAlert, setUpdateAlert] = useState({
    show: false,
    message: "",
    severity: "success", // success or error
  });

  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  const handleMenuClick = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleDrawerToggle = () => setDrawerOpen(!drawerOpen);

  // Function to show alert for 3 seconds
  const showAlert = (message, severity) => {
    setUpdateAlert({
      show: true,
      message,
      severity,
    });
    setTimeout(() => {
      setUpdateAlert({
        show: false,
        message: "",
        severity: "success",
      });
    }, 3000);
  };

  const handleLogout = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.delete("http://localhost:3001/logout", {
        headers: {
          Authorization: `${token}`,
        },
      });

      if (response.status === 200 || response.status === 204) {
        localStorage.removeItem("token");
        navigate("/");
      } else {
        setLogoutError("Logout failed. Please try again.");
      }
    } catch (error) {
      console.error("Logout error:", error);
      setLogoutError("An error occurred during logout. Please try again.");
    }
  };

  const handleUpdateProfile = () => {
    const token = localStorage.getItem("token");

    axios
      .get("http://localhost:3001/profile", {
        headers: { Authorization: `${token}` },
      })
      .then((res) => {
        const { name, email } = res.data.user;
        setUserData({
          name,
          email,
          password: "",
          password_confirmation: "",
        });
        setUpdateDialogOpen(true);
        // Clear any previous alerts
        setUpdateAlert({
          show: false,
          message: "",
          severity: "success",
        });
      })
      .catch((err) => {
        console.error("Failed to fetch user data", err);
      });
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete your profile? This action cannot be undone.");
    if (!confirmDelete) return;

    const token = localStorage.getItem("token");

    try {
      const response = await axios.delete("http://localhost:3001/signup", {
        headers: {
          Authorization: `${token}`,
        },
      });

      if (response.status === 200) {
        alert("Account deleted successfully.");
        localStorage.removeItem("token");
        navigate("/");
      }
    } catch (error) {
      console.error("Account deletion failed", error);
      alert("Failed to delete account. Please try again.");
    }
  };

  const handleProfileUpdateSubmit = async () => {
  
  if (userData.password && userData.password.length < 8) {
    showAlert("Password must be at least 8 characters long", "error");
    return;
  }

  
  if (userData.password && userData.password !== userData.password_confirmation) {
    showAlert("Password and confirmation do not match", "error");
    return;
  }

  const token = localStorage.getItem("token");

  
  const updatePayload = {
    name: userData.name,
    email: userData.email,
  };

  
  if (userData.password && userData.password.trim() !== "") {
    updatePayload.password = userData.password;
    updatePayload.password_confirmation = userData.password_confirmation;
  }

  try {
    const response = await axios.put(
      "http://localhost:3001/signup",
      { user: updatePayload },
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );

    if (response.status === 200) {
      showAlert("Profile updated successfully!", "success");
      setTimeout(() => {
        setUpdateDialogOpen(false);
      }, 1500); 
    }
  } catch (error) {
    console.error("Update error", error);
    
    
    let errorMessage = "Profile update failed. Please try again.";
    
    if (error.response && error.response.data) {
      const errorData = error.response.data;
      
    
      if (errorData.errors && Array.isArray(errorData.errors)) {
        errorMessage = errorData.errors.join(", ");
      } else if (errorData.message) {
        errorMessage = errorData.message;
      } else if (typeof errorData === 'string') {
        errorMessage = errorData;
      }
    }
    
    showAlert(errorMessage, "error");
  }
};

  const menuItems = [
    { text: "Dashboard", icon: <Home />, path: "/member/dashboard" },
    { text: "View/Search Books", icon: <MenuBook />, path: "/member/dashboard/books" },
     { text: "My Borrow Requests", icon: <MenuBook />, path: "/member/dashboard/requests" },
    { text: "Notifications", icon: <NotificationsNone />, path: "/member/dashboard/notifications" },
    { text: "Overdue Books", icon: <History />, path: "/member/dashboard/overdue" },
    { text: "Borrowing History", icon: <History />, path: "/member/dashboard/history" },
    { text: "Return book", icon: <AssignmentReturn />, path: "/member/dashboard/return" },
  ];

  const isActiveRoute = (path) => {
    if (path === "/member/dashboard") {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      <AppBar
        position="fixed"
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          backgroundColor: "#1976d2",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="toggle drawer"
            onClick={handleDrawerToggle}
            edge="start"
            sx={{ marginRight: 2 }}
          >
            {drawerOpen ? <ChevronLeft /> : <MenuIcon />}
          </IconButton>

          <Typography
            variant="h6"
            sx={{
              flexGrow: 1,
              fontWeight: 600,
              letterSpacing: "0.5px",
            }}
          >
            📚 Library Portal
          </Typography>

          <IconButton color="inherit" onClick={handleMenuClick}>
            <Avatar sx={{ bgcolor: "#fff", color: "#1976d2", width: 32, height: 32 }}>
              <Person fontSize="small" />
            </Avatar>
          </IconButton>

          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
            {/* <MenuItem disabled sx={{ opacity: 0.7 }}>
              <Person fontSize="small" sx={{ mr: 1 }} />
              Profile
            </MenuItem>
            <Divider /> */}
            <MenuItem onClick={handleUpdateProfile}>
              <Person fontSize="small" sx={{ mr: 1 }} />
              Update Profile
            </MenuItem>
            <MenuItem
              onClick={handleLogout}
              sx={{
                color: "#d32f2f",
                "&:hover": {
                  backgroundColor: "rgba(211, 47, 47, 0.04)",
                },
              }}
            >
              <Logout fontSize="small" sx={{ mr: 1 }} />
              Logout
            </MenuItem>
             <MenuItem onClick={handleDelete}>
              <Person fontSize="small" sx={{ mr: 1 }} />
             Delete Profile
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        open={drawerOpen}
        sx={{
          width: drawerOpen ? drawerWidth : miniDrawerWidth,
          flexShrink: 0,
          whiteSpace: "nowrap",
          boxSizing: "border-box",
          "& .MuiDrawer-paper": {
            width: drawerOpen ? drawerWidth : miniDrawerWidth,
            transition: theme.transitions.create("width", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            overflowX: "hidden",
            backgroundColor: "#fafafa",
            borderRight: "1px solid #e0e0e0",
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto", mt: 1 }}>
          <List>
            {menuItems.map((item) => {
              const isActive = isActiveRoute(item.path);
              return (
                <Tooltip key={item.text} title={!drawerOpen ? item.text : ""} placement="right" arrow>
                  <ListItem
                    button
                    onClick={() => navigate(item.path)}
                    sx={{
                      minHeight: 48,
                      justifyContent: drawerOpen ? "initial" : "center",
                      px: 2.5,
                      mx: 1,
                      borderRadius: 2,
                      mb: 0.5,
                      backgroundColor: isActive ? "#e3f2fd" : "transparent",
                      color: isActive ? "#1976d2" : "#666",
                      "&:hover": {
                        backgroundColor: isActive ? "#e3f2fd" : "#f5f5f5",
                      },
                      transition: "all 0.2s ease-in-out",
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: drawerOpen ? 3 : "auto",
                        justifyContent: "center",
                        color: isActive ? "#1976d2" : "#666",
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.text}
                      sx={{
                        opacity: drawerOpen ? 1 : 0,
                        "& .MuiListItemText-primary": {
                          fontSize: "0.9rem",
                          fontWeight: isActive ? 600 : 400,
                        },
                      }}
                    />
                  </ListItem>
                </Tooltip>
              );
            })}
          </List>
        </Box>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          backgroundColor: "#f8f9fa",
          minHeight: "100vh",
        }}
      >
        <Toolbar />
        {logoutError && (
          <Alert severity="error" onClose={() => setLogoutError(null)} sx={{ mb: 2 }}>
            {logoutError}
          </Alert>
        )}
        {updateMessage && (
          <Alert severity="info" onClose={() => setUpdateMessage(null)} sx={{ mb: 2 }}>
            {updateMessage}
          </Alert>
        )}

        <Routes>
          <Route path="/" element={
            <Box sx={{ textAlign: "center", py: 8 }}>
              <MenuBook sx={{ fontSize: 80, color: "#1976d2", mb: 3 }} />
              <Typography variant="h5" sx={{ color: "#333", mb: 2 }}>
                Dashboard Home
              </Typography>
              <Typography variant="body1" sx={{ color: "#666", maxWidth: 600, mx: "auto" }}>
                Use the sidebar navigation to browse books, manage your borrowings, or view your history.
                Click on any menu item to get started with your library experience.
              </Typography>
            </Box>
          } />
          <Route path="/books" element={<BooksPage />} />
          <Route path="/books/:bookId" element={<Book />} />
          <Route path="/history" element={<BorrowingHistory />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/overdue" element={<MemberOverdueBooks />} />
          <Route path="/return" element={<ReturnBooks />} />
          <Route path="/requests" element={<MyBorrowRequests/>}/>
        </Routes>
      </Box>

      {/* Update Profile Dialog */}
      <Dialog open={updateDialogOpen} onClose={() => setUpdateDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Update Profile</DialogTitle>
        <DialogContent>
          {/* Alert positioned at top of dialog content */}
          {updateAlert.show && (
            <Alert 
              severity={updateAlert.severity} 
              sx={{ 
                mb: 2,
                backgroundColor: updateAlert.severity === 'success' ? '#d4edda' : '#f8d7da',
                color: updateAlert.severity === 'success' ? '#155724' : '#721c24',
                border: updateAlert.severity === 'success' ? '1px solid #c3e6cb' : '1px solid #f5c6cb'
              }}
            >
              {updateAlert.message}
            </Alert>
          )}
          
          <TextField
            margin="dense"
            label="Name"
            fullWidth
            value={userData.name}
            onChange={(e) => setUserData({ ...userData, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Email"
            fullWidth
            value={userData.email}
            onChange={(e) => setUserData({ ...userData, email: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Password"
            type="password"
            fullWidth
            value={userData.password}
            onChange={(e) => setUserData({ ...userData, password: e.target.value })}
            helperText="Leave blank to keep current password. Minimum 8 characters if changing."
          />
          <TextField
            margin="dense"
            label="Confirm Password"
            type="password"
            fullWidth
            value={userData.password_confirmation}
            onChange={(e) => setUserData({ ...userData, password_confirmation: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUpdateDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleProfileUpdateSubmit} variant="contained">Update</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MemberDashboard;