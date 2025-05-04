// @components/modal/DebugModal.js
import { Modal, Button, Table, Tabs, Tab, Form, InputGroup } from "react-bootstrap";
import { use, useEffect, useState } from "react";
import Rest from "@rest/Rest.tsx";

import dayjs from "dayjs";
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DISPLAY_NAME, TRANSFORMATION } from "@constants/vocabulary";
import Loading from "@components/Loading";

const DebugModal = ({ show, onHide, id, name, executions }) => {
  const [executionIdToCompare, setexecutionIdToCompare] = useState("");
  const [targetVar, setTargetVar] = useState("");
  const [graphPatternOrigin, setGraphPatternOrigin] = useState("");
  const [graphPatternElimination, setGraphPatternElimination] = useState("");
  const [isComparing, setIsComparing] = useState(false);
  const [modulesExecutions, setmodulesExecutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [debugData, setDebugData] = useState([]);

  const [comparisonResult, setComparisonResult] = useState(null);
  const [variableOriginResult, setVariableOriginResult] = useState(null);
  const [tripleOriginResult, setTripleOriginResult] = useState(null);
  const [tripleEliminationResult, setTripleEliminationResult] = useState(null);

  const comparableExecutions = executions.filter((exec) => exec[DISPLAY_NAME] === name && exec[TRANSFORMATION] !== id);

  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("modules");

  useEffect(() => {
    fetchModulesData(id);
    setLoading(false);
  }, [id]);

  const openJsonInNewTab = (jsonData) => {
    const jsonString = JSON.stringify(jsonData, null, 2);
    const newWindow = window.open();
    newWindow.document.open();
    newWindow.document.write("<html><body><pre>" + jsonString + "</pre></body></html>");
    newWindow.document.close();
  };

  const fetchExecution = async (id) => {
    try {
      const response = await Rest.getExecution(id);
      openJsonInNewTab(response);
    } catch (error) {
      console.error("Failed to fetch modules data:", error);
    }
  };

  const fetchExecutions = async () => {
    try {
      const response = await Rest.getDebugExecutions();
      setDebugData(response);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch executions:", err);
      setLoading(false);
    }
  };

  const fetchModulesData = async (id) => {
    try {
      const responseModules = await Rest.getExecutionModules(id);
      console.log("API Modules Response:", responseModules);
      setmodulesExecutions(responseModules);
    } catch (error) {
      console.error("Failed to fetch modules data:", error);
    }
  };

  const compareExecutions = async (id1, id2) => {
    try {
      const comparison = await Rest.compareExecutions(id1, id2);
      setComparisonResult(comparison);
      return comparison;
    } catch (error) {
      console.error("Failed to fetch modules data:", error);
    }
  };

  const findVariableOrigin = async (id, targetVar) => {
    try {
      const response = await Rest.findVariableOrigin(id, targetVar);
      setVariableOriginResult(response);
      return response;
    } catch (error) {
      console.error("Failed to fetch modules data:", error);
    }
  };

  const findTripleOrigin = async (id, pattern) => {
    try {
      const response = await Rest.findTripleOrigin(id, encodeURI(pattern));
      setTripleOriginResult(response);
      return response;
    } catch (error) {
      console.error("Failed to fetch modules data:", error);
    }
  };

  const findTripleElimination = async (id, pattern) => {
    try {
      const response = await Rest.findTripleElimination(id, encodeURI(pattern));
      setTripleEliminationResult(response);
      return response;
    } catch (error) {
      console.error("Failed to fetch modules data:", error);
    }
  };

  return (
    <Modal show={show} onHide={onHide} dialogClassName="modal-80w" aria-labelledby="example-custom-modal-styling-title">
      <Modal.Header closeButton>
        <Modal.Title>Debug API</Modal.Title>
        <Modal.Body>
          <h5>
            {name} [{id}]
          </h5>
        </Modal.Body>
        <Button variant="secondary" onClick={() => fetchExecution(id)}>
          Get raw execution JSON <FontAwesomeIcon icon={faExternalLinkAlt} />
        </Button>
      </Modal.Header>

      <Modal.Body className="mx-5">
        <Tabs
          defaultActiveKey="modules"
          id="debug-modal-tabs"
          className="mb-3"
          activeKey={activeTab}
          onSelect={(k) => {
            setActiveTab(k);
            setError(null); // Reset error when switching tabs
            // Optionally reset other tab-specific state here as well
          }}
        >
          <Tab eventKey="modules" title="Modules Executions" unmountOnExit>
            <h4 className="mt-3">Modules Executions</h4>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Module Id</th>
                  <th>Start Time</th>
                  <th>Duration [ms] </th>
                  <th>Input Triple Count</th>
                  <th>Output Triple Count</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <div className="mt-4 d-flex align-items-center">
                    <div className="spinner-border text-primary me-2" role="status" />
                    <span>Loading...</span>
                  </div>
                )}
                {modulesExecutions &&
                  modulesExecutions.map((module, idx) => (
                    <tr key={idx}>
                      <td>{module.has_module_id.split("/").pop()}</td>

                      <td>{dayjs(module.start_date).format("YYYY-MM-DD HH:mm:ss.SSS")}</td>
                      <td>{module.duration}</td>
                      <td>{module.input_triple_count}</td>
                      <td>{module.output_triple_count}</td>
                    </tr>
                  ))}
              </tbody>
            </Table>
          </Tab>

          <Tab eventKey="compare" title="Compare Executions" unmountOnExit>
            <div>
              <Form
                onSubmit={async (e) => {
                  e.preventDefault();
                  setIsComparing(true);
                  setError(null);
                  setComparisonResult(null);

                  const result = await compareExecutions(id, executionIdToCompare);
                  if (result.status) {
                    setError(result.message);
                    setComparisonResult(null);
                  } else {
                    setError(null);
                    setComparisonResult(result);
                  }
                  setIsComparing(false);
                }}
              >
                <Form.Group controlId="executionIdToCompare" className="mb-3 w-50">
                  <Form.Label>Find first difference in two executions</Form.Label>

                  <InputGroup>
                    <Form.Select
                      value={executionIdToCompare}
                      onChange={(e) => setexecutionIdToCompare(e.target.value)}
                      disabled={isComparing}
                    >
                      <option value="">Select execution ID to compare</option>
                      {comparableExecutions.map((exec) => (
                        <option key={exec[TRANSFORMATION]} value={exec[TRANSFORMATION].split("/").pop()}>
                          {exec[TRANSFORMATION]}
                        </option>
                      ))}
                    </Form.Select>
                    <Button variant="primary" type="submit" disabled={isComparing || !executionIdToCompare}>
                      Compare executions
                    </Button>
                  </InputGroup>
                </Form.Group>
              </Form>

              {isComparing && (
                <div className="mt-4 d-flex align-items-center">
                  <div className="spinner-border text-primary me-2" role="status" />
                  <span>Loading...</span>
                </div>
              )}

              {error && (
                <div className="alert alert-danger mt-3" role="alert">
                  {error}
                </div>
              )}

              {comparisonResult && (
                <div className="mt-4">
                  <h5>Comparison Results</h5>
                  <div className="border rounded p-3 bg-light">
                    {comparisonResult.are_same ? (
                      <p>Executions are the same.</p>
                    ) : (
                      <>
                        <p>
                          <strong>First difference found in module:</strong>{" "}
                          {comparisonResult.difference_found_in?.has_module_id?.split("/").pop()}
                        </p>
                        <p>
                          <strong>Module ID:</strong> {comparisonResult.difference_found_in?.has_module_id}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </Tab>

          <Tab eventKey="variable" title="Find Variable Origin" unmountOnExit>
            <div>
              <Form
                onSubmit={async (e) => {
                  e.preventDefault();
                  setIsComparing(true);
                  setError(null);
                  setVariableOriginResult(null);

                  const result = await findVariableOrigin(id, targetVar);
                  if (result.status) {
                    setError(result.message);
                    setVariableOriginResult(null);
                  } else {
                    setError(null);
                  }
                  setVariableOriginResult(result);
                  setIsComparing(false);
                }}
              >
                <Form.Group controlId="findVariableOrigin" className="mb-3 w-50">
                  <Form.Label>Variable name</Form.Label>

                  <InputGroup>
                    <Form.Control
                      type="text"
                      value={targetVar}
                      onFocus={(e) => e.target.select()}
                      onChange={(e) => setTargetVar(e.target.value)}
                      placeholder="Enter variable name"
                    />
                    <Button variant="primary" type="submit" disabled={isComparing}>
                      {isComparing ? "Loading..." : "Compare Executions"}
                    </Button>
                  </InputGroup>
                </Form.Group>
              </Form>
              {isComparing && (
                <div className="mt-4 d-flex align-items-center">
                  <div className="spinner-border text-primary me-2" role="status" />
                  <span>Loading...</span>
                </div>
              )}
              {error && (
                <div className="alert alert-danger mt-3" role="alert">
                  {error}
                </div>
              )}

              {variableOriginResult && variableOriginResult.length > 0 && (
                <div className="mt-4">
                  <h5>Variable Origin Results</h5>
                  {variableOriginResult.map((module, index) => (
                    <div key={module.id || index} className="border rounded p-3 bg-light mb-3">
                      <p>
                        <strong>Created in module:</strong> {module.has_module_id?.split("/").pop()}
                      </p>
                      <p>
                        <strong>Module ID:</strong> {module.has_module_id}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Tab>
          <Tab eventKey="tripleOrigin" title="Find Triple Origin" unmountOnExit>
            <div>
              <Form
                onSubmit={async (e) => {
                  e.preventDefault();
                  setIsComparing(true);
                  setError(null);
                  setTripleOriginResult(null);

                  const result = await findTripleOrigin(id, graphPatternOrigin);
                  if (result.status) {
                    setError(result.message);
                    setTripleOriginResult(null);
                  } else {
                    setError(null);
                  }
                  setTripleOriginResult(result);
                  setIsComparing(false);
                }}
              >
                <Form.Group controlId="findTripleOrigin" className="mb-3 w-75">
                  <Form.Label>Triple pattern</Form.Label>

                  <InputGroup>
                    <Form.Control
                      type="text"
                      value={graphPatternOrigin}
                      onFocus={(e) => e.target.select()}
                      onChange={(e) => setGraphPatternOrigin(e.target.value)}
                      placeholder="<http://some/subject> <http://some/predicate> <http://some/object>"
                    />
                    <Button variant="primary" type="submit" disabled={isComparing}>
                      {isComparing ? "Loading..." : "Compare Executions"}
                    </Button>
                  </InputGroup>
                </Form.Group>
              </Form>
              {error && (
                <div className="alert alert-danger mt-3" role="alert">
                  {error}
                </div>
              )}
              {isComparing && (
                <div className="mt-4 d-flex align-items-center">
                  <div className="spinner-border text-primary me-2" role="status" />
                  <span>Loading...</span>
                </div>
              )}

              {tripleOriginResult && tripleOriginResult.length > 0 && (
                <div className="mt-4">
                  <h5>Triple Origin Results</h5>
                  {tripleOriginResult.map((module, index) => (
                    <div key={module.id || index} className="border rounded p-3 bg-light mb-3">
                      <p>
                        <strong>Created in module:</strong> {module.has_module_id?.split("/").pop()}
                      </p>
                      <p>
                        <strong>Module ID:</strong> {module.has_module_id}
                      </p>
                      <p>
                        <strong>Input Triple Count:</strong> {module.input_triple_count}
                      </p>
                      <p>
                        <strong>Output Triple Count:</strong> {module.output_triple_count}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Tab>
          <Tab eventKey="tripleElimination" title="Find Triple Elimination" unmountOnExit>
            <div>
              <Form
                onSubmit={async (e) => {
                  e.preventDefault();
                  setIsComparing(true);
                  setError(null);
                  setTripleEliminationResult(null);

                  const result = await findTripleElimination(id, graphPatternElimination);
                  if (result.status) {
                    setError(result.message);
                    setTripleEliminationResult(null);
                  } else {
                    setError(null);
                  }
                  setTripleEliminationResult(result);
                  setIsComparing(false);
                }}
              >
                <Form.Group controlId="findTripleElimination" className="mb-3 w-75">
                  <Form.Label>Triple pattern</Form.Label>

                  <InputGroup>
                    <Form.Control
                      type="text"
                      value={graphPatternElimination}
                      onFocus={(e) => e.target.select()}
                      onChange={(e) => setGraphPatternElimination(e.target.value)}
                      placeholder="<http://some/subject> <http://some/predicate> <http://some/object>"
                    />
                    <Button variant="primary" type="submit" disabled={isComparing}>
                      {isComparing ? "Loading..." : "Compare Executions"}
                    </Button>
                  </InputGroup>
                </Form.Group>
              </Form>
              {error && (
                <div className="alert alert-danger mt-3" role="alert">
                  {error}
                </div>
              )}
              {isComparing && (
                <div className="mt-4 d-flex align-items-center">
                  <div className="spinner-border text-primary me-2" role="status" />
                  <span>Loading...</span>
                </div>
              )}

              {tripleEliminationResult && tripleEliminationResult.length > 0 && (
                <div className="mt-4">
                  <h5>Triple Elimination Results</h5>
                  {tripleEliminationResult.map((module, index) => (
                    <div key={module.id || index} className="border rounded p-3 bg-light mb-3">
                      <p>
                        <strong>Eliminated in module:</strong> {module.has_module_id?.split("/").pop()}
                      </p>
                      <p>
                        <strong>Module ID:</strong> {module.has_module_id}
                      </p>
                      <p>
                        <strong>Input Triple Count:</strong> {module.input_triple_count}
                      </p>
                      <p>
                        <strong>Output Triple Count:</strong> {module.output_triple_count}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Tab>
        </Tabs>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DebugModal;
