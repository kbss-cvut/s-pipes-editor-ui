import React from "react";

import { Alert, Button, Col, Container, Form, Modal, Row } from "react-bootstrap";
import {
  ABSOLUTE_PATH,
  DISPLAY_NAME,
  ERROR_MESSAGE,
  EXECUTION_DURATION,
  FINISH_DATE_UNIX,
  MODULE_URI,
  Rest,
  RULE_COMMENT,
  START_DATE_UNIX,
  TRANSFORMATION,
} from "../rest/Rest";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faMugHot, faPlayCircle, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

class FunctionExecutionModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      validationMap: null,
      modalValidation: false,
      cytoscape: false,
    };

    this.handleNodeZoom = this.handleNodeZoom.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  componentWillReceiveProps(newProps) {
    if (newProps["validationOrigin"] && newProps["modalValidation"]) {
      this.setState({
        validationOrigin: newProps["validationOrigin"],
        modalValidation: newProps["modalValidation"],
        cytoscape: newProps["cy"],
      });
    }
  }

  handleNodeZoom(id) {
    this.state.cytoscape.zoom({
      level: 4,
    });
    this.state.cytoscape.center(this.state.cytoscape.getElementById(id));
    this.setState({ isLoaded: false, modalValidation: false });
  }

  handleClose() {
    this.setState({ isLoaded: false, modalValidation: false });
  }

  render() {
    if (this.state.modalValidation) {
      return (
        <Modal
          show={this.state.modalValidation}
          onHide={() => this.handleClose()}
          dialogClassName="modal-80w"
          aria-labelledby="example-custom-modal-styling-title"
        >
          <Modal.Header closeButton>
            <Modal.Title>Validation report</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            {this.state.validationOrigin.length > 0 && (
              <Container>
                <Row>
                  <Col>
                    <h4>Module</h4>
                  </Col>
                  <Col>
                    <h4>Rule</h4>
                  </Col>
                  <Col>
                    <h4>Error message</h4>
                  </Col>
                </Row>
                {this.state.validationOrigin.map((data, key) => {
                  return (
                    <Row key={key}>
                      <Col>
                        <Alert
                          onClick={() => this.handleNodeZoom(data[MODULE_URI])}
                          variant="info"
                          style={{ cursor: "pointer" }}
                        >
                          {data[MODULE_URI]}
                        </Alert>
                      </Col>
                      <Col>
                        <Alert variant="info">{data[RULE_COMMENT]}</Alert>
                      </Col>
                      <Col>
                        <Alert variant="danger">{data[ERROR_MESSAGE]}</Alert>
                      </Col>
                    </Row>
                  );
                })}
              </Container>
            )}
            {this.state.validationOrigin.length === 0 && <Alert variant="success">EVERYTHING IS OK</Alert>}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => this.handleClose()}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      );
    } else {
      return null;
    }
  }
}

export default FunctionExecutionModal;
