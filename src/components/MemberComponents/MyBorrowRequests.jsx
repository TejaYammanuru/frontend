import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  CircularProgress,
  Alert,
} from "@mui/material";
import axios from "axios";

const statusColor = {
  pending: "warning",
  approved: "success",
  rejected: "error",
};

const MyBorrowRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:8080/borrow/status", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRequests(res.data);
      } catch (err) {
        setError("Failed to fetch borrow requests");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  return (
    <Box p={3}>
      <Typography variant="h5" fontWeight={600} color="#1976d2" gutterBottom>
        📩 My Borrow Requests
      </Typography>

      {loading ? (
        <Box mt={4} display="flex" justifyContent="center">
          <CircularProgress color="primary" />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : requests.length === 0 ? (
        <Alert severity="info">No borrow requests found.</Alert>
      ) : (
        <Grid container spacing={2}>
          {requests.map((req) => (
            <Grid item xs={12} md={6} key={req.id}>
              <Card variant="outlined" sx={{ borderLeft: `6px solid #1976d2` }}>
                <CardContent>
                  <Typography variant="h6" fontWeight={500}>
                    📚 {req.book.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Author: {req.book.author}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Genre: {req.book.genre}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Requested At: {new Date(req.requested_at).toLocaleString()}
                  </Typography>

                  <Box mt={1}>
                    <Chip
                      label={req.status.toUpperCase()}
                      color={statusColor[req.status]}
                      size="small"
                      sx={{ fontWeight: 600 }}
                    />
                  </Box>

                  {req.status === "rejected" && req.rejection_reason && (
                    <Typography
                      variant="body2"
                      color="error"
                      mt={1}
                      fontStyle="italic"
                    >
                      ❗ Reason: {req.rejection_reason}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default MyBorrowRequests;
