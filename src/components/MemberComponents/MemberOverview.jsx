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

const statCards = [
  { label: "Total Borrowed", key: "total_borrowed", icon: <BookmarkAddedIcon />, color: "#3f51b5" },
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
  const name= localStorage.getItem("userName");

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
    <Box p={{ xs: 2, md: 4 }}>
      <Typography variant="h4" fontWeight={700} color="primary.main" gutterBottom>
       Hi {name} 👋 Welcome to Your Dashboard
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2, mb: 4 }}>
        {statCards.map((card) => (
          <Grid item xs={12} sm={6} md={4} key={card.key}>
            <Card
              sx={{
                display: "flex",
                alignItems: "center",
                px: 2,
                py: 3,
                borderRadius: 3,
                boxShadow: 3,
              }}
            >
              <Avatar
                sx={{
                  bgcolor: card.color,
                  mr: 2,
                  width: 48,
                  height: 48,
                }}
              >
                {card.icon}
              </Avatar>
              <Box>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  sx={{ fontSize: "0.85rem" }}
                >
                  {card.label}
                </Typography>
                <Typography variant="h6" fontWeight={600}>
                  {overview[card.key]}
                </Typography>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Recent Activity */}
      <Divider sx={{ mb: 4 }} />
      <Typography variant="h6" fontWeight={700} mb={2}>
        Recent Borrowed Books
      </Typography>

      {overview.recent_borrows?.length === 0 ? (
        <Typography color="text.secondary">No recent activity yet.</Typography>
      ) : (
        <Grid container spacing={3}>
          {overview.recent_borrows.map((record, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ px: 2, py: 2, borderLeft: "5px solid #1976d2" }}>
                <Typography variant="subtitle1" fontWeight={600}>
                  {record.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  Borrowed on: {dayjs(record.borrowed_at).format("DD MMM YYYY")}
                </Typography>
                <Chip
                  label="Borrowed"
                  size="small"
                  sx={{ mt: 1, bgcolor: "#e3f2fd", color: "#1976d2", fontWeight: 500 }}
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
