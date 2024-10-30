import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";
import { APP_TITLE } from "@config/env.js";

const NavbarMenu = () => {
  return (
    <AppBar
      position="static"
      elevation={1}
      sx={{ backgroundColor: "white", color: "black", zIndex: 100, marginBottom: 3 }}
    >
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ mr: 2 }}>
          <Link to="/" style={{ textDecoration: "none", color: "black" }}>
            {APP_TITLE}
          </Link>
        </Typography>

        <Box sx={{ display: "flex", gap: 2 }}>
          <Button color="inherit" component={Link} to="/scripts">
            Scripts
          </Button>
          <Button color="inherit" component={Link} to="/executions">
            Executions
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavbarMenu;
