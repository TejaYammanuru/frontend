import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Card,
  TextField,
  InputAdornment,
  IconButton,
  Snackbar,
  Alert,
  Button,
  Tooltip,
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Search, Clear, Download } from '@mui/icons-material';
import axios from 'axios';
import dayjs from 'dayjs';

const BorrowLibRecords = () => {
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'error' });

  const fetchBorrowHistory = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      const response = await axios.get('http://localhost:8080/borrow/history', {
        headers: {
          Authorization: `${token}`,
        },
      });

      const data = response.data.map((record) => ({
        id: record.id,
        bookTitle: record.book?.title || 'Unknown',
        memberName: record.user?.name || 'Unknown',
        memberEmail: record.user?.email || 'Unknown',
        borrowedAt: dayjs(record.borrowed_at).format('YYYY-MM-DD HH:mm'),
        returnedAt: record.returned_at
          ? dayjs(record.returned_at).format('YYYY-MM-DD HH:mm')
          : null,
      }));

      setRecords(data);
      setFilteredRecords(data);
    } catch (err) {
      console.error('Failed to fetch borrow history:', err);
      setError('Failed to load borrow records');
      setSnackbar({ open: true, message: 'Failed to load borrow records', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBorrowHistory();
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredRecords(records);
    } else {
      setFilteredRecords(
        records.filter(
          (rec) =>
            rec.bookTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
            rec.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            rec.memberEmail.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, records]);

  // CSV Export Function
  const handleExportCSV = () => {
    try {
      // Define CSV headers
      const headers = ['ID', 'Book Title', 'Member Name', 'Member Email', 'Borrowed At', 'Returned At'];
      
      // Convert data to CSV format
      const csvContent = [
        headers.join(','), // Header row
        ...filteredRecords.map(record => [
          record.id,
          `"${record.bookTitle.replace(/"/g, '""')}"`, // Escape quotes in book titles
          `"${record.memberName.replace(/"/g, '""')}"`, // Escape quotes in names
          `"${record.memberEmail}"`,
          `"${record.borrowedAt}"`,
          `"${record.returnedAt || 'Not Returned'}"`
        ].join(','))
      ].join('\n');

      // Add BOM for proper UTF-8 encoding
      const BOM = '\uFEFF';
      const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `borrow_records_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }

      setSnackbar({ 
        open: true, 
        message: `${filteredRecords.length} records exported successfully`, 
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
    { field: 'id', headerName: 'ID', width: 80 },
    { field: 'bookTitle', headerName: 'Book Title', flex: 1 },
    { field: 'memberName', headerName: 'Member Name', flex: 1 },
    { field: 'memberEmail', headerName: 'Member Email', flex: 1.2 },
    { field: 'borrowedAt', headerName: 'Borrowed At', flex: 1 },
    {
      field: 'returnedAt',
      headerName: 'Returned At',
      flex: 1,
      renderCell: (params) =>
        params.value ? (
          <Typography sx={{ color: '#00897B', fontWeight: 600 }}>
            {params.value}
          </Typography>
        ) : (
          <Typography sx={{ color: '#FF9800', fontWeight: 600 }}>
            Not Returned
          </Typography>
        ),
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight={600} sx={{ color: '#00897B' }}>
          Borrowing History
        </Typography>
        <Tooltip title="Export filtered records to CSV">
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={handleExportCSV}
            disabled={loading || filteredRecords.length === 0}
            sx={{ 
              borderColor: "#00897B", 
              color: "#00897B",
              '&:hover': {
                borderColor: "#00897B",
                backgroundColor: "rgba(0, 137, 123, 0.04)"
              },
              '&:disabled': {
                borderColor: "#ccc",
                color: "#999"
              }
            }}
          >
            Export CSV 
          </Button>
        </Tooltip>
      </Box>

      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search by book title, member name or email..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search sx={{ color: '#00897B' }} />
            </InputAdornment>
          ),
          endAdornment: searchTerm && (
            <InputAdornment position="end">
              <IconButton onClick={() => setSearchTerm('')} size="small">
                <Clear />
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{ mb: 3, backgroundColor: '#fff', borderRadius: 2 }}
      />

      {loading ? (
        <Box display="flex" justifyContent="center" mt={5}>
          <CircularProgress sx={{ color: '#00897B' }} />
        </Box>
      ) : (
        <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
          <DataGrid
            rows={filteredRecords}
            columns={columns}
            autoHeight
            disableRowSelectionOnClick
            slots={{ toolbar: GridToolbar }}
            slotProps={{
              toolbar: {
                showQuickFilter: false,
                csvOptions: {
                  fileName: 'borrow_records',
                  utf8WithBom: true,
                  delimiter: ',',
                },
                printOptions: {
                  hideFooter: true,
                  hideToolbar: true,
                },
              },
            }}
            sx={{
              border: 0,
              '& .MuiDataGrid-cell': {
                borderBottom: '1px solid #f0f0f0',
              },
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: '#f8f9fa',
                fontWeight: 600,
                color: '#00897B',
              },
              '& .MuiDataGrid-toolbarContainer': {
                justifyContent: 'flex-end',
                px: 2,
                py: 1,
              },
            }}
            pageSizeOptions={[5, 10, 25, 50]}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10 },
              },
            }}
          />
        </Card>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default BorrowLibRecords;