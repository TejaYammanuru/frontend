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
  Card,
  CardMedia,
  CardContent,
  Grid,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const Book = () => {
  const { bookId } = useParams();
  const [book, setBook] = useState(null);
  const [recommendedBooks, setRecommendedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [requestMessage, setRequestMessage] = useState({ type: "", text: "" });
  const [isRequested, setIsRequested] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
  window.scrollTo(0, 0);
}, [bookId]);


  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await fetch(`http://localhost:8080/books/${bookId}`);
        if (!response.ok) throw new Error("Failed to fetch book data");
        const data = await response.json();
        setBook(data);

        const token = localStorage.getItem("token");
        if (token) {
          const checkResponse = await fetch(`http://localhost:8080/borrow/check-request/${bookId}`, {
            headers: {
              Authorization: `${token}`,
            },
          });
          if (checkResponse.ok) {
            const checkData = await checkResponse.json();
            setIsRequested(checkData.hasRequested || false);
          }

          const allBooksResponse = await fetch(`http://localhost:8080/books/`, {
            headers: { Authorization: token },
          });
          if (allBooksResponse.ok) {
            const allBooks = await allBooksResponse.json();
            const filtered = allBooks.filter(
              (b) =>
                b.id !== parseInt(bookId) &&
                (b.author === data.author || b.genre === data.genre)
            );
            setRecommendedBooks(filtered);
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [bookId]);

  useEffect(() => {
    if (requestMessage.text) {
      const timer = setTimeout(() => {
        setRequestMessage({ type: "", text: "" });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [requestMessage]);

  const handleRequest = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setRequestMessage({ type: "error", text: "You must be logged in to request a book." });
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/borrow/request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify({ book_id: parseInt(bookId) }),
      });

      const data = await response.json();

      if (!response.ok) {
        setRequestMessage({ type: "error", text: data.error || "Request failed." });
      } else {
        setRequestMessage({ 
          type: "success", 
          text: data.message || "Book request submitted successfully"
        });
        setIsRequested(true);
      }
    } catch (err) {
      setRequestMessage({ type: "error", text: "Something went wrong." });
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
      {/* Book Info */}
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

      <Typography variant="h3" sx={{ textAlign: "center", fontWeight: 700, color: "#1f2937", mb: 2 }}>
        {book.title}
      </Typography>

      <Typography variant="h5" sx={{ textAlign: "center", color: "#6b7280", fontWeight: 400, mb: 1 }}>
        by {book.author}
      </Typography>

      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Chip label={book.genre} sx={{ backgroundColor: "#dbeafe", color: "#1e40af", fontWeight: 500 }} />
      </Box>

      {/* Description */}
      {book.description && (
        <>
          <Divider sx={{ my: 4, borderColor: "#e5e7eb" }} />
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ color: "#374151", fontWeight: 600, mb: 2 }}>
              Description
            </Typography>
            <Typography variant="body1" sx={{ color: "#4b5563", lineHeight: 1.6, textAlign: "justify" }}>
              {book.description}
            </Typography>
          </Box>
        </>
      )}

      {/* Book Details */}
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
        </Box>
      </Box>

      {/* Request Button */}
      <Divider sx={{ my: 4, borderColor: "#e5e7eb" }} />
      {requestMessage.text && (
        <Box sx={{ mb: 3 }}>
          <Alert severity={requestMessage.type} sx={{ borderRadius: 2 }}>
            {requestMessage.text}
          </Alert>
        </Box>
      )}

      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Button
          variant="contained"
          size="large"
          onClick={handleRequest}
          disabled={isRequested}
          sx={{
            backgroundColor: !isRequested ? "#2563eb" : "#9ca3af",
            color: "white",
            fontWeight: 600,
            fontSize: "1.1rem",
            px: 4,
            py: 1.5,
            borderRadius: 2,
            textTransform: "none",
            boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)",
            "&:hover": {
              backgroundColor: !isRequested ? "#1d4ed8" : "#9ca3af",
              boxShadow: "0 6px 16px rgba(37, 99, 235, 0.4)",
            },
          }}
        >
          {isRequested ? "Request Submitted" : "Request This Book"}
        </Button>
      </Box>

      {/* Recommended Books */}
      {recommendedBooks.length > 0 && (
        <>
          <Divider sx={{ my: 6, borderColor: "#e5e7eb" }} />
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: "#1e40af" }}>
            Recommended Books
          </Typography>
          <Grid container spacing={3}>
            {recommendedBooks.map((rec) => (
              <Grid item xs={12} sm={6} md={4} key={rec.id}
onClick={() => navigate(`/member/dashboard/books/${rec.id}`)}
sx={{ cursor: "pointer" }}>

                <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
                  <CardMedia
                    component="img"
                    image={`http://localhost:8080${rec.image_url}`}
                    alt={rec.title}
                    sx={{ height: 180, objectFit: "cover", borderRadius: "12px 12px 0 0" }}
                  />
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: "#1f2937" }}>
                      {rec.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#6b7280", mb: 1 }}>
                      by {rec.author}
                    </Typography>
                    <Chip label={rec.genre} size="small" sx={{ backgroundColor: "#dbeafe", color: "#1e40af" }} />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Box>
  );
};

export default Book;
