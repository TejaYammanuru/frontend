import React, { useEffect, useState } from "react";
import {
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Box,
  CircularProgress,
  Alert,
  LinearProgress,
  useTheme,
  Container,
} from "@mui/material";
import {
  LibraryBooks,
  MenuBook,
  Group,
  SupervisorAccount,
  HourglassTop,
  AssignmentReturn,
} from "@mui/icons-material";
import { alpha } from "@mui/system";
import axios from "axios";

const StatCard = ({ title, value, icon, color, max }) => {
  const theme = useTheme();
  const percent = max ? (value / max) * 100 : 100;

  return (
    <Card
      elevation={0}
      sx={{
        height: "100%",
        background: `linear-gradient(135deg, ${alpha(color, 0.1)} 0%, ${alpha(
          color,
          0.05
        )} 100%)`,
        border: `1px solid ${alpha(color, 0.2)}`,
        transition: "all 0.3s ease-in-out",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: `0 8px 25px ${alpha(color, 0.15)}`,
          border: `1px solid ${alpha(color, 0.3)}`,
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="h6" sx={{ color, fontWeight: 600, mb: 1 }}>
              {title}
            </Typography>
            <Typography
              variant="h4"
              sx={{ fontWeight: 700, color: theme.palette.text.primary, mb: 1 }}
            >
              {value}
            </Typography>
            {typeof max !== "undefined" && (
              <LinearProgress
                variant="determinate"
                value={percent}
                sx={{ height: 10, borderRadius: 5 }}
                color="primary"
              />
            )}
          </Box>
          <Avatar
            sx={{
              bgcolor: alpha(color, 0.1),
              color,
              width: 56,
              height: 56,
              border: `2px solid ${alpha(color, 0.2)}`,
            }}
          >
            {icon}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );
};

const LibrarianOverview = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const theme = useTheme();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("http://localhost:8080/borrow/lib-stats", {
          headers: { Authorization: token },
        });
        setStats(res.data);
      } catch (err) {
        setError("Failed to fetch dashboard data.");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [token]);

  if (loading) {
    return (
      <Box
        sx={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box mt={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", py: 4, background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.04)} 0%, ${alpha(theme.palette.secondary.main, 0.02)} 100%)` }}>
      <Container maxWidth="lg">
        <Typography variant="h4" fontWeight={700} color="#00897B" gutterBottom>
          📊 Librarian Dashboard Overview
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <StatCard icon={<LibraryBooks />} title="Total Books" value={stats.total_books} color="#00897B" />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <StatCard
              icon={<MenuBook />}
              title="Available Books"
              value={stats.available_books}
              max={stats.total_books}
              color="#43A047"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <StatCard icon={<Group />} title="Total Members" value={stats.total_members} color="#1E88E5" />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <StatCard icon={<SupervisorAccount />} title="Total Librarians" value={stats.total_librarians} color="#6D4C41" />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <StatCard
              icon={<HourglassTop />}
              title="Pending Borrow Requests"
              value={stats.pending_borrow_count}
              max={stats.total_members}
              color="#F9A825"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <StatCard
              icon={<AssignmentReturn />}
              title="Pending Return Acks"
              value={stats.pending_return_count}
              max={stats.total_members}
              color="#D32F2F"
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default LibrarianOverview;
