import React, { useEffect, useState } from "react";
import {
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import axios from "axios";

const ReturnAcknowledgement = () => {
  const [records, setRecords] = useState([]);
  const [snack, setSnack] = useState({ open: false, message: "", severity: "success" });
  const [loading, setLoading] = useState(true);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:8080/borrow/all-return-pending", {
        headers: { Authorization: localStorage.getItem("token") },
      });
      setRecords(res.data);
    } catch (err) {
      console.error("Failed to fetch return-pending records", err);
      setSnack({ open: true, message: "Failed to load data", severity: "error" });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleAcknowledge = async (borrowId) => {
    try {
      await axios.post(
        "http://localhost:8080/borrow/returnack",
        { borrow_id: borrowId },
        {
          headers: { Authorization: localStorage.getItem("token") },
        }
      );
      setSnack({ open: true, message: "Return acknowledged", severity: "success" });
      fetchRecords();
    } catch (err) {
      console.error("Acknowledge failed", err);
      setSnack({ open: true, message: "Acknowledgement failed", severity: "error" });
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <Typography variant="h4" fontWeight={600} sx={{ color: '#00897B' }} mb={3}>
            Pending Return Acknowledgements
           </Typography>

      {loading ? (
        <CircularProgress />
      ) : records.length === 0 ? (
        <Typography>No return requests to acknowledge.</Typography>
      ) : (
        <Grid container spacing={2}>
          {records.map((record) => (
            <Grid item xs={12} sm={6} md={4} key={record.id}>
              <Card elevation={3}>
                <CardContent>
                  <img
                    src={`http://localhost:8080${record.book.image_url}`}
                    alt={record.book.title}
                    style={{
                      width: "100%",
                      height: "180px",
                      objectFit: "cover",
                      marginBottom: "1rem",
                    }}
                  />
                  <Typography variant="h6" gutterBottom>
                    {record.book.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <strong>Author:</strong> {record.book.author}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <strong>Borrowed By:</strong> {record.user.name} ({record.user.email})
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <strong>Borrowed At:</strong>{" "}
                    {new Date(record.borrowed_at).toLocaleString()}
                  </Typography>

                  <Button
                    variant="contained"
                    fullWidth
                    sx={{ marginTop: "1rem", backgroundColor: "#00897B" }}
                    onClick={() => handleAcknowledge(record.id)}
                  >
                    Acknowledge Return
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Snackbar */}
      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={() => setSnack({ ...snack, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={snack.severity} sx={{ width: "100%" }}>
          {snack.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ReturnAcknowledgement;
