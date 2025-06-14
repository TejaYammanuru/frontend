import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  Tooltip,
  InputAdornment,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import {
  Edit,
  Delete,
  Add,
  Search,
  Clear,
  Download,
} from "@mui/icons-material";
import axios from "axios";

const ManageLibrarians = () => {
  const [librarians, setLibrarians] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [editingLibrarian, setEditingLibrarian] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, librarian: null });

  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [totalCount, setTotalCount] = useState(0);
  const token = localStorage.getItem("token");

  const fetchLibrarians = async (page, limit) => {
    try {
      const response = await axios.get("http://localhost:8080/borrow/librarians", {
        headers: { Authorization: token },
        params: { page: page + 1, limit }, // backend is 1-indexed
      });

      const data = response.data;
      const formatted = data.librarians.map((lib) => ({
        id: lib.id,
        name: lib.name,
        email: lib.email,
      }));

      setLibrarians(formatted);
      setTotalCount(data.total);
    } catch (error) {
      console.error("Error fetching librarians:", error);
      setSnackbar({ open: true, message: "Failed to load librarians", severity: "error" });
    }
  };

  useEffect(() => {
    fetchLibrarians(paginationModel.page, paginationModel.pageSize);
  }, [paginationModel]);

  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  const handleClearSearch = () => setSearchTerm("");

  const handleExportCSV = () => {
    try {
      const csv = [
        ["ID", "Name", "Email"].join(","),
        ...librarians.map(({ id, name, email }) => [id, `"${name}"`, `"${email}"`].join(",")),
      ].join("\n");

      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `librarians_${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setSnackbar({ open: true, message: "CSV exported", severity: "success" });
    } catch (error) {
      console.error(error);
      setSnackbar({ open: true, message: "Export failed", severity: "error" });
    }
  };

  const handleOpenAdd = () => {
    setEditingLibrarian(null);
    setFormData({ name: "", email: "", password: "", password_confirmation: "" });
    setOpenDialog(true);
  };

  const handleOpenEdit = (lib) => {
    setEditingLibrarian(lib);
    setFormData({ name: lib.name, email: lib.email, password: "", password_confirmation: "" });
    setOpenDialog(true);
  };

  const handleDeleteClick = (lib) => setDeleteDialog({ open: true, librarian: lib });

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`http://localhost:3001/signup/${deleteDialog.librarian.id}`, {
        headers: { Authorization: token },
      });
      setSnackbar({ open: true, message: "Deleted successfully", severity: "success" });
      fetchLibrarians(paginationModel.page, paginationModel.pageSize);
    } catch (error) {
      setSnackbar({ open: true, message: "Delete failed", severity: "error" });
    } finally {
      setDeleteDialog({ open: false, librarian: null });
    }
  };
   const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, librarian: null });
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.email) {
      setSnackbar({ open: true, message: "Please fill all required fields", severity: "warning" });
      return;
    }

    if (formData.password !== formData.password_confirmation) {
      setSnackbar({ open: true, message: "Passwords do not match", severity: "error" });
      return;
    }

    const userPayload = {
      name: formData.name,
      email: formData.email,
      ...(formData.password && {
        password: formData.password,
        password_confirmation: formData.password_confirmation,
      }),
    };

    try {
      if (editingLibrarian) {
        await axios.put(
          `http://localhost:3001/signup/${editingLibrarian.id}`,
          { user: userPayload },
          { headers: { Authorization: token } }
        );
        setSnackbar({ open: true, message: "Updated successfully", severity: "success" });
      } else {
        await axios.post(
          `http://localhost:3001/signup`,
          { user: { ...userPayload, role: 1 } },
          { headers: { Authorization: token } }
        );
        setSnackbar({ open: true, message: "Added successfully", severity: "success" });
      }

      setOpenDialog(false);
      fetchLibrarians(paginationModel.page, paginationModel.pageSize);
    } catch (error) {
      const msg =
        error.response?.data?.errors?.join(", ") ||
        error.response?.data?.message ||
        "Failed to submit";
      setSnackbar({ open: true, message: msg, severity: "error" });
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      width: 130,
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
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h4" color="primary" fontWeight={600}>
          Manage Librarians
        </Typography>
        <Box display="flex" gap={1}>
          <Button variant="outlined" startIcon={<Download />} onClick={handleExportCSV}>
            Export CSV
          </Button>
          <Button variant="contained" startIcon={<Add />} onClick={handleOpenAdd}>
            Add Librarian
          </Button>
        </Box>
      </Box>

      <TextField
        fullWidth
        placeholder="Search librarians by name or email..."
        value={searchTerm}
        onChange={handleSearchChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
          endAdornment: searchTerm && (
            <InputAdornment position="end">
              <IconButton onClick={handleClearSearch}>
                <Clear />
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{ mb: 2 }}
      />

      <DataGrid
        rows={librarians}
        columns={columns}
        rowCount={totalCount}
        loading={false}
        pageSizeOptions={[5, 10, 20]}
        paginationMode="server"
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        disableRowSelectionOnClick
        autoHeight
      />

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editingLibrarian ? "Edit Librarian" : "Add New Librarian"}</DialogTitle>
        <DialogContent dividers>
          <TextField
            fullWidth
            label="Name"
            margin="normal"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <TextField
            fullWidth
            label="Email"
            margin="normal"
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <TextField
            fullWidth
            label={editingLibrarian ? "New Password (optional)" : "Password"}
            margin="normal"
            type="password"
            required={!editingLibrarian}
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
          <TextField
            fullWidth
            label="Confirm Password"
            margin="normal"
            type="password"
            required={!editingLibrarian}
            value={formData.password_confirmation}
            onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
            helperText={
              editingLibrarian ? "Leave both password fields blank to keep current password" : ""
            }
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
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the librarian "{deleteDialog.librarian?.name}"? This
            action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained" autoFocus>
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