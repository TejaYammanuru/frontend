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
import { DataGrid } from '@mui/x-data-grid';
import { Search, Clear, Download } from '@mui/icons-material';
import axios from 'axios';
import dayjs from 'dayjs';

const BorrowLibRecords = () => {
  const [records, setRecords] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'error' });
  const [loading, setLoading] = useState(true);

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const fetchBorrowHistory = async (page, limit) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      const response = await axios.get('http://localhost:8080/borrow/history', {
        headers: { Authorization: `${token}` },
        params: { page: page + 1, limit },
      });

      const { records: data, total } = response.data;

      const formatted = data.map((record) => ({
        id: record.id,
        bookTitle: record.book?.title || 'Unknown',
        memberName: record.user?.name || 'Unknown',
        memberEmail: record.user?.email || 'Unknown',
        borrowedAt: dayjs(record.borrowed_at).format('YYYY-MM-DD HH:mm'),
        returnedAt: record.returned_at
          ? dayjs(record.returned_at).format('YYYY-MM-DD HH:mm')
          : null,
      }));

      setRecords(formatted);
      setTotalRecords(total);
    } catch (err) {
      console.error('Failed to fetch borrow history:', err);
      setSnackbar({ open: true, message: 'Failed to load borrow records', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBorrowHistory(paginationModel.page, paginationModel.pageSize);
  }, [paginationModel]);

  const handleExportCSV = () => {
    try {
      const headers = ['ID', 'Book Title', 'Member Name', 'Member Email', 'Borrowed At', 'Returned At'];
      const csvContent = [
        headers.join(','),
        ...records.map((record) => [
          record.id,
          `"${record.bookTitle.replace(/"/g, '""')}"`,
          `"${record.memberName.replace(/"/g, '""')}"`,
          `"${record.memberEmail}"`,
          `"${record.borrowedAt}"`,
          `"${record.returnedAt || 'Not Returned'}"`,
        ].join(','))
      ].join('\n');

      const BOM = '\uFEFF';
      const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.href = url;
      link.setAttribute('download', `borrow_records_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setSnackbar({ open: true, message: `${records.length} records exported successfully`, severity: 'success' });
    } catch (error) {
      console.error('CSV export failed:', error);
      setSnackbar({ open: true, message: 'Failed to export CSV', severity: 'error' });
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
            disabled={loading || records.length === 0}
            sx={{
              borderColor: "#00897B",
              color: "#00897B",
              '&:hover': {
                borderColor: "#00897B",
                backgroundColor: "rgba(0, 137, 123, 0.04)"
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
            rows={
              searchTerm
                ? records.filter(
                    (rec) =>
                      rec.bookTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      rec.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      rec.memberEmail.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                : records
            }
            columns={columns}
            rowCount={totalRecords}
            paginationMode="server"
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            loading={loading}
            autoHeight
            disableRowSelectionOnClick
            pageSizeOptions={[5, 10, 25]}
            sx={{
              border: 0,
              '& .MuiDataGrid-cell': { borderBottom: '1px solid #f0f0f0' },
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: '#f8f9fa',
                fontWeight: 600,
                color: '#00897B',
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
