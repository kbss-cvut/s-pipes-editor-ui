import React from "react";
import { AppBar, Toolbar, Container, Typography } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";

const Footer = () => {
  return (
    <AppBar position="fixed" sx={{ backgroundColor: "white", color: "black", top: "auto", bottom: 0 }} elevation={0}>
      <Toolbar>
        <Container sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Typography variant="body1" sx={{ color: "black" }}>
            Made with <FavoriteIcon sx={{ color: "red", verticalAlign: "middle" }} />
          </Typography>
        </Container>
      </Toolbar>
    </AppBar>
  );
};

export default Footer;
