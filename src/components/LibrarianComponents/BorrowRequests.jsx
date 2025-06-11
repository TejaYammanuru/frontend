import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";
import axios from "axios";

const BorrowRequests = () => {
  const [requests, setRequests] = useState([]);
  const [openRejectDialog, setOpenRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [snack, setSnack] = useState({ open: false, message: "", severity: "success" });

  const fetchRequests = async () => {
    try {
      const res = await axios.get("http://localhost:8080/borrow/get-requests", {
        headers: { Authorization: localStorage.getItem("token") },
      });
      setRequests(res.data);
    } catch (err) {
      console.error("Failed to fetch requests", err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApprove = async (requestId) => {
    try {
      await axios.post(
        "http://localhost:8080/borrow/approve",
        { request_id: requestId },
        {
          headers: { Authorization: localStorage.getItem("token") },
        }
      );
      setSnack({ open: true, message: "Request approved", severity: "success" });
      fetchRequests();
    } catch (err) {
      console.error("Approve failed", err);
      setSnack({ open: true, message: "Approval failed", severity: "error" });
    }
  };

  const handleOpenReject = (requestId) => {
    setSelectedRequestId(requestId);
    setRejectReason("");
    setOpenRejectDialog(true);
  };

  const handleReject = async () => {
    try {
      await axios.post(
        "http://localhost:8080/borrow/reject",
        {
          request_id: selectedRequestId,
          reason: rejectReason,
        },
        {
          headers: { Authorization: localStorage.getItem("token") },
        }
      );
      setSnack({ open: true, message: "Request rejected", severity: "info" });
      setOpenRejectDialog(false);
      fetchRequests();
    } catch (err) {
      console.error("Reject failed", err);
      setSnack({ open: true, message: "Rejection failed", severity: "error" });
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <Typography variant="h4" fontWeight={600} sx={{ color: '#00897B' }} mb={3}>
             Pending Borrow Requests
           </Typography>

      <Grid container spacing={2}>
        {requests.map((req) => (
          <Grid item xs={12} sm={6} md={4} key={req.id}>
            <Card elevation={3}>
              <CardContent>
                <img
                  src={`http://localhost:8080${req.book.image_url}`}
                  alt={req.book.title}
                  style={{ width: "100%", height: "180px", objectFit: "cover", marginBottom: "1rem" }}
                />
                <Typography variant="h6" gutterBottom>{req.book.title}</Typography>
                <Typography variant="body2" color="textSecondary">
                  <strong>Author:</strong> {req.book.author}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <strong>Genre:</strong> {req.book.genre}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <strong>Requested By:</strong> {req.user.name} ({req.user.email})
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <strong>Requested At:</strong> {new Date(req.requested_at).toLocaleString()}
                </Typography>

                <Grid container spacing={1} mt={2}>
                  <Grid item xs={6}>
                    <Button
                      variant="contained"
                      fullWidth
                      sx={{ backgroundColor: "#00897B", color: "#fff", "&:hover": { backgroundColor: "#00695c" } }}
                      onClick={() => handleApprove(req.id)}
                    >
                      Approve
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button
                      variant="outlined"
                      fullWidth
                      color="error"
                      onClick={() => handleOpenReject(req.id)}
                    >
                      Reject
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

     
      <Dialog
  open={openRejectDialog}
  onClose={() => setOpenRejectDialog(false)}
  fullWidth
  maxWidth="sm" // You can use "md" for even more width
  PaperProps={{
    sx: {
      width: "600px", // You can increase this if needed
    },
  }}
>
  <DialogTitle sx={{ mb: 2 }}>Reject Request</DialogTitle>

  <DialogContent sx={{ pt: 0 }}>
    <TextField
      label="Rejection Reason"
      multiline
      rows={6}
      fullWidth
      value={rejectReason}
      onChange={(e) => setRejectReason(e.target.value)}
      sx={{
        mt: 1,
      }}
      variant="outlined"
    />
  </DialogContent>

  <DialogActions>
    <Button onClick={() => setOpenRejectDialog(false)}>Cancel</Button>
    <Button
      variant="contained"
      color="error"
      onClick={handleReject}
      disabled={!rejectReason.trim()}
    >
      Submit
    </Button>
  </DialogActions>
</Dialog>


      {/* Snackbar on top */}
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

export default BorrowRequests;
