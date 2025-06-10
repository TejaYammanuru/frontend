import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Tabs,
  Tab,
  Snackbar,
  Alert,
  Grid,
} from "@mui/material";
import axios from "axios";

const ReturnBooks = () => {
  const [tab, setTab] = useState(0);
  const [notReturned, setNotReturned] = useState([]);
  const [returnPending, setReturnPending] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });

  const token = localStorage.getItem("token");

  const fetchData = async () => {
    try {
      const [notReturnedRes, returnPendingRes] = await Promise.all([
        axios.get("http://localhost:8080/borrow/not-returned-books", {
          headers: { Authorization: token },
        }),
        axios.get("http://localhost:8080/borrow/return-pending", {
          headers: { Authorization: token },
        }),
      ]);
      setNotReturned(Array.isArray(notReturnedRes.data) ? notReturnedRes.data : []);
      setReturnPending(Array.isArray(returnPendingRes.data) ? returnPendingRes.data : []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRequestReturn = async (borrowId) => {
    try {
      await axios.post(
        "http://localhost:8080/borrow/returnreq",
        { borrow_id: borrowId },
        { headers: { Authorization: token } }
      );
      setSnackbar({
        open: true,
        message: "Return request submitted",
        severity: "success",
      });
      fetchData();
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.error || "Error submitting return request",
        severity: "error",
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const renderBooks = (records, showRequestButton = false) => {
    if (!Array.isArray(records)) return null;

    return (
      <Grid container spacing={2}>
        {records.map((record) => (
          <Grid item xs={12} sm={6} md={4} key={record.id}>
            <Card sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
              <CardMedia
                component="img"
                height="160"
                image={`http://localhost:8080${record.book?.image_url || ""}`}
                alt={record.book?.title || "Book Cover"}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" color="primary">
                  {record.book?.title || "Unknown Title"}
                </Typography>
                <Typography variant="body2">Author: {record.book?.author || "Unknown"}</Typography>
                <Typography variant="body2">Genre: {record.book?.genre || "Unknown"}</Typography>
                <Typography variant="body2">
                  Borrowed: {new Date(record.borrowed_at).toLocaleString()}
                </Typography>
                {"days_left" in record && (
                  <Typography variant="body2" color="error">
                    Days Left: {record.days_left}
                  </Typography>
                )}
              </CardContent>
              {showRequestButton && (
                <Box px={2} pb={2}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    disabled={record.return_requested}
                    onClick={() => handleRequestReturn(record.id)}
                  >
                    {record.return_requested ? "Return Requested" : "Request Return"}
                  </Button>
                </Box>
              )}
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };

  return (
    <Box p={3}>
      <Typography variant="h5" color="primary" gutterBottom>
        Return Book Management
      </Typography>
      <Tabs
        value={tab}
        onChange={(_, newTab) => setTab(newTab)}
        textColor="primary"
        indicatorColor="primary"
      >
        <Tab label="📚 Borrowed Books" />
        <Tab label="🔄 Return Pending" />
      </Tabs>

      <Box mt={3}>
        {tab === 0 && renderBooks(notReturned, true)}
        {tab === 1 && renderBooks(returnPending, false)}
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ReturnBooks;
