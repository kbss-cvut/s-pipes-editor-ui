import React, { useState, useEffect } from "react";
import { Alert, Button, Form, Modal, ButtonGroup, Spinner } from "react-bootstrap";
import Rest from "@rest/Rest.js";
import JSONPretty from "react-json-pretty";
import "react-json-pretty/themes/monikai.css";
import jsonld from "jsonld";

const ModuleExecutionModal = (props) => {
  const [isVisible, setIsVisible] = useState(false);
  const [moduleData, setModuleData] = useState({
    moduleURI: null,
    moduleLabel: null,
    scriptPath: null,
    inputParams: "",
    inputData: "",
  });
  const [executionResponse, setExecutionResponse] = useState(null);
  const [outputFormat, setOutputFormat] = useState("jsonld");
  const [formattedOutput, setFormattedOutput] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const convertToNQuads = async (jsonLdData) => {
    try {
      const quads = await jsonld.toRDF(jsonLdData, { format: "application/n-quads" });
      setFormattedOutput(quads);
    } catch (error) {
      console.error("Conversion error:", error);
      setFormattedOutput("Error converting JSON-LD to N-Quads: " + error.message);
    }
  };
  const handleFormatChange = (format) => {
    setOutputFormat(format);
  };

  useEffect(() => {
    if (props.moduleURI && props.showModuleExecutionModal) {
      setIsVisible(true);
      setModuleData({
        moduleURI: props.moduleURI,
        moduleLabel: props.moduleLabel || "Module Execution",
        scriptPath: props.scriptPath,
        inputParams: props.inputParams,
        inputData: props.inputData,
      });
    }
  }, [props.moduleURI, props.moduleLabel, props.scriptPath, props.inputData, props.showModuleExecutionModal]);

  const handleClose = () => {
    setIsVisible(false);
    setExecutionResponse(null);
    setFormattedOutput(null);
    if (props.onClose) {
      props.onClose();
    }
  };

  const handleInputDataChange = (event) => {
    setModuleData({
      ...moduleData,
      inputData: event.target.value,
    });
  };

  const handleParamsChange = (event) => {
    setModuleData({
      ...moduleData,
      inputParams: event.target.value,
    });
  };
  const handleBack = () => {
    setExecutionResponse(null);
  };

  const executeModule = () => {
    setIsLoading(true);
    const inputToUse = moduleData.inputData || "";
    Rest.executeModule(moduleData.scriptPath, moduleData.moduleURI, inputToUse, moduleData.inputParams)
      .then((response) => {
        setExecutionResponse(response);
        setIsLoading(false);
        console.log("Module execution response:", response);
        convertToNQuads(response);
      })
      .catch((error) => {
        console.error("Error executing module:", error);
        setExecutionResponse({ error: "Failed to execute module" });
        setIsLoading(false);
      });
  };

  const handleRedirectExecution = () => {
    window.location.href = "/executions";
  };

  return (
    <Modal show={isVisible} onHide={handleClose} dialogClassName="modal-80w" aria-labelledby="module-execution-modal">
      <Modal.Header closeButton>
        <Modal.Title>{executionResponse ? "Module Execution Response" : moduleData.moduleLabel}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isLoading ? (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "200px" }}>
            <Spinner animation="border" role="status">
              <span className="sr-only">Loading...</span>
            </Spinner>
          </div>
        ) : executionResponse ? (
          <>
            <ButtonGroup className="mb-3">
              <Button
                variant={outputFormat === "jsonld" ? "primary" : "outline-primary"}
                onClick={() => handleFormatChange("jsonld")}
              >
                JSON-LD
              </Button>
              <Button
                variant={outputFormat === "nquads" ? "primary" : "outline-primary"}
                onClick={() => handleFormatChange("nquads")}
              >
                N-Quads
              </Button>
            </ButtonGroup>

            {outputFormat === "jsonld" ? (
              <JSONPretty id="json-pretty" data={executionResponse}></JSONPretty>
            ) : (
              <pre
                style={{
                  whiteSpace: "pre-wrap",
                  wordWrap: "break-word",
                  backgroundColor: "#f5f5f5",
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
              >
                {formattedOutput}
              </pre>
            )}
          </>
        ) : (
          <Form>
            <Form.Group controlId="moduleInputData">
              <Form.Label>Input Graph</Form.Label>
              <Form.Control
                as="textarea"
                value={moduleData.inputData || ""}
                onChange={handleInputDataChange}
                rows={8}
                placeholder="Enter input triples"
              />
            </Form.Group>
            <Form.Group controlId="moduleParams">
              <Form.Label>Parameters</Form.Label>
              <Form.Control
                type="text"
                value={moduleData.inputParams}
                onChange={handleParamsChange}
                placeholder="param1=value1&param2=value2"
              />
            </Form.Group>
          </Form>
        )}
      </Modal.Body>
      <Modal.Footer>
        {executionResponse ? (
          <>
            <Button variant="secondary" onClick={handleBack}>
              Back to Form
            </Button>
            <Button variant="secondary" onClick={handleRedirectExecution}>
              Go to ExecutionsPage
            </Button>
          </>
        ) : (
          <Button variant="primary" onClick={executeModule} disabled={isLoading}>
            {isLoading ? "Executing..." : "Execute Module"}
          </Button>
        )}
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModuleExecutionModal;
