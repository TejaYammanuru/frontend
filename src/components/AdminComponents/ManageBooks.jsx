import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Snackbar,
  Tooltip,
  Alert,
  InputAdornment,
  Grid,
  Card,
  CardMedia,
  MenuItem,
  Chip,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Edit, Delete, Add, Search, Clear, CloudUpload, Schedule, Download } from "@mui/icons-material";
import axios from "axios";
import { getGridNumericOperators } from '@mui/x-data-grid';

const PRIMARY_COLOR = "#3F51B5";
const PRIMARY_HOVER = "#364494";

const ManageBooks = () => {
  const genreOptions = [
    "Fiction",
    "Non-Fiction",
    "Science Fiction",
    "Fantasy",
    "Mystery",
    "Biography",
    "Romance",
    "Horror",
    "Self-Help",
    "History",
  ];

  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [allBooks, setAllBooks] = useState([]); // For CSV export - stores all books
  const [searchTerm, setSearchTerm] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [totalRows, setTotalRows] = useState(0);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    description: "",
    genre: "",
    publication_date: "",
    total_copies: 0,
    copies_available: 0,
    overdue_days: 15,
    image_url: "",
  });
  const [imagePreview, setImagePreview] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const fetchBooks = async (page = 0, pageSize = 10) => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8080/books/`, {
        params: {
          page: page + 1, // Backend expects 1-based pagination
          page_size: pageSize,
        },
      });
      
      setBooks(response.data.data || []);
      setTotalRows(response.data.total || 0);
      
      // Apply search filter to the fetched data
      if (!searchTerm.trim()) {
        setFilteredBooks(response.data.data || []);
      } else {
        const filtered = (response.data.data || []).filter((book) =>
          book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.genre.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredBooks(filtered);
      }
    } catch (error) {
      console.error("Error fetching books:", error);
      setSnackbar({ open: true, message: "Failed to load books", severity: "error" });
      setBooks([]);
      setFilteredBooks([]);
      setTotalRows(0);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all books for CSV export
  const fetchAllBooks = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/books/`, {
        params: {
          page: 1,
          page_size: 1000, // Get a large number of books for export
        },
      });
      setAllBooks(response.data.data || []);
    } catch (error) {
      console.error("Error fetching all books:", error);
      setAllBooks([]);
    }
  };

  useEffect(() => {
    fetchBooks(paginationModel.page, paginationModel.pageSize);
  }, [paginationModel]);

  useEffect(() => {
    fetchAllBooks(); // Fetch all books once for CSV export
  }, []);

  useEffect(() => {
    // Apply search filter when search term changes
    if (!searchTerm.trim()) {
      setFilteredBooks(books);
    } else {
      setFilteredBooks(
        books.filter((book) =>
          book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.genre.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, books]);

  const handlePaginationModelChange = (newModel) => {
    setPaginationModel(newModel);
  };

  // CSV Export Function
  const handleExportCSV = () => {
    try {
      const booksToExport = searchTerm.trim() ? 
        allBooks.filter((book) =>
          book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.genre.toLowerCase().includes(searchTerm.toLowerCase())
        ) : allBooks;

      // Define CSV headers
      const headers = [
        'ID', 'Title', 'Author', 'Genre', 'Description', 
        'Publication Date', 'Total Copies', 'Available Copies', 
        'Return Period (Days)'
      ];
      
      // Convert data to CSV format
      const csvContent = [
        headers.join(','), // Header row
        ...booksToExport.map(book => [
          book.id,
          `"${book.title.replace(/"/g, '""')}"`, // Escape quotes in title
          `"${book.author.replace(/"/g, '""')}"`, // Escape quotes in author
          `"${book.genre}"`,
          `"${(book.description || '').replace(/"/g, '""')}"`, // Handle description
          new Date(book.publication_date).toLocaleDateString(),
          book.total_copies,
          book.copies_available,
          book.overdue_days || 14
        ].join(','))
      ].join('\n');

      // Create blob and download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `books_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      setSnackbar({ 
        open: true, 
        message: `${booksToExport.length} books exported successfully`, 
        severity: "success" 
      });
    } catch (error) {
      console.error("Error exporting CSV:", error);
      setSnackbar({ 
        open: true, 
        message: "Failed to export CSV", 
        severity: "error" 
      });
    }
  };

  const handleOpenAdd = () => {
    setEditingBook(null);
    setFormData({
      title: "",
      author: "",
      description: "",
      genre: "",
      publication_date: "",
      total_copies: 0,
      copies_available: 0,
      overdue_days: 15,
      image_url: "",
    });
    setImagePreview("");
    setOpenDialog(true);
  };

  const handleEditBook = (book) => {
    const rawDate = new Date(book.publication_date);
    const formattedDate = rawDate.toISOString().slice(0, 10); // yyyy-mm-dd

    setEditingBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      description: book.description || "",
      genre: book.genre,
      publication_date: formattedDate,
      total_copies: book.total_copies,
      copies_available: book.copies_available,
      overdue_days: book.overdue_days || 14,
      image_url: book.image_url,
    });
    setImagePreview(book.image_url ? `http://localhost:8080${book.image_url}` : "");
    setOpenDialog(true);
  };

  const handleDeleteBook = async (bookId) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      try {
        const token = localStorage.getItem("token");
        const config = {
          headers: {
            Authorization: token ? `${token}` : "",
          },
        };

        await axios.delete(`http://localhost:8080/books/${bookId}`, config);
        setSnackbar({ open: true, message: "Book deleted successfully", severity: "success" });
        await fetchBooks(paginationModel.page, paginationModel.pageSize);
        await fetchAllBooks(); // Refresh all books for export
      } catch (error) {
        console.error("Error deleting book:", error);
        setSnackbar({ open: true, message: "Failed to delete book", severity: "error" });
      }
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingBook(null);
    setImagePreview("");
    setFormData({
      title: "",
      author: "",
      description: "",
      genre: "",
      publication_date: "",
      total_copies: 0,
      copies_available: 0,
      overdue_days: 15,
      image_url: "",
    });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setSnackbar({ open: true, message: "Please select a valid image file", severity: "error" });
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setSnackbar({ open: true, message: "Image size should be less than 5MB", severity: "error" });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prevData) => ({ ...prevData, image_url: reader.result }));
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setSnackbar({ open: true, message: "Title is required", severity: "error" });
      return false;
    }
    if (!formData.author.trim()) {
      setSnackbar({ open: true, message: "Author is required", severity: "error" });
      return false;
    }
    if (!formData.genre.trim()) {
      setSnackbar({ open: true, message: "Genre is required", severity: "error" });
      return false;
    }
    if (formData.total_copies < 0) {
      setSnackbar({ open: true, message: "Total copies cannot be negative", severity: "error" });
      return false;
    }
    if (formData.overdue_days <= 0) {
      setSnackbar({ open: true, message: "Overdue days must be greater than 0", severity: "error" });
      return false;
    }

    return true;
  };

  const handleFormSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: token ? `${token}` : "",
          "Content-Type": "application/json",
        },
      };

      const cleanedFormData = {
        ...formData,
        publication_date: formData.publication_date || new Date().toISOString().slice(0, 10),
        total_copies: Number(formData.total_copies),
        copies_available: Number(formData.total_copies),
        overdue_days: Number(formData.overdue_days),
      };

      if (editingBook) {
        await axios.put(`http://localhost:8080/books/${editingBook.id}`, cleanedFormData, config);
        setSnackbar({ open: true, message: "Book updated successfully", severity: "success" });
      } else {
        await axios.post("http://localhost:8080/books/", cleanedFormData, config);
        setSnackbar({ open: true, message: "Book added successfully", severity: "success" });
      }

      await fetchBooks(paginationModel.page, paginationModel.pageSize);
      await fetchAllBooks(); // Refresh all books for export
      handleCloseDialog();
    } catch (error) {
      console.error("Error saving book:", error);
      const errorMessage = error.response?.data?.message || "Failed to save book";
      setSnackbar({ open: true, message: errorMessage, severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  const getOverdueDaysChip = (overdueDays) => {
    let color = "success";
    let label = `${overdueDays} days`;
    
    if (overdueDays <= 7) {
      color = "error";
    } else if (overdueDays <= 14) {
      color = "warning";
    }
    
    return (
      <Chip
        icon={<Schedule />}
        label={label}
        color={color}
        size="small"
        variant="outlined"
      />
    );
  };

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    {
      field: "image_url",
      headerName: "Image",
      width: 100,
      sortable: false,
      filterable: false,
      disableColumnMenu: true, 
      renderCell: (params) =>
        params.value ? (
          <img
            src={`http://localhost:8080${params.value}`}
            alt="Book cover"
            style={{
              width: 50,
              height: 60,
              objectFit: "cover",
              borderRadius: 4,
              border: "1px solid #ccc",
            }}
            onError={(e) => {
              e.target.src = "/placeholder-book.png";
              e.target.alt = "No image";
            }}
          />
        ) : (
          <Box
            sx={{
              width: 50,
              height: 60,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#f5f5f5",
              borderRadius: 1,
              border: "1px solid #ccc",
              fontSize: "12px",
              color: "#666",
            }}
          >
            No Image
          </Box>
        ),
    },
    { field: "title", headerName: "Title", flex: 1, minWidth: 100 },
    { field: "author", headerName: "Author", flex: 1, minWidth: 100 },
    { field: "genre", headerName: "Genre", flex: 0.8, minWidth: 120 },
    {
      field: "publication_date",
      headerName: "Published",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => {
        const date = new Date(params.value);
        return date.toLocaleDateString();
      },
    },
    { field: "total_copies", headerName: "Total", width: 80, filterOperators: getGridNumericOperators() },
    { field: "copies_available", headerName: "Available", width: 90, filterOperators: getGridNumericOperators() },
    {
      field: "overdue_days",
      headerName: "Return Period",
      width: 130,
      filterOperators: getGridNumericOperators(),
      renderCell: (params) => getOverdueDaysChip(params.value || 14),
    },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      filterable: false,
      disableColumnMenu: true, 
      renderCell: (params) => (
        <Box>
          <Tooltip title="Edit Book">
            <IconButton
              onClick={() => handleEditBook(params.row)}
              sx={{ color: PRIMARY_COLOR }}
              size="small"
            >
              <Edit />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Book">
            <IconButton
              onClick={() => handleDeleteBook(params.row.id)}
              sx={{ color: "#d32f2f" }}
              size="small"
            >
              <Delete />
            </IconButton>
          </Tooltip>
        </Box>
      ),
      width: 120,
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      {/* Header + Buttons */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight={600} color={PRIMARY_COLOR}>
          Manage Books
        </Typography>
        <Box display="flex" gap={1}>
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={handleExportCSV}
            disabled={allBooks.length === 0}
            sx={{ 
              borderColor: PRIMARY_COLOR, 
              color: PRIMARY_COLOR,
              "&:hover": {
                borderColor: PRIMARY_HOVER,
                backgroundColor: "rgba(63, 81, 181, 0.04)"
              }
            }}
          >
            Export CSV
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleOpenAdd}
            sx={{
              backgroundColor: PRIMARY_COLOR,
              "&:hover": { backgroundColor: PRIMARY_HOVER },
              borderRadius: 2,
              px: 3,
            }}
          >
            Add New Book
          </Button>
        </Box>
      </Box>

      {/* Search Bar */}
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search books by title, author, or genre..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search sx={{ color: PRIMARY_COLOR }} />
            </InputAdornment>
          ),
          endAdornment: searchTerm && (
            <InputAdornment position="end">
              <IconButton onClick={() => setSearchTerm("")} size="small">
                <Clear />
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{ mb: 3, backgroundColor: "#fff", borderRadius: 2 }}
      />

      {/* Book Table */}
      <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
        <DataGrid
          rows={filteredBooks}
          columns={columns}
          autoHeight
          loading={loading}
          disableRowSelectionOnClick
          paginationMode="server"
          rowCount={totalRows}
          paginationModel={paginationModel}
          onPaginationModelChange={handlePaginationModelChange}
          sx={{
            border: 0,
            "& .MuiDataGrid-cell": { borderBottom: "1px solid #f0f0f0" },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#f8f9fa",
              fontWeight: 600,
            },
          }}
          getRowId={(row) => row.id}
          pageSizeOptions={[5, 10, 25, 50]}
        />
      </Card>

      {/* Book Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="md">
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h5" fontWeight={600}>
            {editingBook ? "Edit Book" : "Add New Book"}
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Grid container spacing={20}>
            <Grid item xs={12} md={8}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField
                  label="Book Title"
                  name="title"
                  value={formData.title}
                  onChange={handleFormChange}
                  fullWidth
                  required
                  sx={{mt:2}}
                />
                <TextField
                  label="Author"
                  name="author"
                  value={formData.author}
                  onChange={handleFormChange}
                  fullWidth
                  required
                />
                <TextField
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  fullWidth
                  multiline
                  rows={3}
                  placeholder="Enter book description..."
                />
                <TextField
                  select
                  label="Genre"
                  name="genre"
                  value={formData.genre}
                  onChange={handleFormChange}
                  fullWidth
                  required
                >
                  {genreOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  label="Publication Date"
                  name="publication_date"
                  type="date"
                  value={formData.publication_date}
                  onChange={handleFormChange}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  label="Total Copies"
                  name="total_copies"
                  type="number"
                  value={formData.total_copies}
                  onChange={handleFormChange}
                  fullWidth
                  inputProps={{ min: 0 }}
                />
                <TextField
                  label="Return Period (Days)"
                  name="overdue_days"
                  type="number"
                  value={formData.overdue_days}
                  onChange={handleFormChange}
                  fullWidth
                  required
                  inputProps={{ min: 1 }}
                  helperText="Number of days members have to return the book before it becomes overdue"
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2, alignItems: "center" }}>
                {imagePreview && (
                  <Card sx={{ width: "100%", maxWidth: 200 }}>
                    <CardMedia
                      component="img"
                      image={imagePreview}
                      alt="Book preview"
                      sx={{ height: 240, objectFit: "cover" }}
                    />
                  </Card>
                )}
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<CloudUpload />}
                  sx={{
                    mt:2,
                    width: "100%",
                    color: PRIMARY_COLOR,
                    borderColor: PRIMARY_COLOR,
                    "&:hover": {
                      borderColor: PRIMARY_HOVER,
                      color: PRIMARY_HOVER,
                    },
                  }}
                >
                  {imagePreview ? "Change Image" : "Upload Image"}
                  <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
                </Button>
                <Typography variant="caption" color="text.secondary" textAlign="center">
                  Supported formats: JPG, PNG, GIF<br />
                  Max size: 5MB
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button onClick={handleCloseDialog} color="inherit">
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleFormSubmit}
            disabled={loading}
            sx={{
              backgroundColor: PRIMARY_COLOR,
              "&:hover": { backgroundColor: PRIMARY_HOVER },
              minWidth: 100,
            }}
          >
            {loading ? "Saving..." : editingBook ? "Update Book" : "Add Book"}
          </Button>
        </DialogActions>
      </Dialog>

     
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
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ManageBooks;