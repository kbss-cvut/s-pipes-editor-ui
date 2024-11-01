import React from "react";
import { Typography, Button } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { SentimentDissatisfied } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <Grid
      container
      spacing={2}
      direction="column"
      alignItems="center"
      justifyContent="center"
      style={{ textAlign: "center" }}
    >
      <Grid item>
        <SentimentDissatisfied style={{ fontSize: 100, color: "#f44336" }} />
      </Grid>
      <Grid item>
        <Typography variant="h4" component="h1" gutterBottom>
          Oops! Page Not Found
        </Typography>
        <Typography variant="body1" gutterBottom>
          The page you are looking for does not exist.
        </Typography>
      </Grid>
      <Grid item>
        <Button variant="contained" color="primary" onClick={handleGoHome}>
          Go to Home
        </Button>
      </Grid>
    </Grid>
  );
};

export default NotFoundPage;
