import React from "react";
import Grid from "@mui/material/Grid2";
import { Typography } from "@mui/material";
import ScriptsTree from "../../components/treebeard/ScriptsTree.jsx";

const HomePage = () => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome to SPipes editor
        </Typography>
        <ScriptsTree />
      </Grid>
    </Grid>
  );
};

export default HomePage;
