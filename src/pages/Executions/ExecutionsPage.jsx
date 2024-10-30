import React, { useEffect, useState } from "react";
import {
  ABSOLUTE_PATH,
  DISPLAY_NAME,
  EXECUTION_DURATION,
  FINISH_DATE_UNIX,
  Rest,
  START_DATE_UNIX,
  TRANSFORMATION,
} from "../../components/rest/Rest.jsx";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  CircularProgress,
  Box,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import HelpIcon from "@mui/icons-material/Help";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { Link } from "react-router-dom";

const ExecutionsPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Rest.getExecutions();
        setData(response);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        width="100vw"
        overflow="hidden"
        position="fixed"
        top={0}
        left={0}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Executions
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">Status</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Started</TableCell>
              <TableCell>Finished</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data
              .filter((v) => v !== null)
              .map((data, key) => {
                return (
                  <TableRow key={key}>
                    <TableCell align="center">
                      <AccessTimeIcon />
                    </TableCell>
                    <TableCell>{data[DISPLAY_NAME]}</TableCell>
                    <TableCell>{data[START_DATE_UNIX] || "N/A"}</TableCell>
                    <TableCell>{data[FINISH_DATE_UNIX] || "N/A"}</TableCell>
                    <TableCell>{data[EXECUTION_DURATION]} ms</TableCell>
                    <TableCell align="center">
                      <IconButton
                        component={Link}
                        to={`/script?file=${data[ABSOLUTE_PATH]}&transformation=${data[TRANSFORMATION]}`}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => {
                          window.open(
                            data["http://onto.fel.cvut.cz/ontologies/s-pipes/rdf4j-transformation-id"],
                            "_blank",
                          );
                        }}
                      >
                        <HelpIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default ExecutionsPage;
