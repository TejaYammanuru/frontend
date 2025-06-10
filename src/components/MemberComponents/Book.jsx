import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Divider,
  Chip,
} from "@mui/material";

const Book = () => {
  const { bookId } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [borrowMessage, setBorrowMessage] = useState({ type: "", text: "" });
  const [isBorrowed, setIsBorrowed] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await fetch(`http://localhost:8080/books/${bookId}`);
        if (!response.ok) throw new Error("Failed to fetch book data");
        const data = await response.json();
        setBook(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [bookId]);

  
  useEffect(() => {
    if (borrowMessage.text) {
      const timer = setTimeout(() => {
        setBorrowMessage({ type: "", text: "" });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [borrowMessage]);

  const handleBorrow = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setBorrowMessage({ type: "error", text: "You must be logged in to borrow a book." });
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/borrow/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify({ book_id: parseInt(bookId) }),
      });

      const data = await response.json();

      if (!response.ok) {
        setBorrowMessage({ type: "error", text: data.error || "Borrowing failed." });
      } else {
        setBorrowMessage({ type: "success", text: data.message });
        setIsBorrowed(true);
        setBook((prev) => ({
          ...prev,
          copies_available: prev.copies_available - 1,
        }));
      }
    } catch (err) {
      setBorrowMessage({ type: "error", text: "Something went wrong." });
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress size={50} sx={{ color: "#2563eb" }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ maxWidth: 600, mx: "auto", mt: 6, px: 3 }}>
        <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", py: 6, px: 3 }}>
     
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Box
          component="img"
          src={`http://localhost:8080${book.image_url}`}
          alt={book.title}
          sx={{
            maxWidth: 280,
            width: "100%",
            height: "auto",
            borderRadius: 3,
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
            mb: 3,
          }}
        />
      </Box>

      
      <Typography
        variant="h3"
        sx={{
          textAlign: "center",
          fontWeight: 700,
          color: "#1f2937",
          mb: 2,
          fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
          lineHeight: 1.2,
        }}
      >
        {book.title}
      </Typography>

      <Typography
        variant="h5"
        sx={{
          textAlign: "center",
          color: "#6b7280",
          fontWeight: 400,
          mb: 1,
          fontSize: { xs: "1.2rem", sm: "1.5rem" },
        }}
      >
        by {book.author}
      </Typography>

     
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Chip
          label={book.genre}
          sx={{
            backgroundColor: "#dbeafe",
            color: "#1e40af",
            fontWeight: 500,
            fontSize: "0.9rem",
            height: 32,
          }}
        />
      </Box>

      {/* Description Section */}
      {book.description && (
        <>
          <Divider sx={{ my: 4, borderColor: "#e5e7eb" }} />
          
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ color: "#374151", fontWeight: 600, mb: 2 }}>
              Description
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: "#4b5563", 
                lineHeight: 1.6,
                fontSize: "1rem",
                textAlign: "justify"
              }}
            >
              {book.description}
            </Typography>
          </Box>
        </>
      )}

      <Divider sx={{ my: 4, borderColor: "#e5e7eb" }} />

     
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ color: "#374151", fontWeight: 600, mb: 3 }}>
          Book Details
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography sx={{ color: "#6b7280", fontWeight: 500, minWidth: 140 }}>
              Published:
            </Typography>
            <Typography sx={{ color: "#374151" }}>
              {new Date(book.publication_date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography sx={{ color: "#6b7280", fontWeight: 500, minWidth: 140 }}>
              Availability:
            </Typography>
            <Typography sx={{
              color: book.copies_available > 0 ? "#059669" : "#dc2626",
              fontWeight: 600,
            }}>
              {book.copies_available} of {book.total_copies} copies available
            </Typography>
          </Box>

          {/* Overdue Days Section */}
          {book.overdue_days !== undefined && (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography sx={{ color: "#6b7280", fontWeight: 500, minWidth: 140 }}>
                Overdue Status:
              </Typography>
              <Typography sx={{
                color: book.overdue_days > 0 ? "#dc2626" : "#059669",
                fontWeight: 600,
              }}>
                {book.overdue_days > 0 
                  ? `${book.overdue_days} days overdue`
                  : "Not overdue"
                }
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

      <Divider sx={{ my: 4, borderColor: "#e5e7eb" }} />

      
      {borrowMessage.text && (
        <Box sx={{ mb: 3 }}>
          <Alert severity={borrowMessage.type} sx={{ borderRadius: 2 }}>
            {borrowMessage.text}
          </Alert>
        </Box>
      )}

     
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Button
          variant="contained"
          size="large"
          onClick={handleBorrow}
          disabled={book.copies_available === 0 || isBorrowed}
          sx={{
            backgroundColor: (book.copies_available > 0 && !isBorrowed) ? "#2563eb" : "#9ca3af",
            color: "white",
            fontWeight: 600,
            fontSize: "1.1rem",
            px: 4,
            py: 1.5,
            borderRadius: 2,
            textTransform: "none",
            boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)",
            "&:hover": {
              backgroundColor: (book.copies_available > 0 && !isBorrowed) ? "#1d4ed8" : "#9ca3af",
              boxShadow: "0 6px 16px rgba(37, 99, 235, 0.4)",
            },
          }}
        >
          {isBorrowed
            ? "Borrowed"
            : book.copies_available > 0
            ? "Borrow This Book"
            : "Currently Unavailable"}
        </Button>
      </Box>
    </Box>
  );
};

export default Book;