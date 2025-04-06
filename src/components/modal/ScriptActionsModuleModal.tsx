import React from "react";

import { Alert, Button, Col, Container, Form, Modal, Row, InputGroup } from "react-bootstrap";
import Rest from "../../rest/Rest.tsx";
import { DEFAULT_SCRIPT_PREFIX } from "@config/env.ts";

class ScriptActionsModuleModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      scriptPath: null,
      displayName: null,
      type: null,
      isLoaded: false,
      createScriptVisible: false,
      modalVisible: false,
      scriptName: "",
      scriptType: ".ttl",
      scriptPrefix: "",
      fragment: "",
      ontologyVersion: "",
      returnModuleName: "",
      returnSuffix: "",
      functionName: "",
      showTemplateFunctions: true,
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
    let {
      scriptPath,
      scriptName,
      scriptType,
      scriptPrefix,
      fragment,
      ontologyVersion,
      returnModuleName,
      returnSuffix,
      functionName,
      showTemplateFunctions,
    } = this.state;
    const ontologyURI = `${scriptPrefix}${fragment}${ontologyVersion}`;
    let fullReturnModuleName = `${returnModuleName}${returnSuffix}`;

    if (!showTemplateFunctions) {
      functionName = null;
      fullReturnModuleName = null;
    }

    try {
      const response = await Rest.createScript(
        ontologyURI,
        scriptName,
        scriptPath,
        scriptType,
        showTemplateFunctions ? fullReturnModuleName : null,
        showTemplateFunctions ? functionName : null,
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
                          this.setState({
                            createScriptVisible: true,
                            scriptName: folderName,
                            scriptPrefix: DEFAULT_SCRIPT_PREFIX || "",
                            fragment: folderName,
                            returnModuleName: "",
                            functionName: "",
                            returnSuffix: "_Return",
                            ontologyVersion: "-0.1",
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
                              fragment: scriptName,
                            }));
                          }
                        }}
                      />
                      <Form.Select
                        value={this.state.scriptType}
                        onChange={(e) => this.setState({ scriptType: e.target.value })}
                        style={{ maxWidth: "8rem" }}
                      >
                        <option value=".ttl">.ttl</option>
                        <option value=".sms.ttl">.sms.ttl</option>
                      </Form.Select>
                    </InputGroup>
                  </Form.Group>
                  <Form.Group controlId="ontologyURI" className="mb-3">
                    <Form.Label>Ontology URI</Form.Label>
                    <div className="border rounded p-3">
                      <Row className="g-0">
                        <Col xs={7}>
                          <Form.Label>Prefix</Form.Label>
                          <Form.Control
                            required
                            type="url"
                            value={this.state.scriptPrefix}
                            onFocus={(e) => e.target.select()}
                            onChange={(e) => this.setState({ scriptPrefix: e.target.value })}
                            className="rounded-start rounded-0"
                          />
                        </Col>
                        <Col xs={4}>
                          <Form.Label>Fragment</Form.Label>
                          <Form.Control
                            value={this.state.fragment}
                            onFocus={(e) => e.target.select()}
                            onChange={(e) => this.setState({ fragment: e.target.value })}
                            className="rounded-0 border-start-0"
                          />
                        </Col>
                        <Col xs={1}>
                          <Form.Label>Version</Form.Label>
                          <Form.Control
                            value={this.state.ontologyVersion}
                            onFocus={(e) => e.target.select()}
                            onChange={(e) => this.setState({ ontologyVersion: e.target.value })}
                            className="rounded-0 border-start-0 rounded-end"
                          />
                        </Col>
                      </Row>
                    </div>
                  </Form.Group>

                  <div className="border rounded p-3">
                    <Form.Group controlId="functionsToggle" className="mb-3">
                      <Form.Check
                        type="checkbox"
                        label="Include template functions"
                        checked={this.state.showTemplateFunctions}
                        onChange={(e) =>
                          this.setState({
                            showTemplateFunctions: e.target.checked,
                            returnModuleName: "",
                            returnSuffix: "_Return",
                            functionName: "",
                          })
                        }
                      />
                    </Form.Group>
                    {this.state.showTemplateFunctions && (
                      <>
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
                            <Form.Control
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
                              placeholder="<return module name>-<script name>"
                              value={this.state.functionName}
                              onFocus={(e) => e.target.select()}
                              onChange={(e) => this.setState({ functionName: e.target.value })}
                            />
                          </InputGroup>
                        </Form.Group>
                      </>
                    )}
                  </div>
                  <Button variant="primary" type="submit" className="mt-3">
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
