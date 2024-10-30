import React from "react";
import Grid from "@mui/material/Grid2";
import ScriptsTree from "../../components/treebeard/ScriptsTree.jsx";
import { Typography } from "@mui/material";

const ScriptsPage = () => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <Typography variant="h4" component="h3" gutterBottom>
          Scripts
        </Typography>
        <Typography variant="body1" component="p" gutterBottom>
          Right-click on directory/file to add/remove file
        </Typography>
        <ScriptsTree />
      </Grid>
    </Grid>
  );
};

export default ScriptsPage;
