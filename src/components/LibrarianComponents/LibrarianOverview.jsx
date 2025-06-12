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
  Tooltip,
  Divider,
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
import { PieChart, Pie, Cell, Tooltip as RechartTooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#00897B", "#43A047", "#1E88E5", "#F9A825", "#D32F2F", "#6D4C41"];

const StatCard = ({ title, value, icon, color, max }) => {
  const theme = useTheme();
  const percent = max ? (value / max) * 100 : 100;

  return (
    <Card
      elevation={2}
      sx={{
        height: "100%",
        background: `linear-gradient(135deg, ${alpha(color, 0.08)} 0%, ${alpha(
          color,
          0.03
        )} 100%)`,
        border: `1px solid ${alpha(color, 0.2)}`,
        borderRadius: 4,
        transition: "all 0.3s ease-in-out",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: `0 8px 25px ${alpha(color, 0.15)}`,
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Tooltip title={title}>
              <Typography variant="subtitle2" sx={{ color, fontWeight: 600, mb: 0.5 }}>
                {title}
              </Typography>
            </Tooltip>
            <Typography
              variant="h5"
              sx={{ fontWeight: 700, color: theme.palette.text.primary, mb: 1 }}
            >
              {value}
            </Typography>
            {typeof max !== "undefined" && (
              <LinearProgress
                variant="determinate"
                value={percent}
                sx={{ height: 8, borderRadius: 5 }}
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
  const name = localStorage.getItem("userName");

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

  const pieData = [
    { name: "Available", value: stats.available_books },
    { name: "Borrowed", value: stats.total_books - stats.available_books },
  ];

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f5f7fa", py: 4 }}>
      <Container maxWidth="lg">
        <Typography variant="h4" fontWeight={700} color="#00897B" gutterBottom>
         Welcome Back, {name}!
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }} color="#00897B">
          Key Metrics Overview
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

        {/* <Box mt={5}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            📘 Book Availability Distribution
          </Typography>
          <Card sx={{ p: 2, maxWidth: 400 }}>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
                <RechartTooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Box> */}
      </Container>
    </Box>
  );
};

export default LibrarianOverview;
