import React from "react";

import { Alert, Button, Col, Container, Form, Modal, Row, Table } from "react-bootstrap";
import {
  ABSOLUTE_PATH,
  DISPLAY_NAME,
  ERROR_MESSAGE,
  EXECUTION_DURATION,
  FINISH_DATE_UNIX,
  MODULE_URI,
  ONTOLOGY_URI,
  Rest,
  RULE_COMMENT,
  SCRIPT_PATH,
  START_DATE_UNIX,
  TRANSFORMATION,
} from "../rest/Rest";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faMugHot, faPlayCircle, faPlusCircle, faTrash } from "@fortawesome/free-solid-svg-icons";
import Moment from "react-moment";
import { Link } from "react-router-dom";
import Layout from "../Layout";

class ScriptOntologyModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      scriptPath: null,
      newOntologyName: null,
      isLoaded: false,
      modalVisible: false,
    };

    this.handleClose = this.handleClose.bind(this);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.scriptPath && newProps.modalOntology) {
      Rest.getScriptOwnOntology(newProps["scriptPath"]).then((response) => {
        this.setState({
          scriptPath: newProps["scriptPath"],
          ontologies: response,
          isLoaded: true,
          modalVisible: true,
        });
      });
    }
  }

  handleRemoveOntology(ontologyURI) {
    console.log(this.state.scriptPath + " #### " + ontologyURI);
    Rest.removeScriptOwnOntology(this.state.scriptPath, ontologyURI).then((response) => {
      if (response.status === 200) {
        Rest.getScriptOwnOntology(this.state.scriptPath).then((response2) => {
          this.setState({
            scriptPath: this.state.scriptPath,
            ontologies: response2,
          });
        });
      } else {
        alert(ontologyURI + " can not be deleted.");
      }
    });
  }

  handleAddScriptOntology(event) {
    event.preventDefault();
    Rest.addScriptOwnOntology(this.state.scriptPath, this.state.newOntologyName).then((response) => {
      if (response.status === 200) {
        Rest.getScriptOwnOntology(this.state.scriptPath).then((response2) => {
          this.setState({
            scriptPath: this.state.scriptPath,
            newOntologyName: null,
            ontologies: response2,
          });
        });
      } else {
        alert(ontologyURI + " can not be deleted.");
      }
    });
  }

  handleClose() {
    this.setState({ isLoaded: false, modalVisible: false });
  }

  render() {
    if (this.state.isLoaded) {
      return (
        <Modal
          show={this.state.modalVisible}
          onHide={() => this.handleClose()}
          dialogClassName="modal-80w"
          aria-labelledby="example-custom-modal-styling-title"
        >
          <Modal.Header closeButton>
            <Modal.Title>Script ontology</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Container>
              <Alert variant="warning">Be very careful with the deleting! Only for advance users.</Alert>
              <Row>
                <Col>
                  <h4>Ontology</h4>
                </Col>
                <Col>
                  <h4>Action</h4>
                </Col>
              </Row>
              <hr />
              {this.state.ontologies.map((data, key) => {
                return (
                  <Row key={key}>
                    <Col>
                      <Alert variant="info">{data}</Alert>
                    </Col>
                    <Col>
                      <Alert
                        onClick={() => this.handleRemoveOntology(data)}
                        variant="danger"
                        style={{ cursor: "pointer" }}
                      >
                        REMOVE
                      </Alert>
                    </Col>
                  </Row>
                );
              })}
              <Form onSubmit={(event) => this.handleAddScriptOntology(event)}>
                <Row key="ontology_create">
                  <Col>
                    <Form.Group controlId="scriptName">
                      <Form.Control
                        required
                        placeholder="http://onto.fel.cvut.cz/ontologies/s-pipes-lib"
                        type={"url"}
                        onChange={(e) => this.setState({ newOntologyName: e.target.value })}
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Button variant="primary" type="submit">
                      ADD ONTOLOGY
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Container>
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

export default ScriptOntologyModal;
