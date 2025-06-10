import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { getGridNumericOperators } from '@mui/x-data-grid';

const columns = [
  { field: "user_id", headerName: "User ID", flex: 1, headerClassName: "super-app-theme--header" ,filterOperators: getGridNumericOperators()},
  { field: "name", headerName: "Name", flex: 1, headerClassName: "super-app-theme--header" },
  { field: "email", headerName: "Email", flex: 1.5, headerClassName: "super-app-theme--header" },
  { field: "book_id", headerName: "Book ID", flex: 1, headerClassName: "super-app-theme--header" ,filterOperators: getGridNumericOperators()},
  { field: "book_title", headerName: "Book Title", flex: 2, headerClassName: "super-app-theme--header" },
];

const OverdueBooks = () => {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const fetchOverdueBooks = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:8080/borrow/overdue", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const formatted = response.data.map((record, index) => ({
          id: index + 1,
          user_id: record.user.id,
          name: record.user.name,
          email: record.user.email,
          book_id: record.book.id,
          book_title: record.book.title,
        }));

        setRows(formatted);
      } catch (error) {
        console.error("Failed to fetch overdue books:", error);
      }
    };

    fetchOverdueBooks();
  }, []);

  return (
    <Box sx={{ p: 4 }}>
      <Typography
        variant="h5"
        gutterBottom
        sx={{ color: "#00897B", fontWeight: "bold", mb: 2 }}
      >
        Overdue Books
      </Typography>
      <Box sx={{ height: 500, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={7}
          rowsPerPageOptions={[7]}
          disableSelectionOnClick
          sx={{
            "& .super-app-theme--header": {
              backgroundColor: "#00897B",
              color: "#ffffff",
              fontWeight: "bold",
              fontSize: "1rem",
            },
            "& .MuiDataGrid-row:hover": {
              backgroundColor: "#e0f2f1",
            },
            border: "1px solid #ccc",
            borderRadius: "8px",
          }}
        />
      </Box>
    </Box>
  );
};

export default OverdueBooks;
