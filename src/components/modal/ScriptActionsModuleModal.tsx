import React, { useState, useEffect } from "react";
import { Alert, Button, Col, Container, Modal, Row } from "react-bootstrap";
import Rest from "../../rest/Rest";
import CreateScriptForm from "../forms/CreateScriptForm";
import { DEFAULT_SCRIPT_PREFIX } from "@config/env";

const ScriptActionsModuleModal = ({ scriptPath, displayName, type, handleRefresh }) => {
  const [state, setState] = useState({
    scriptPath: null,
    displayName: null,
    type: null,
    isLoaded: false,
    createScriptVisible: false,
    modalVisible: false,
    scriptName: "",
    scriptType: ".sms.ttl",
    scriptPrefix: "",
    fragment: "",
    ontologyVersion: "",
    returnModuleName: "",
    returnSuffix: "",
    functionName: "",
    showTemplateFunctions: true,
    functionArguments: [],
  });

  useEffect(() => {
    if (scriptPath && displayName && type) {
      setState((prevState) => ({
        ...prevState,
        scriptPath,
        displayName,
        type,
        isLoaded: true,
        modalVisible: true,
      }));
    }
  }, [scriptPath, displayName, type]);

  const handleCreateScript = async (event) => {
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
      functionArguments,
    } = state;

    const filename = `${scriptName}${scriptType}`;
    const ontologyURI = `${scriptPrefix}${fragment}${ontologyVersion}`;
    let fullReturnModuleName = `${returnModuleName}${returnSuffix}`;

    if (!showTemplateFunctions) {
      fullReturnModuleName = null;
      functionName = null;
    }

    try {
      await Rest.createScript(
        ontologyURI,
        filename,
        scriptPath,
        showTemplateFunctions ? fullReturnModuleName : null,
        showTemplateFunctions ? functionName : null,
        functionArguments,
      );

      handleRefresh();
      setState((prevState) => ({
        ...prevState,
        isLoaded: false,
        modalVisible: false,
        createScriptVisible: false,
        functionArguments: [],
      }));
    } catch (error) {
      alert("An error occurred during script creation.");
      console.error(`An error occurred during script creation: ${error}`);
    }
  };

  const handleEditScript = () => {
    window.location.href = "/script?file=" + state.scriptPath;
  };

  const handleDeleteScript = async () => {
    try {
      await Rest.deleteScript(state.scriptPath);
      handleRefresh();
      setState((prevState) => ({
        ...prevState,
        isLoaded: false,
        modalVisible: false,
      }));
    } catch (error) {
      alert("An error occurred during script deletion.");
      console.error(`An error occurred during script deletion: ${error}`);
    }
  };

  const handleClose = () => {
    setState((prevState) => ({
      ...prevState,
      isLoaded: false,
      modalVisible: false,
      createScriptVisible: false,
      functionArguments: [],
    }));
  };

  if (!state.isLoaded) {
    return null;
  }

  return (
    <Modal
      show={state.modalVisible}
      onHide={handleClose}
      dialogClassName="modal-80w"
      aria-labelledby="example-custom-modal-styling-title"
    >
      <Modal.Header closeButton>
        <Modal.Title>{state.displayName}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Container>
          {!state.createScriptVisible && (
            <Row>
              {state.type === "folder" && (
                <Col>
                  <Alert
                    onClick={() => {
                      const folderName = state.displayName || "";
                      setState((prevState) => ({
                        ...prevState,
                        createScriptVisible: true,
                        scriptName: folderName,
                        scriptPrefix: DEFAULT_SCRIPT_PREFIX || "",
                        fragment: folderName,
                        returnModuleName: "",
                        functionName: "",
                        returnSuffix: "_Return",
                        ontologyVersion: "-0.1",
                        showTemplateFunctions: true,
                      }));
                    }}
                    variant="info"
                    style={{ cursor: "pointer" }}
                  >
                    CREATE SCRIPT
                  </Alert>
                </Col>
              )}
              {state.type === "file-text" && (
                <Col>
                  <Alert onClick={handleEditScript} variant="info" style={{ cursor: "pointer" }}>
                    EDIT
                  </Alert>
                </Col>
              )}
              <Col>
                <Alert onClick={handleDeleteScript} variant="danger" style={{ cursor: "pointer" }}>
                  DELETE
                </Alert>
              </Col>
            </Row>
          )}

          {state.createScriptVisible && (
            <CreateScriptForm state={state} setState={setState} onSubmit={handleCreateScript} />
          )}
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ScriptActionsModuleModal;
