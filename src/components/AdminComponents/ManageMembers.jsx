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
  const [totalMembers, setTotalMembers] = useState(0);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const [searchTerm, setSearchTerm] = useState("");

  const fetchMembers = async (page, limit) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:8080/borrow/members", {
        headers: { Authorization: token || "" },
        params: {
          page: page + 1, // backend is 1-based
          limit,
        },
      });

      const { members, total } = response.data;
      setMembers(members || []);
      setTotalMembers(total || 0);
    } catch (error) {
      console.error("Error fetching members:", error);
      setSnackbar({ open: true, message: "Failed to load members", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers(paginationModel.page, paginationModel.pageSize);
  }, [paginationModel]);

  const handleExportCSV = () => {
    try {
      const headers = ['ID', 'Name', 'Email'];
      const csvContent = [
        headers.join(','),
        ...members.map(member => [
          member.id,
          `"${member.name.replace(/"/g, '""')}"`,
          `"${member.email.replace(/"/g, '""')}"`
        ].join(','))
      ].join('\n');

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
        message: `${members.length} members exported successfully`,
        severity: "success",
      });
    } catch (error) {
      console.error("Error exporting CSV:", error);
      setSnackbar({
        open: true,
        message: "Failed to export CSV",
        severity: "error",
      });
    }
  };

  const filteredMembers = searchTerm
    ? members.filter((member) =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : members;

  const columns = [
    { field: "id", headerName: "ID", width: 80 },
    { field: "name", headerName: "Name", flex: 1, minWidth: 150 },
    { field: "email", headerName: "Email", flex: 1.5, minWidth: 200 },
  ];

  return (
    <Box sx={{ p: 3 }}>
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
              backgroundColor: "rgba(63, 81, 181, 0.04)",
            },
          }}
        >
          Export CSV
        </Button>
      </Box>

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

      <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
        <DataGrid
          rows={filteredMembers}
          columns={columns}
          rowCount={totalMembers}
          loading={loading}
          paginationMode="server"
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[5, 10, 25]}
          autoHeight
          disableRowSelectionOnClick
          getRowId={(row) => row.id}
          sx={{
            border: 0,
            '& .MuiDataGrid-cell': { borderBottom: '1px solid #f0f0f0' },
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#f8f9fa',
              fontWeight: 600,
            },
          }}
        />
      </Card>

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
