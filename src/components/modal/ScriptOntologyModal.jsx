import React from "react";

import { Alert, Button, Col, Container, Form, Modal, Row } from "react-bootstrap";
import Rest from "../../rest/Rest.jsx";

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

  async handleRemoveOntology(ontologyURI) {
    try {
      console.log(this.state.scriptPath + " #### " + ontologyURI);
      await Rest.removeScriptOwnOntology(this.state.scriptPath, ontologyURI);
      const response = await Rest.getScriptOwnOntology(this.state.scriptPath);
      this.setState({
        scriptPath: this.state.scriptPath,
        ontologies: response,
      });
    } catch (error) {
      alert("An error occurred while removing the ontology.");
      console.error(`An error occurred while removing the ontology ${ontologyURI}: ${error}`);
    }
  }

  async handleAddScriptOntology(event) {
    try {
      event.preventDefault();
      await Rest.addScriptOwnOntology(this.state.scriptPath, this.state.newOntologyName);
      const response = await Rest.getScriptOwnOntology(this.state.scriptPath);
      this.setState({
        scriptPath: this.state.scriptPath,
        newOntologyName: null,
        ontologies: response,
      });
    } catch (error) {
      alert(`An error occurred while adding the ontology.`);
      console.error(`An error occurred while adding the ontology: ${error}`);
    }
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
