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

const MemberOverdueBooks = () => {
  const [overdueBooks, setOverdueBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOverdueBooks = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8080/borrow/overdue', {
          headers: {
            Authorization: token,
          },
        });
        setOverdueBooks(response.data);
      } catch (err) {
        console.error(err);
        setError('An error occurred while retrieving your notifications. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchOverdueBooks();
  }, []);

  const formatDate = (date) => dayjs(date).format('DD MMM YYYY');

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
        Overdue Notifications
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
            You have <strong>{overdueBooks.length}</strong> overdue book
            {overdueBooks.length > 1 ? 's' : ''}. Please return them and pay the overdue fees.
          </Alert>

          <Grid container spacing={3}>
            {overdueBooks.map((record) => {
              const penalty = record.days_overdue * 10;

              return (
                <Grid item xs={12} sm={6} md={4} key={record.borrow_id}>
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
                      <Typography variant="body2">
                        Borrowed on: <strong>{formatDate(record.borrowed_at)}</strong>
                      </Typography>
                      <Typography variant="body2">
                        Due on: <strong>{formatDate(record.expected_return)}</strong>
                      </Typography>

                      {record.days_overdue > 0 && (
                        <>
                          <Typography variant="body2" color="error" mt={1}>
                            Overdue by <strong>{record.days_overdue} day{record.days_overdue > 1 ? 's' : ''}</strong>
                          </Typography>
                          <Typography variant="body2" color="error" fontWeight="bold">
                            Penalty: ₹{penalty}
                          </Typography>
                        </>
                      )}
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

export default MemberOverdueBooks;
