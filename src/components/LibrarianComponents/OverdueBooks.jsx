import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Divider,
  Paper,
  useTheme,
} from "@mui/material";
import {
  MenuBook,
  Person,
  AccessTime,
  CalendarToday,
  CurrencyRupee,
} from "@mui/icons-material";
import axios from "axios";

const OverdueBooks = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    const fetchOverdueBooks = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:8080/borrow/overdue", {
          headers: {
            Authorization: `${token}`,
          },
        });
        setRecords(response.data || []);
      } catch (error) {
        console.error("Failed to fetch overdue books:", error);
        setRecords([]); 
      } finally {
        setLoading(false);
      }
    };

    fetchOverdueBooks();
  }, []);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" fontWeight={600} sx={{ color: "#00897B", mb: 3 }}>
        Overdue Books
      </Typography>

      <Paper elevation={3} sx={{ p: 2 }}>
        {loading ? (
          <Typography variant="body1">Loading...</Typography>
        ) : records.length === 0 ? (
          <Typography variant="body1" sx={{ color: "gray", textAlign: "center", py: 4 }}>
            🎉 No overdue books left!
          </Typography>
        ) : (
          <List>
            {records.map((record, index) => {
              const borrowedAt = new Date(record.borrowed_at).toLocaleString();
              const expectedReturn = new Date(record.expected_return).toLocaleDateString();
              const daysOverdue = record.days_overdue;
              const penalty = daysOverdue * 10;

              return (
                <React.Fragment key={record.borrow_id || `${record.user.id}-${record.book.id}`}>
                  <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: "#00897B" }}>
                        <Person />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle1" fontWeight={600}>
                          {record.user.name} —{" "}
                          <span style={{ color: "#555" }}>{record.user.email}</span>
                        </Typography>
                      }
                      secondary={
                        <>
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            <MenuBook fontSize="small" sx={{ mr: 1 }} />
                            <strong>Book:</strong> {record.book.title}
                          </Typography>
                          <Typography variant="body2">
                            <CalendarToday fontSize="small" sx={{ mr: 1 }} />
                            <strong>Borrowed At:</strong> {borrowedAt}
                          </Typography>
                          <Typography variant="body2">
                            <CalendarToday fontSize="small" sx={{ mr: 1 }} />
                            <strong>Return By:</strong> {expectedReturn}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              mt: 1,
                              color:
                                daysOverdue > 10
                                  ? theme.palette.error.main
                                  : theme.palette.warning.main,
                              fontWeight: 600,
                            }}
                          >
                           
                            {daysOverdue} day{daysOverdue > 1 ? "s" : ""} overdue
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: theme.palette.error.main,
                              fontWeight: 600,
                              mt: 0.5,
                            }}
                          >
                           
                            Penalty: ₹{penalty}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                  {index < records.length - 1 && <Divider variant="middle" />}
                </React.Fragment>
              );
            })}
          </List>
        )}
      </Paper>
    </Box>
  );
};

export default OverdueBooks;
