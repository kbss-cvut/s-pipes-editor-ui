import React, { useEffect, useState } from "react";
import {
  ABSOLUTE_PATH,
  DISPLAY_NAME,
  EXECUTION_DURATION,
  PIPELINE_EXECUTION_START_DATE,
  PIPELINE_EXECUTION_FINISH_DATE,
  RDF4j_TRANSFORMATION_ID,
  TRANSFORMATION,
} from "@constants/vocabulary";
import Rest from "@rest/Rest.tsx";
import { Col, Container, Row, Table } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMugHot, faEdit, faQuestion } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import Loading from "@components/Loading";

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
    return <Loading />;
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
                <td>{dayjs(data[PIPELINE_EXECUTION_START_DATE]).format("YYYY-MM-DD HH:mm:ss.SSS")}</td>
                <td>{dayjs(data[PIPELINE_EXECUTION_FINISH_DATE]).format("YYYY-MM-DD HH:mm:ss.SSS")}</td>
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
