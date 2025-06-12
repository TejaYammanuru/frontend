import React from "react";
import {
  Box,
  Container,
  Typography,
  Link,
  IconButton,
  Stack,
  Divider,
} from "@mui/material";
import { Facebook, Twitter, Instagram, Email } from "@mui/icons-material";

const Footer = () => {
  return (
    <Box
      sx={{
        backgroundColor: "#f5f5f5",
        borderTop: "1px solid #ddd",
        mt: 6,
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={4}
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="body2" color="text.secondary" align="center">
            &copy; {new Date().getFullYear()} Online Library Portal. All rights reserved.
          </Typography>

          <Stack direction="row" spacing={2}>
            <Link href="#" color="inherit" underline="hover">
              Home
            </Link>
            <Link href="#" color="inherit" underline="hover">
              About
            </Link>
            <Link href="#" color="inherit" underline="hover">
              Contact
            </Link>
          </Stack>

          <Stack direction="row" spacing={1}>
            <IconButton color="inherit" size="small">
              <Facebook fontSize="small" />
            </IconButton>
            <IconButton color="inherit" size="small">
              <Twitter fontSize="small" />
            </IconButton>
            <IconButton color="inherit" size="small">
              <Instagram fontSize="small" />
            </IconButton>
            <IconButton color="inherit" size="small">
              <Email fontSize="small" />
            </IconButton>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};

export default Footer;
