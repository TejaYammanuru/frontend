import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  Divider,
  Paper,
  Container,
} from "@mui/material";
import axios from "axios";

const categorizeNotifications = (notifications) => {
  const categories = {
    new: [],
    updated: [],
    removed: [],
    dueSoon: [],
    popular: [],
  };

  notifications.forEach((note) => {
    if (note.startsWith("📗")) categories.new.push(note);
    else if (note.startsWith("✏️")) categories.updated.push(note);
    else if (note.startsWith("🗑️")) categories.removed.push(note);
    else if (note.includes("due in 3 days")) categories.dueSoon.push(note);
    else if (note.startsWith("🔥")) categories.popular.push(note);
  });

  return categories;
};

const TabPanel = ({ children, value, index }) => {
  return value === index ? <Box p={2}>{children}</Box> : null;
};

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [categorized, setCategorized] = useState({});
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:8080/borrow/member-notifications", {
          headers: { Authorization: token },
        });
        const notes = res.data.notifications || [];
        setNotifications(notes);
        setCategorized(categorizeNotifications(notes));
      } catch (err) {
        console.error(err);
        setError("Failed to load notifications.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  if (loading) {
    return (
      <Box p={4} display="flex" justifyContent="center">
        <CircularProgress color="primary" />
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

  const tabLabels = [
    { label: "New Books", key: "new" },
    { label: "Updated Books", key: "updated" },
    { label: "Removed Books", key: "removed" },
    { label: "Due Soon", key: "dueSoon" },
    { label: "Popular Books", key: "popular" },
  ];

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" fontWeight={700} color="primary" gutterBottom>
        📢 Member Notifications
      </Typography>

      <Paper sx={{ mt: 2, borderRadius: 2 }}>
        <Tabs
          value={tab}
          onChange={(_, newValue) => setTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          indicatorColor="primary"
          textColor="primary"
        >
          {tabLabels.map((tab, index) => (
            <Tab key={tab.key} label={tab.label} />
          ))}
        </Tabs>

        {tabLabels.map((t, i) => (
          <TabPanel key={t.key} value={tab} index={i}>
            {categorized[t.key]?.length === 0 ? (
              <Alert severity="info">No {t.label.toLowerCase()} notifications.</Alert>
            ) : (
              <List>
                {categorized[t.key].map((note, idx) => (
                  <React.Fragment key={idx}>
                    <ListItem>
                      <ListItemText primary={note} />
                    </ListItem>
                    {idx < categorized[t.key].length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            )}
          </TabPanel>
        ))}
      </Paper>
    </Container>
  );
};

export default Notifications;
