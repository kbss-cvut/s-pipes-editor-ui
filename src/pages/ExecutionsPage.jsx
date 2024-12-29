import React, { useEffect, useState } from "react";
import {
  ABSOLUTE_PATH,
  DISPLAY_NAME,
  EXECUTION_DURATION,
  MODULE_EXECUTION_FINISH_DATE,
  MODULE_EXECUTION_START_DATE,
  RDF4j_TRANSFORMATION_ID,
  TRANSFORMATION,
} from "../constants/vocabulary.js";
import Rest from "../rest/Rest.jsx";
import { Col, Container, Row, Table } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMugHot, faEdit, faQuestion } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import Spinner from "../components/spinner/Spinner.jsx";

const ExecutionsPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Rest.getExecutions().then((response) => {
      console.log(response);
      setData(response);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <Spinner />;
  }

  return (
    <>
      <h3 className="mt-3">Executions</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Status</th>
            <th>Name</th>
            <th>Started</th>
            <th>Finished</th>
            <th>Duration</th>
            <th style={{ textAlign: "center" }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {data
            .filter((v) => v !== null)
            .map((data, key) => (
              <tr key={key}>
                <td align={"center"}>
                  <FontAwesomeIcon icon={faMugHot} />
                </td>
                <td>{data[DISPLAY_NAME]}</td>
                <td>{dayjs(data[MODULE_EXECUTION_START_DATE]).format("HH:mm:ss")}</td>
                <td>{dayjs(data[MODULE_EXECUTION_FINISH_DATE]).format("HH:mm:ss")}</td>
                <td>{data[EXECUTION_DURATION]}ms</td>
                <td>
                  <Container>
                    <Row>
                      <Col>
                        <Link to={`/script?file=${data[ABSOLUTE_PATH]}&transformation=${data[TRANSFORMATION]}`}>
                          <FontAwesomeIcon icon={faEdit} />
                        </Link>
                      </Col>
                      <Col
                        onClick={() => {
                          window.open(data[RDF4j_TRANSFORMATION_ID], "_blank");
                        }}
                      >
                        <FontAwesomeIcon icon={faQuestion} />
                      </Col>
                    </Row>
                  </Container>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
    </>
  );
};

export default ExecutionsPage;
