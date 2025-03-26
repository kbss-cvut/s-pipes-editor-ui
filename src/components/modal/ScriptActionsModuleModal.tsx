import React from "react";

import { Alert, Button, Col, Container, Form, Modal, Row, Table, InputGroup } from "react-bootstrap";
import Rest from "../../rest/Rest.tsx";
import { DEFAULT_ONTOLOGY_URI } from "@config/env.ts";

class ScriptActionsModuleModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      scriptPath: null,
      displayName: null,
      type: null,
      isLoaded: false,
      createScriptVisible: false,
      ontologyURI: false,
      scriptName: false,
      modalVisible: false,
      scriptType: ".ttl",
      returnModuleName: "",
      ontologyFragment: "",
      ontologyVersion: "0.1",
      returnSuffix: "Return",
      functionName: "",
    };

    this.handleCreateScript = this.handleCreateScript.bind(this);
    this.handleDeleteScript = this.handleDeleteScript.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.scriptPath && newProps.displayName && newProps.type) {
      this.setState({
        scriptPath: newProps.scriptPath,
        displayName: newProps.displayName,
        type: newProps.type,
        isLoaded: true,
        modalVisible: true,
      });
    }
  }

  async handleCreateScript(event) {
    event.preventDefault();
    const {
      scriptPath,
      scriptName,
      scriptType,
      ontologyURI,
      ontologyFragment,
      ontologyVersion,
      returnModuleName,
      returnSuffix,
      functionName,
    } = this.state;
    console.log(scriptPath, ontologyURI, scriptName, scriptType, returnModuleName);
    const completeOntologyURI = `${ontologyURI}/${ontologyFragment}-${ontologyVersion}`;
    const completeReturnModuleName = `${returnModuleName}_${returnSuffix}`;
    try {
      const response = await Rest.createScript(
        completeOntologyURI,
        scriptName,
        scriptPath,
        scriptType,
        completeReturnModuleName,
        functionName,
      );

      this.props.handleRefresh();

      this.setState({
        isLoaded: false,
        modalVisible: false,
        createScriptVisible: false,
      });
    } catch (error) {
      alert("An error occurred during script creation.");
      console.error(`An error occurred during script creation: ${error}`);
    }
  }

  handleEditScript() {
    window.location.href = "/script?file=" + this.state.scriptPath;
  }

  async handleDeleteScript() {
    try {
      await Rest.deleteScript(this.state.scriptPath);
      this.props.handleRefresh();
      this.setState({ isLoaded: false, modalVisible: false });
    } catch (error) {
      alert("An error occurred during script deletion.");
      console.error(`An error occurred during script deletion: ${error}`);
    }
  }

  handleClose() {
    this.setState({ isLoaded: false, modalVisible: false, createScriptVisible: false });
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
            <Modal.Title>{this.state.displayName}</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Container>
              {this.state.createScriptVisible === false && (
                <Row>
                  {this.state.type === "folder" && (
                    <Col>
                      <Alert
                        onClick={() => {
                          const folderName = this.state.displayName || "";
                          const defaultOntologyURI = DEFAULT_ONTOLOGY_URI || "";
                          this.setState({
                            createScriptVisible: true,
                            scriptName: folderName,
                            ontologyURI: defaultOntologyURI,
                            ontologyFragment: folderName,
                            returnModuleName: "",
                            functionName: "", //TODO
                            returnSuffix: "Return",
                            ontologyVersion: "0.1",
                          });
                        }}
                        variant="info"
                        style={{ cursor: "pointer" }}
                      >
                        CREATE SCRIPT
                      </Alert>
                    </Col>
                  )}
                  {this.state.type === "file-text" && (
                    <Col>
                      <Alert onClick={() => this.handleEditScript()} variant="info" style={{ cursor: "pointer" }}>
                        EDIT
                      </Alert>
                    </Col>
                  )}
                  <Col>
                    <Alert onClick={() => this.handleDeleteScript()} variant="danger" style={{ cursor: "pointer" }}>
                      DELETE
                    </Alert>
                  </Col>
                </Row>
              )}

              {this.state.createScriptVisible === true && (
                <Form onSubmit={this.handleCreateScript}>
                  <Form.Group controlId="scriptName" className="mb-3">
                    <Form.Label>Script name</Form.Label>
                    <InputGroup>
                      <Form.Control
                        required
                        value={this.state.scriptName}
                        onFocus={(e) => e.target.select()}
                        onChange={(e) => {
                          const scriptName = e.target.value;
                          if (/^[a-zA-Z0-9._-]*$/.test(scriptName)) {
                            this.setState((prevState) => ({
                              scriptName,
                              functionName: `${prevState.returnModuleName}-${scriptName}`,
                              ontologyFragment: scriptName,
                            }));
                          }
                        }}
                      />
                      <Form.Select
                        value={this.state.scriptType}
                        onChange={(e) => this.setState({ scriptType: e.target.value })}
                        style={{ maxWidth: "100px" }}
                      >
                        <option value=".ttl">.ttl</option>
                        <option value=".sms.ttl">.sms.ttl</option>
                      </Form.Select>
                    </InputGroup>
                  </Form.Group>
                  <Form.Group controlId="ontologyURI" className="mb-3">
                    <Form.Label>Ontology URI</Form.Label>
                    <InputGroup>
                      <Form.Control
                        required
                        type={"url"}
                        value={this.state.ontologyURI}
                        onFocus={(e) => e.target.select()}
                        onChange={(e) => this.setState({ ontologyURI: e.target.value })}
                      />
                      &nbsp; / &nbsp;
                      <Form.Control
                        required
                        value={this.state.ontologyFragment}
                        onFocus={(e) => e.target.select()}
                        onChange={(e) => this.setState({ ontologyFragment: e.target.value })}
                      />
                      &nbsp; - &nbsp;
                      <Form.Control
                        required
                        value={this.state.ontologyVersion}
                        onFocus={(e) => e.target.select()}
                        onChange={(e) => this.setState({ ontologyVersion: e.target.value })}
                      />
                    </InputGroup>
                  </Form.Group>
                  <Form.Group controlId="returnModuleName" className="mb-3">
                    <Form.Label>Return module name</Form.Label>
                    <InputGroup>
                      <Form.Control
                        required
                        value={this.state.returnModuleName}
                        onFocus={(e) => e.target.select()}
                        onChange={(e) => {
                          const returnModuleName = e.target.value;
                          this.setState((prevState) => ({
                            returnModuleName,
                            functionName: `${returnModuleName}-${prevState.scriptName}`,
                          }));
                        }}
                      />
                      &nbsp; _ &nbsp;
                      <Form.Control
                        required
                        value={this.state.returnSuffix}
                        onFocus={(e) => e.target.select()}
                        onChange={(e) => this.setState({ returnSuffix: e.target.value })}
                      />
                    </InputGroup>
                  </Form.Group>
                  <Form.Group controlId="functionName" className="mb-3">
                    <Form.Label>Function name</Form.Label>
                    <InputGroup>
                      <Form.Control
                        required
                        defaultValue={`${this.state.returnModuleName}-${this.state.scriptName}`}
                        value={this.state.functionName}
                        onFocus={(e) => e.target.select()}
                        onChange={(e) => this.setState({ functionName: e.target.value })}
                      />
                    </InputGroup>
                  </Form.Group>
                  <Button variant="primary" type="submit">
                    Create script
                  </Button>
                </Form>
              )}
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

export default ScriptActionsModuleModal;
