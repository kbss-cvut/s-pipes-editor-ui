import React from "react";

import { Alert, Button, Col, Container, Form, Modal, Row, InputGroup } from "react-bootstrap";
import Rest from "../../rest/Rest.tsx";
import CreateScriptForm from "../forms/CreateScriptForm.tsx";
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
                            showTemplateFunctions: true,
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
                <CreateScriptForm
                  state={this.state}
                  setState={(newState) => this.setState(newState)}
                  onSubmit={this.handleCreateScript}
                />
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
