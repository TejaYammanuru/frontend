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
} from "@mui/material";
import {
  MenuBook,
  Logout,
  Menu as MenuIcon,
  ChevronLeft,
  Person,
  History,
  AssignmentTurnedIn,
  AssignmentReturn,
  LibraryBooks,
  PublishedWithChanges,
} from "@mui/icons-material";
import { useNavigate, useLocation, Outlet } from "react-router-dom";

const drawerWidth = 240;
const miniDrawerWidth = 64;

const LibrarianDashboard = () => {
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
    navigate("/librarian/login");
  };

  const menuItems = [
    {
      text: "Manage Books",
      icon: <LibraryBooks />,
      path: "/librarian/dashboard/books",
    },
    {
      text: "Borrow Records",
      icon: <History />,
      path: "/librarian/dashboard/borrow-records",
    },
    {
      text: "Overdue Books",
      icon: <AssignmentTurnedIn />,
      path: "/librarian/dashboard/overdue",
    },
    {
      text: "Borrow Requests",
      icon: <PublishedWithChanges />,
      path: "/librarian/dashboard/borrow-requests",
    },
    {
      text: "Return Ack",
      icon: <AssignmentReturn />,
      path: "/librarian/dashboard/return",
    },
  ];

  const isActiveRoute = (path) => {
    if (path === "/librarian/dashboard") return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      <AppBar
        position="fixed"
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          backgroundColor: "#00897B",
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
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
            📚 Librarian Panel
          </Typography>
          <IconButton color="inherit" onClick={handleMenuClick}>
            <Avatar sx={{ bgcolor: "#fff", color: "#00897B", width: 32, height: 32 }}>
              <Person fontSize="small" />
            </Avatar>
          </IconButton>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
            <MenuItem disabled>
              <Person fontSize="small" sx={{ mr: 1 }} /> Librarian Profile
            </MenuItem>
            <Divider />
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
                      backgroundColor: isActive ? "#e0f2f1" : "transparent",
                      color: isActive ? "#00897B" : "#666",
                      "&:hover": {
                        backgroundColor: isActive ? "#e0f2f1" : "#f5f5f5",
                      },
                      transition: "all 0.2s ease-in-out",
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: drawerOpen ? 3 : "auto",
                        justifyContent: "center",
                        color: isActive ? "#00897B" : "#666",
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

export default LibrarianDashboard;
