import React from "react";

import { Alert, Button, Col, Container, Modal, Row } from "react-bootstrap";
import { ONTOLOGY_URI, SCRIPT_PATH } from "@constants/vocabulary.ts";
import Rest from "@rest/Rest.tsx";

class MoveModuleModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      scriptPath: null,
      moduleURI: null,
      ontologies: null,
      isLoaded: false,
      modalVisible: false,
    };

    this.handleModuleMove = this.handleModuleMove.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.modalMove && newProps.sourceScriptPath && newProps.moduleScriptPath && newProps.moduleURI) {
      Rest.getScriptOntologies(newProps["sourceScriptPath"]).then((response) => {
        this.setState({
          sourceScriptPath: newProps["sourceScriptPath"],
          moduleScriptPath: newProps["moduleScriptPath"],
          moduleURI: newProps["moduleURI"],
          ontologies: response,
          isLoaded: true,
          modalVisible: true,
        });
      });
    }
  }

  async handleModuleMove(toScript, rename) {
    await Rest.moveModule(this.state.moduleScriptPath, toScript, this.state.moduleURI, rename);
    window.location.href = "?file=" + this.state.sourceScriptPath;
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
            <Modal.Title>Move module</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            {this.state.ontologies.length > 0 && (
              <Container>
                <Row>
                  <Col>
                    <h4>Ontology</h4>
                  </Col>
                  <Col>
                    <h4>File</h4>
                  </Col>
                  <Col>
                    <h4>Actions</h4>
                  </Col>
                </Row>
                <hr />
                {this.state.ontologies.map((data, key) => {
                  return (
                    <Row key={key}>
                      <Col>{data[ONTOLOGY_URI]}</Col>
                      <Col>{data[SCRIPT_PATH].replace(/^.*[\\\/]/, "")}</Col>
                      <Col>
                        <Row key={"o" + key}>
                          <Col>
                            <Alert
                              onClick={() => this.handleModuleMove(data[SCRIPT_PATH], true)}
                              variant="info"
                              style={{ cursor: "pointer" }}
                            >
                              MOVE RENAME
                            </Alert>
                          </Col>
                          <Col>
                            <Alert
                              onClick={() => this.handleModuleMove(data[SCRIPT_PATH], false)}
                              variant="info"
                              style={{ cursor: "pointer" }}
                            >
                              MOVE
                            </Alert>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  );
                })}
              </Container>
            )}
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

export default MoveModuleModal;
