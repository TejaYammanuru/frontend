import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Divider,
  Chip,
  Avatar,
  Stack,
} from "@mui/material";
import axios from "axios";
import dayjs from "dayjs";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import BookmarkAddedIcon from "@mui/icons-material/BookmarkAdded";
import AlarmIcon from "@mui/icons-material/Alarm";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import DashboardIcon from '@mui/icons-material/Dashboard';
const statCards = [
  { label: "Total Borrowed", key: "total_borrowed", icon: <BookmarkAddedIcon />, color: "#1976d2" },
  { label: "Currently Borrowed", key: "currently_borrowed", icon: <LibraryBooksIcon />, color: "#0288d1" },
  { label: "Overdue Books", key: "overdue_books", icon: <AlarmIcon />, color: "#d32f2f" },
  { label: "Return Requests", key: "return_requested", icon: <AutorenewIcon />, color: "#f9a825" },
  { label: "Acknowledged Returns", key: "acknowledged_returns", icon: <CheckCircleIcon />, color: "#388e3c" },
  { label: "Total Books in Library", key: "total_books_available", icon: <MenuBookIcon />, color: "#6a1b9a" },
];

const MemberOverview = () => {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const name = localStorage.getItem("userName");

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:8080/borrow/member-overview", {
          headers: {
            Authorization: token,
          },
        });
        setOverview(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch overview. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchOverview();
  }, []);

  if (loading) {
    return (
      <Box p={4} display="flex" justifyContent="center">
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={4}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box p={{ xs: 2, md: 4 }} sx={{ backgroundColor: "#f9f9f9", minHeight: "100vh" }}>
      <Typography variant="h4" fontWeight="bold" color="#1976d2" gutterBottom>
       💫 Welcome Back, Tejaswini! 
      </Typography>

      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
        Here’s a quick summary of your borrowing activity
      </Typography>

      {/* Stat Cards */}
      <Grid container spacing={3} sx={{ mb: 5 }}>
        {statCards.map((card) => (
          <Grid item xs={12} sm={6} md={4} key={card.key}>
            <Card
              sx={{
                display: "flex",
                alignItems: "center",
                px: 2,
                py: 3,
                borderRadius: 3,
                boxShadow: 4,
                bgcolor: "#fff",
                transition: "transform 0.2s",
                "&:hover": { transform: "translateY(-4px)" },
              }}
            >
              <Avatar
                sx={{
                  bgcolor: card.color,
                  mr: 2,
                  width: 56,
                  height: 56,
                }}
              >
                {card.icon}
              </Avatar>
              <Box>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  sx={{ fontSize: "0.9rem" }}
                >
                  {card.label}
                </Typography>
                <Typography variant="h6" fontWeight={700}>
                  {overview[card.key]}
                </Typography>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Recent Activity */}
      <Divider sx={{ mb: 3 }} />
      <Typography variant="h5" fontWeight={700} color="#1976d2" gutterBottom>
        📚 Recent Borrowed Books
      </Typography>

      {overview.recent_borrows?.length === 0 ? (
        <Typography color="text.secondary">No recent activity yet.</Typography>
      ) : (
        <Grid container spacing={3}>
          {overview.recent_borrows.map((record, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  borderLeft: "6px solid #1976d2",
                  px: 2,
                  py: 2,
                  borderRadius: 2,
                  boxShadow: 2,
                  bgcolor: "#fff",
                }}
              >
                <Typography variant="subtitle1" fontWeight={600}>
                  {record.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 0.5 }}
                >
                  Borrowed on: {dayjs(record.borrowed_at).format("DD MMM YYYY")}
                </Typography>
                <Chip
                  label="Borrowed"
                  size="small"
                  sx={{
                    mt: 1,
                    bgcolor: "#e3f2fd",
                    color: "#1976d2",
                    fontWeight: 500,
                  }}
                />
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default MemberOverview;
