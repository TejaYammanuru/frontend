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
   NotificationsNone,
  History,
  AssignmentReturn,
} from "@mui/material";
import {
  MenuBook,
  Logout,
  Home,
  Menu as MenuIcon,
  ChevronLeft,
  Person,
  AssignmentInd,
  ManageAccounts,
} from "@mui/icons-material";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import HistoryIcon from '@mui/icons-material/History';
import logo from "../../logo.png"; 


const drawerWidth = 240;
const miniDrawerWidth = 64;

const AdminDashboardLayout = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  const handleMenuClick = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleDrawerToggle = () => setDrawerOpen(!drawerOpen);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    navigate("/");
  };

  const menuItems = [
    { text: "Dashboard", icon: <Home />, path: "/admin/dashboard" },
    { text: "Manage Librarians", icon: <AssignmentInd />, path: "/admin/dashboard/librarians" },
    { text: "Manage Books", icon: <MenuBook />, path: "/admin/dashboard/books" },
    { text: "Manage Members", icon: <ManageAccounts />, path: "/admin/dashboard/members" },
     { text: "Borrow History", icon: <HistoryIcon />, path: "/admin/dashboard/history" },
  ];

  const isActiveRoute = (path) => {
    if (path === "/admin/dashboard") return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      <AppBar
        position="fixed"
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          backgroundColor: "#3f51b5",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            onClick={handleDrawerToggle}
            edge="start"
            sx={{ marginRight: 2 }}
          >
            {drawerOpen ? <ChevronLeft /> : <MenuIcon />}
          </IconButton>
           <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
            <img src={logo} alt="Library Logo" style={{ height: 40, marginRight: 10 }} />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                letterSpacing: "0.5px",
              }}
            >
              LibroLink
            </Typography>
          </Box>
          <IconButton color="inherit" onClick={handleMenuClick}>
            <Avatar sx={{ bgcolor: "#fff", color: "#3f51b5", width: 32, height: 32 }}>
              <Person fontSize="small" />
            </Avatar>
          </IconButton>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
            {/* <MenuItem disabled>
              <Person fontSize="small" sx={{ mr: 1 }} /> Admin Profile
            </MenuItem>
            <Divider /> */}
            <MenuItem onClick={handleLogout} sx={{ color: "#d32f2f" }}>
              <Logout fontSize="small" sx={{ mr: 1 }} /> Logout
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
                <Tooltip
                  key={item.text}
                  title={!drawerOpen ? item.text : ""}
                  placement="right"
                  arrow
                >
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
                      backgroundColor: isActive ? "#e8eaf6" : "transparent",
                      color: isActive ? "#3f51b5" : "#666",
                      "&:hover": {
                        backgroundColor: isActive ? "#e8eaf6" : "#f5f5f5",
                      },
                      transition: "all 0.2s ease-in-out",
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: drawerOpen ? 3 : "auto",
                        justifyContent: "center",
                        color: isActive ? "#3f51b5" : "#666",
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
        <Outlet /> 
      </Box>
    </Box>
  );
};

export default AdminDashboardLayout;
