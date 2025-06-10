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
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Edit, Delete, Add, Search, Clear } from "@mui/icons-material";
import axios from "axios";

const ManageLibrarians = () => {
  const [librarians, setLibrarians] = useState([]);
  const [filteredLibrarians, setFilteredLibrarians] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [editingLibrarian, setEditingLibrarian] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, librarian: null });

  useEffect(() => {
    const fetchLibrarians = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:8080/borrow/librarians", {
          headers: {
            Authorization: `${token}`,
          },
        });

        const filtered = response.data.filter((lib) =>
          lib.name.toLowerCase().includes("librarian")
        );

        const formatted = filtered.map((lib) => ({
          id: lib.id,
          name: lib.name,
          email: lib.email,
        }));

        setLibrarians(formatted);
        setFilteredLibrarians(formatted);
      } catch (error) {
        console.error("Error fetching librarians:", error);
        setSnackbar({ open: true, message: "Failed to load librarians", severity: "error" });
      }
    };

    fetchLibrarians();
  }, []);

  
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredLibrarians(librarians);
    } else {
      const filtered = librarians.filter((librarian) =>
        librarian.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        librarian.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredLibrarians(filtered);
    }
  }, [searchTerm, librarians]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  const handleOpenAdd = () => {
    setEditingLibrarian(null);
    setFormData({ name: "", email: "", password: "" });
    setOpenDialog(true);
  };

  const handleOpenEdit = (librarian) => {
    setEditingLibrarian(librarian);
    setFormData({ name: librarian.name, email: librarian.email, password: "" });
    setOpenDialog(true);
  };

  const handleDeleteClick = (librarian) => {
    setDeleteDialog({ open: true, librarian });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.librarian) return;

    try {
      const token = localStorage.getItem("token");
      console.log("Deleting librarian with token:", token);
      
      await axios.delete(
        `http://localhost:3001/signup/${deleteDialog.librarian.id}`,
        {
          headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      
      setLibrarians((prev) => prev.filter((lib) => lib.id !== deleteDialog.librarian.id));
      setSnackbar({ open: true, message: "Librarian deleted successfully", severity: "success" });
      setDeleteDialog({ open: false, librarian: null });
    } catch (error) {
      console.error("Error deleting librarian:", error);
      const errorMsg =
        error.response?.data?.errors?.join(", ") || 
        error.response?.data?.message || 
        "Failed to delete librarian";
      setSnackbar({ open: true, message: errorMsg, severity: "error" });
      setDeleteDialog({ open: false, librarian: null });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, librarian: null });
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || (!editingLibrarian && !formData.password)) return;

    if (editingLibrarian) {
     
      try {
        const token = localStorage.getItem("token");
        console.log("Updating librarian with token:", token);
        
        const response = await axios.put(
          `http://localhost:3001/signup/${editingLibrarian.id}`,
          {
            user: {
              name: formData.name,
              email: formData.email,
              
              ...(formData.password && { 
                password: formData.password,
                password_confirmation: formData.password 
              })
            },
          },
          {
            headers: {
              Authorization: `${token}`,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        );

        
        const updatedUser = response.data.user;
        setLibrarians((prev) =>
          prev.map((lib) =>
            lib.id === editingLibrarian.id
              ? { ...lib, name: updatedUser.name, email: updatedUser.email }
              : lib
          )
        );
        
        setSnackbar({ open: true, message: "Librarian updated successfully", severity: "success" });
        setOpenDialog(false);
      } catch (error) {
        console.error("Error updating librarian:", error);
        const errorMsg =
          error.response?.data?.errors?.join(", ") || 
          error.response?.data?.message || 
          "Failed to update librarian";
        setSnackbar({ open: true, message: errorMsg, severity: "error" });
      }
      return;
    }

  
    try {
      const token = localStorage.getItem("token");
      console.log(token);
      const response = await axios.post(
        "http://localhost:3001/signup",
        {
          user: {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            password_confirmation: formData.password,
            role: 1,
          },
        },
        {
          headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      const newUser = response.data.user;
      setLibrarians((prev) => [
        ...prev,
        {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
        },
      ]);
      setSnackbar({ open: true, message: "Librarian added successfully", severity: "success" });
      setOpenDialog(false);
    } catch (error) {
      console.error("Error adding librarian:", error);
      const errorMsg =
        error.response?.data?.errors?.join(", ") || "Failed to add librarian";
      setSnackbar({ open: true, message: errorMsg, severity: "error" });
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "email", headerName: "Email", flex: 1.5 },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      renderCell: (params) => (
        <>
          <Tooltip title="Edit">
            <IconButton onClick={() => handleOpenEdit(params.row)} color="primary">
              <Edit />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton onClick={() => handleDeleteClick(params.row)} color="error">
              <Delete />
            </IconButton>
          </Tooltip>
        </>
      ),
      width: 130,
    },
  ];

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5" fontWeight={600}>
          Manage Librarians
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleOpenAdd}
          sx={{ backgroundColor: "#3f51b5" }}
        >
          Add Librarian
        </Button>
      </Box>

     
      <Box mb={2}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search librarians by name or email..."
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search color="action" />
              </InputAdornment>
            ),
            endAdornment: searchTerm && (
              <InputAdornment position="end">
                <IconButton
                  aria-label="clear search"
                  onClick={handleClearSearch}
                  edge="end"
                  size="small"
                >
                  <Clear />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            backgroundColor: "#fff",
            borderRadius: 1,
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#e0e0e0",
              },
              "&:hover fieldset": {
                borderColor: "#3f51b5",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#3f51b5",
              },
            },
          }}
        />
      </Box>

      <DataGrid
        rows={filteredLibrarians}
        columns={columns}
        autoHeight
        disableRowSelectionOnClick
        sx={{ backgroundColor: "#fff", borderRadius: 2 }}
        noRowsOverlay={() => (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            height="200px"
            flexDirection="column"
          >
            <Typography variant="h6" color="textSecondary">
              {searchTerm ? "No librarians found matching your search" : "No librarians found"}
            </Typography>
            {searchTerm && (
              <Typography variant="body2" color="textSecondary" mt={1}>
                Try adjusting your search terms
              </Typography>
            )}
          </Box>
        )}
      />

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editingLibrarian ? "Edit Librarian" : "Add New Librarian"}</DialogTitle>
        <DialogContent dividers>
          <TextField
            fullWidth
            label="Name"
            margin="normal"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <TextField
            fullWidth
            label="Email"
            margin="normal"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <TextField
            fullWidth
            label={editingLibrarian ? "New Password (optional)" : "Password"}
            margin="normal"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            helperText={editingLibrarian ? "Leave blank to keep current password" : ""}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit} sx={{ backgroundColor: "#3f51b5" }}>
            {editingLibrarian ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>

      
      <Dialog
        open={deleteDialog.open}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          <Typography id="delete-dialog-description">
            Are you sure you want to delete the librarian "{deleteDialog.librarian?.name}"? 
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error" 
            variant="contained"
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
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

export default ManageLibrarians;