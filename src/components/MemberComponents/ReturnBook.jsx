import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Grid,
  CircularProgress,
  Alert,
} from "@mui/material";
import axios from "axios";

const ReturnBook = () => {
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [returning, setReturning] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const token = localStorage.getItem("token");

  const fetchBorrowHistory = async () => {
    try {
      const response = await axios.get("http://localhost:8080/borrow/history", {
        headers: {
          Authorization: `${token}`,
        },
      });
      const unreturnedBooks = response.data.filter((record) => !record.returned_at);
      setBorrowedBooks(unreturnedBooks);
    } catch (err) {
      setError("Failed to fetch borrow history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBorrowHistory();
  }, [token]);

  const handleReturn = async (bookId) => {
    setReturning(bookId);
    setError("");
    setSuccess("");

    try {
      await axios.post(
        "http://localhost:8080/borrow/return",
        { book_id: bookId },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      setSuccess("Book returned successfully");
     
      fetchBorrowHistory();
    } catch (err) {
      setError("Failed to return the book");
    } finally {
      setReturning(null);
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Return Borrowed Books
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      {borrowedBooks.length === 0 ? (
        <Typography>No unreturned books found.</Typography>
      ) : (
        <Grid container spacing={2}>
          {borrowedBooks.map((record) => (
            <Grid item xs={12} sm={6} md={4} key={record.id}>
              <Card>
                <CardMedia
                  component="img"
                  height="200"
                  image={`http://localhost:8080${record.book.image_url}`}
                  alt={record.book.title}
                />
                <CardContent>
                  <Typography variant="h6">{record.book.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Author: {record.book.author}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Genre: {record.book.genre}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Borrowed At: {new Date(record.borrowed_at).toLocaleString()}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2 }}
                    disabled={returning === record.book.id}
                    onClick={() => handleReturn(record.book.id)}
                  >
                    {returning === record.book.id ? "Returning..." : "Return"}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default ReturnBook;
