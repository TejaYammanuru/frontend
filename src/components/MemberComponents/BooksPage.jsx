import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  TextField,
  InputAdornment,
  CircularProgress,
  Alert,
  IconButton,
} from "@mui/material";
import { Search, MenuBook, Person, ArrowForwardIos } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const BooksPage = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:8080/books/");
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setBooks(data);
        setFilteredBooks(data);
      } catch (err) {
        setError(`Failed to fetch books: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredBooks(books);
    } else {
      const filtered = books.filter((book) =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.genre.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredBooks(filtered);
    }
  }, [searchQuery, books]);

  const handleArrowClick = (e, bookId) => {
    e.stopPropagation(); 
    navigate(`/member/dashboard/books/${bookId}`);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={60} sx={{ color: "#1976d2" }} />
        <Typography variant="h6" sx={{ ml: 2, color: "#666" }}>
          Loading books...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ maxWidth: 600, mx: "auto", mt: 4, borderRadius: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
     
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            color: "#1976d2",
            fontWeight: 600,
            mb: 1,
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <MenuBook sx={{ fontSize: 36 }} />
          Browse Library
        </Typography>
        <Typography variant="body1" sx={{ color: "#555", fontSize: "1rem", mb: 3 }}>
          Find your next favorite book from our collection.
        </Typography>

        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search by title, author, or genre..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: "#1976d2" }} />
              </InputAdornment>
            ),
          }}
          sx={{
            maxWidth: 600,
            "& .MuiOutlinedInput-root": {
              borderRadius: 3,
              backgroundColor: "#fff",
              "&:hover fieldset": { borderColor: "#1976d2" },
              "&.Mui-focused fieldset": { borderColor: "#1976d2" },
            },
          }}
        />
      </Box>

     
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" sx={{ color: "#555" }}>
          {filteredBooks.length} book{filteredBooks.length !== 1 ? "s" : ""} found
          {searchQuery && ` for "${searchQuery}"`}
        </Typography>
      </Box>

     
      {filteredBooks.length === 0 ? (
        <Box
          sx={{
            textAlign: "center",
            py: 8,
            borderRadius: 3,
            border: "1px solid #e0e0e0",
            backgroundColor: "#f5f7fa",
          }}
        >
          <MenuBook sx={{ fontSize: 72, color: "#ccc", mb: 2 }} />
          <Typography variant="h6" sx={{ color: "#666", mb: 1 }}>
            No books found
          </Typography>
          <Typography variant="body2" sx={{ color: "#999" }}>
            Try a different keyword
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredBooks.map((book) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={book.id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 3,
                  border: "1px solid #e0e0e0",
                  backgroundColor: "#fff",
                  transition: "all 0.3s ease-in-out",
                  cursor: "default",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 8px 25px rgba(0,0,0,0.12)",
                    borderColor: "#1976d2",
                  },
                }}
              >
                <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                    height: 220,
                    overflow: "hidden",
                    "&:hover .arrowIcon": {
                      opacity: 1,
                      visibility: "visible",
                      transform: "translateX(0)",
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    image={
                      book.image_url
                        ? `http://localhost:8080${book.image_url}`
                        : "/api/placeholder/300/400"
                    }
                    alt={book.title}
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      backgroundColor: "#f2f2f2",
                    }}
                    onError={(e) => {
                      e.target.src = "/api/placeholder/300/400";
                    }}
                  />
                  
                  <IconButton
                    className="arrowIcon"
                    onClick={(e) => handleArrowClick(e, book.id)}
                    aria-label={`Go to details of ${book.title}`}
                    sx={{
                      position: "absolute",
                      bottom: 8,
                      right: 8,
                      color: "#1976d2",
                      bgcolor: "rgba(255, 255, 255, 0.9)",
                      borderRadius: "50%",
                      padding: "6px",
                      fontSize: 24,
                      opacity: 0,
                      visibility: "hidden",
                      transform: "translateX(10px)",
                      transition:
                        "opacity 0.3s ease, visibility 0.3s ease, transform 0.3s ease",
                      "&:hover": {
                        bgcolor: "#1976d2",
                        color: "#fff",
                        transform: "translateX(0) scale(1.1)",
                      },
                      cursor: "pointer",
                    }}
                  >
                    <ArrowForwardIos fontSize="small" />
                  </IconButton>
                </Box>

                <CardContent sx={{ flexGrow: 1, p: 2, cursor: "default" }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      mb: 0.5,
                      fontSize: "1.1rem",
                      color: "#222",
                      overflow: "hidden",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {book.title}
                  </Typography>

                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Person sx={{ fontSize: 16, color: "#888", mr: 0.5 }} />
                    <Typography variant="body2" sx={{ color: "#666", fontSize: "0.9rem" }}>
                      {book.author}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default BooksPage;
