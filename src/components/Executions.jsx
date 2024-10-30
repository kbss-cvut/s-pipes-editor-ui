import React, { Fragment } from "react";
import {
  ABSOLUTE_PATH,
  DISPLAY_NAME,
  EXECUTION_DURATION,
  FINISH_DATE_UNIX,
  Rest,
  START_DATE_UNIX,
  TRANSFORMATION,
} from "./rest/Rest";
import { Col, Container, Row, Table } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMugHot, faTrash, faRunning, faPlayCircle, faEdit, faQuestion } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

class Executions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
    };
  }

  componentDidMount() {
    Rest.getExecutions().then((response) => {
      console.log(response);
      this.setState({ data: response });
    });
  }

  render() {
    if (this.state.data === []) {
      return <h3>Loading</h3>;
    } else {
      return (
        <>
          <h3>Executions</h3>
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
              {this.state.data
                .filter((v) => {
                  return v !== null;
                })
                .map((data, key) => {
                  return (
                    <tr key={key}>
                      <td align={"center"}>
                        <FontAwesomeIcon icon={faMugHot} />
                      </td>
                      <td>{data[DISPLAY_NAME]}</td>
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
                                window.open(
                                  data["http://onto.fel.cvut.cz/ontologies/s-pipes/rdf4j-transformation-id"],
                                  "_blank",
                                );
                              }}
                            >
                              <FontAwesomeIcon icon={faQuestion} />
                            </Col>
                            {/*<Col><FontAwesomeIcon icon={faPlayCircle} /></Col>*/}
                            {/*<Col><FontAwesomeIcon icon={faTrash} /></Col>*/}
                          </Row>
                        </Container>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </Table>
        </>
      );
    }
  }
}

export default Executions;
