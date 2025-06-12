import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  IconButton,
  InputAdornment,
  Card,
  Snackbar,
  Alert,
  Button,
} from "@mui/material";
import { Search, Clear, Download } from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";

const ManageMembers = () => {
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:8080/borrow/members", {
        headers: { Authorization: token ? `${token}` : "" },
      });
      setMembers(response.data);
      setFilteredMembers(response.data);
    } catch (error) {
      console.error("Error fetching members:", error);
      setSnackbar({ open: true, message: "Failed to load members", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredMembers(members);
    } else {
      setFilteredMembers(
        members.filter((member) =>
          member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          member.email.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, members]);

  // CSV Export Function
  const handleExportCSV = () => {
    try {
      // Define CSV headers
      const headers = ['ID', 'Name', 'Email'];
      
      // Convert data to CSV format
      const csvContent = [
        headers.join(','), // Header row
        ...filteredMembers.map(member => [
          member.id,
          `"${member.name.replace(/"/g, '""')}"`, // Escape quotes in name
          `"${member.email.replace(/"/g, '""')}"` // Escape quotes in email
        ].join(','))
      ].join('\n');

      // Create blob and download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `members_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      setSnackbar({ 
        open: true, 
        message: `${filteredMembers.length} members exported successfully`, 
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

  const columns = [
    { field: "id", headerName: "ID", width: 80 },
    { field: "name", headerName: "Name", flex: 1, minWidth: 150 },
    { field: "email", headerName: "Email", flex: 1.5, minWidth: 200 },
  ];

  return (
    <Box sx={{ p: 3 }}>
      {/* Header + Export Button */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight={600} sx={{ color: "#3F51B5" }}>
          Members
        </Typography>
        <Button
          variant="outlined"
          startIcon={<Download />}
          onClick={handleExportCSV}
          disabled={filteredMembers.length === 0}
          sx={{ 
            borderColor: "#3F51B5", 
            color: "#3F51B5",
            "&:hover": {
              borderColor: "#364494",
              backgroundColor: "rgba(63, 81, 181, 0.04)"
            }
          }}
        >
          Export CSV
        </Button>
      </Box>

      {/* Search Bar */}
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search members by name or email..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search sx={{ color: "#3F51B5" }} />
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

      {/* Members Table */}
      <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
        <DataGrid
          rows={filteredMembers}
          columns={columns}
          autoHeight
          loading={loading}
          disableRowSelectionOnClick
          sx={{
            border: 0,
            '& .MuiDataGrid-cell': {
              borderBottom: '1px solid #f0f0f0',
            },
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#f8f9fa',
              fontWeight: 600,
            },
          }}
          getRowId={(row) => row.id}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 10 },
            },
          }}
          pageSizeOptions={[5, 10, 25]}
        />
      </Card>

      {/* Snackbar for notifications */}
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

export default ManageMembers;