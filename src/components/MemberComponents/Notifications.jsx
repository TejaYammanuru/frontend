import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Alert,
  AlertTitle,
  Divider,
} from '@mui/material';
import axios from 'axios';
import dayjs from 'dayjs';

const Notifications = () => {
  const [overdueBooks, setOverdueBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBorrowingHistory = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8080/borrow/history', {
          headers: {
            Authorization: token,
          },
        });

        const overdue = response.data.filter((record) => {
          const borrowedAt = dayjs(record.borrowed_at);
          const daysElapsed = dayjs().diff(borrowedAt, 'day');
          return daysElapsed >= 0 && !record.returned_at;
        });

        setOverdueBooks(overdue);
      } catch (err) {
        console.error(err);
        setError('An error occurred while retrieving your notifications. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBorrowingHistory();
  }, []);

  const formatDaysOverdue = (days) => {
    if (days === 0) return 'today';
    if (days === 1) return 'yesterday';
    return `${days} days ago`;
  };

  if (loading) {
    return (
      <Box p={4} display="flex" justifyContent="center">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={4}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box p={4}>
      <Typography variant="h4" color="primary" fontWeight="bold" gutterBottom>
        📚 Overdue Notifications
      </Typography>

      {overdueBooks.length === 0 ? (
        <Alert severity="success" sx={{ mt: 3 }}>
          <AlertTitle>All Clear!</AlertTitle>
          You have no overdue books. Keep reading responsibly!
        </Alert>
      ) : (
        <>
          <Alert severity="warning" sx={{ mb: 3 }}>
            <AlertTitle>Overdue Alert</AlertTitle>
            You have <strong>{overdueBooks.length}</strong> book
            {overdueBooks.length > 1 ? 's' : ''} overdue. Please return them promptly.
          </Alert>

          <Grid container spacing={3}>
            {overdueBooks.map((record) => {
              const daysOverdue = dayjs().diff(dayjs(record.borrowed_at), 'day');
              return (
                <Grid item xs={12} sm={6} md={4} key={record.id}>
                  <Card sx={{ borderRadius: 3, boxShadow: 3, height: '100%' }}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={`http://localhost:8080${record.book.image_url}`}
                      alt={record.book.title}
                      sx={{ objectFit: 'cover' }}
                    />
                    <CardContent>
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        {record.book.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Author: {record.book.author}
                      </Typography>
                      <Divider sx={{ my: 1 }} />
                      <Typography variant="body2" color="error" fontWeight="medium">
                        Borrowed {formatDaysOverdue(daysOverdue)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </>
      )}
    </Box>
  );
};

export default Notifications;
