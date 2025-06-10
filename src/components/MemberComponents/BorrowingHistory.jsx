import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Container,
  Avatar,
  Card,
  CardContent,
  Grid,
  Divider,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import dayjs from 'dayjs';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import AssignmentReturnIcon from '@mui/icons-material/AssignmentReturn';

const BorrowHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageSize, setPageSize] = useState(5);
  const [page, setPage] = useState(0);

  const token = localStorage.getItem('token');
  const primaryBlue = '#1976d2';

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get('http://localhost:8080/borrow/history', {
          headers: {
            Authorization: `${token}`,
          },
        });
        setHistory(response.data);
      } catch (error) {
        console.error('Error fetching borrow history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [token]);

  const getDaysAgoText = (borrowedAt) => {
    const now = dayjs();
    const borrowedDate = dayjs(borrowedAt);
    const diff = now.diff(borrowedDate, 'day');

    if (diff === 0) return 'Today';
    if (diff === 1) return 'Yesterday';
    return `${diff} days ago`;
  };

  const totalBorrowed = history.length;
  const notReturned = history.filter((record) => !record.returned_at).length;
  const user = history[0]?.user;

  const rows = history.map((record, index) => ({
    id: record.id ?? index,
    title: record.book.title,
    author: record.book.author,
    daysAgo: getDaysAgoText(record.borrowed_at),
    returned: record.returned_at ? 'Yes' : 'No',
  }));

  const columns = [
    { field: 'title', headerName: 'Title', flex: 1, headerClassName: 'super-app-theme--header' },
    { field: 'author', headerName: 'Author', flex: 1, headerClassName: 'super-app-theme--header' },
    { field: 'daysAgo', headerName: 'Days Ago', flex: 0.6, headerClassName: 'super-app-theme--header' },
    { field: 'returned', headerName: 'Returned', flex: 0.5, headerClassName: 'super-app-theme--header' },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 5, mb: 5 }}>
      <Typography variant="h4" align="center" color={primaryBlue} fontWeight={600} gutterBottom>
        Borrowing History
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="200px">
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Paper elevation={2} sx={{ p: 4, mb: 4, borderRadius: 3, bgcolor: '#fff' }}>
            {user && (
              <Box textAlign="center" mb={3}>
                <Avatar sx={{ bgcolor: primaryBlue, mx: 'auto', mb: 1 }}>
                  <PersonIcon />
                </Avatar>
                <Typography variant="h6">{user.name}</Typography>
                <Box display="flex" justifyContent="center" alignItems="center" gap={1}>
                  <EmailIcon fontSize="small" color="action" />
                  <Typography variant="body2">{user.email}</Typography>
                </Box>
              </Box>
            )}

            <Divider sx={{ my: 2 }} />

            <Grid container spacing={2} justifyContent="center">
              <Grid item xs={12} sm={6}>
                <Card
                  sx={{
                    border: '1px solid #e0e0e0',
                    transition: '0.3s',
                    '&:hover': {
                      borderColor: primaryBlue,
                    },
                    borderRadius: 3,
                    textAlign: 'center',
                  }}
                >
                  <CardContent>
                    <LibraryBooksIcon sx={{ fontSize: 36, color: primaryBlue, mb: 1 }} />
                    <Typography variant="body1">Total Books Borrowed</Typography>
                    <Typography variant="h5" fontWeight="bold" color={primaryBlue}>
                      {totalBorrowed}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Card
                  sx={{
                    border: '1px solid #e0e0e0',
                    transition: '0.3s',
                    '&:hover': {
                      borderColor: primaryBlue,
                    },
                    borderRadius: 3,
                    textAlign: 'center',
                  }}
                >
                  <CardContent>
                    <AssignmentReturnIcon sx={{ fontSize: 36, color: primaryBlue, mb: 1 }} />
                    <Typography variant="body1">Books Not Yet Returned</Typography>
                    <Typography variant="h5" fontWeight="bold" color={primaryBlue}>
                      {notReturned}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>

          <Paper elevation={1} sx={{ borderRadius: 3, height: 450 }}>
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={pageSize}
              onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
              pagination
              paginationMode="client"
              rowCount={rows.length}
              page={page}
              onPageChange={(newPage) => setPage(newPage)}
              loading={loading}
              disableSelectionOnClick
              sx={{
                bgcolor: '#fff',
                border: 'none',
                '& .super-app-theme--header': {
                  backgroundColor: primaryBlue,
                  color: '#fff',
                  fontWeight: 'bold',
                },
                '& .MuiDataGrid-row:nth-of-type(odd)': {
                  bgcolor: '#fafafa',
                },
                '& .MuiDataGrid-row:hover': {
                  bgcolor: '#e3f2fd',
                },
              }}
              components={{
                NoRowsOverlay: () => (
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: '100%',
                      fontSize: 16,
                      color: 'text.secondary',
                    }}
                  >
                    No borrowing records found.
                  </Box>
                ),
              }}
            />
          </Paper>
        </>
      )}
    </Container>
  );
};

export default BorrowHistory;
