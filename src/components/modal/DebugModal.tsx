// @components/modal/DebugModal.js
import { Modal, Button, Table, Tabs, Tab, Form, InputGroup } from "react-bootstrap";
import { use, useEffect, useMemo, useState } from "react";
import Rest from "@rest/Rest.tsx";

import dayjs from "dayjs";
import { DISPLAY_NAME, TRANSFORMATION } from "@constants/vocabulary";
import { GraphDBLink } from "@pages/ExecutionPage";

const popModuleName = (module) => module.has_module_id?.split("/").pop();
const popId = (exec) => exec[TRANSFORMATION].split("/").pop();

const LoadingSpinner = () => (
  <div className="mt-4 d-flex align-items-center">
    <div className="spinner-border text-primary me-2" role="status" />
    <span>Loading...</span>
  </div>
);

const ErrorAlert = ({ message }) => (
  <div className="alert alert-danger mt-3" role="alert">
    {message}
  </div>
);

const DebugModal = ({ show, onHide, id, name, modulesData }) => {
  const [state, setState] = useState({
    loading: true,
    isComparing: false,
    executionIdToCompare: "",
    targetVar: "",
    graphPatternOrigin: "",
    graphPatternElimination: "",
    modulesExecutions: modulesData,
    debugData: [],
    comparisonResult: null,
    variableOriginResult: null,
    tripleOriginResult: null,
    tripleEliminationResult: null,
    error: null,
    activeTab: "modules",
  });

  useEffect(() => {
    fetchExecutions();
  }, []);

  const comparableExecutions = useMemo(
    () => state.debugData.filter((exec) => popId(exec) !== id),
    [state.debugData, id],
  );

  const fetchExecutions = async () => {
    try {
      const response = await Rest.getExecutions();
      const comparableExecutions = response.filter((exec) => popId(exec) !== id);
      setState({ ...state, debugData: response, loading: false });
    } catch (err) {
      console.error("Failed to fetch executions:", err);
      setState({ ...state, loading: false });
    }
  };

  const compareExecutions = async (id1, id2) => {
    try {
      const response = await Rest.compareExecutions(id1, id2);
      setState({ ...state, comparisonResult: response });
      return response;
    } catch (error) {
      console.error("Failed to fetch modules data:", error);
    }
  };

  const findVariableOrigin = async (id, targetVar) => {
    try {
      const response = await Rest.findVariableOrigin(id, targetVar);
      setState({ ...state, variableOriginResult: response });
      return response;
    } catch (error) {
      console.error("Failed to fetch modules data:", error);
    }
  };

  const findTripleOrigin = async (id, pattern) => {
    try {
      const response = await Rest.findTripleOrigin(id, encodeURI(pattern));
      setState({ ...state, tripleOriginResult: response });
      return response;
    } catch (error) {
      console.error("Failed to fetch modules data:", error);
    }
  };

  const findTripleElimination = async (id, pattern) => {
    try {
      const response = await Rest.findTripleElimination(id, encodeURI(pattern));
      setState({ ...state, tripleEliminationResult: response });
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
      </Modal.Header>

      <Modal.Body className="mx-5">
        <Tabs
          id="debug-modal-tabs"
          className="mb-3"
          activeKey={state.activeTab}
          onSelect={(k) => {
            setState({ ...state, activeTab: k, error: null });
          }}
        >
          <Tab eventKey="modules" title="Modules Executions" unmountOnExit>
            <h4 className="mt-3">Modules Executions</h4>
            {state.isComparing && <LoadingSpinner />}
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Module Id</th>
                  <th>Start Time</th>
                  <th>Duration [ms] </th>
                  <th>Input Triple Count</th>
                  <th>Input</th>
                  <th>Output Triple Count</th>
                  <th>Output</th>
                </tr>
              </thead>
              <tbody>
                {state.modulesExecutions &&
                  state.modulesExecutions.map((module, idx) => (
                    <tr key={idx}>
                      <td>{popModuleName(module)}</td>
                      <td>{dayjs(module.start_date).format("YYYY-MM-DD HH:mm:ss.SSS")}</td>
                      <td>{module.duration}</td>
                      <td>{module.input_triple_count}</td>
                      <td>
                        <GraphDBLink id={module.has_rdf4j_input && module.has_rdf4j_input.id} />
                      </td>
                      <td>{module.output_triple_count}</td>
                      <td>
                        <GraphDBLink id={module.has_rdf4j_output && module.has_rdf4j_output.id} />
                      </td>
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
                  setState({ ...state, isComparing: true, error: null, comparisonResult: null });

                  const result = await compareExecutions(id, state.executionIdToCompare);
                  if (result.status) {
                    setState({ ...state, error: result.message, comparisonResult: null, isComparing: false });
                  } else {
                    setState({ ...state, error: null, comparisonResult: result, isComparing: false });
                  }
                }}
              >
                <Form.Group controlId="executionIdToCompare" className="mb-3 w-50">
                  <Form.Label>Find first difference in two executions</Form.Label>

                  <InputGroup>
                    <Form.Select
                      value={state.executionIdToCompare}
                      onChange={(e) => setState({ ...state, executionIdToCompare: e.target.value })}
                      disabled={state.isComparing}
                    >
                      <option value="">Select execution ID to compare</option>
                      {comparableExecutions.map((exec) => (
                        <option key={exec[TRANSFORMATION]} value={popId(exec)}>
                          {exec[DISPLAY_NAME]} [{popId(exec)}]
                        </option>
                      ))}
                    </Form.Select>
                    <Button variant="primary" type="submit" disabled={state.isComparing || !state.executionIdToCompare}>
                      Compare executions
                    </Button>
                  </InputGroup>
                </Form.Group>
              </Form>

              {state.isComparing && <LoadingSpinner />}
              {state.error && <ErrorAlert message={state.error} />}

              {state.comparisonResult && (
                <div className="mt-4">
                  <h5>Comparison Results</h5>
                  <div className="border rounded p-3 bg-light">
                    {state.comparisonResult.are_same ? (
                      <p>Executions are the same.</p>
                    ) : (
                      <>
                        <p>
                          <strong>First difference found in module:</strong>{" "}
                          {popModuleName(state.comparisonResult.difference_found_in)}
                        </p>
                        <p>
                          <strong>Module ID:</strong> {state.comparisonResult.difference_found_in?.has_module_id}
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
                  setState({ ...state, isComparing: true, error: null, variableOriginResult: null });

                  const result = await findVariableOrigin(id, state.targetVar);
                  if (result.status) {
                    setState({ ...state, error: result.message, variableOriginResult: null });
                  } else {
                    setState({ ...state, error: null, variableOriginResult: result, isComparing: false });
                  }
                }}
              >
                <Form.Group controlId="findVariableOrigin" className="mb-3 w-50">
                  <Form.Label>Variable name</Form.Label>

                  <InputGroup>
                    <Form.Control
                      type="text"
                      value={state.targetVar}
                      onFocus={(e) => e.target.select()}
                      // onChange={(e) => setTargetVar(e.target.value)}
                      onChange={(e) => setState({ ...state, targetVar: e.target.value })}
                      placeholder="Enter variable name"
                    />
                    <Button variant="primary" type="submit" disabled={state.isComparing}>
                      {state.isComparing ? "Loading..." : "Compare Executions"}
                    </Button>
                  </InputGroup>
                </Form.Group>
              </Form>
              {state.isComparing && <LoadingSpinner />}
              {state.error && <ErrorAlert message={state.error} />}

              {state.variableOriginResult && state.variableOriginResult.length > 0 && (
                <div className="mt-4">
                  <h5>Variable Origin Results</h5>
                  {state.variableOriginResult.map((module, index) => (
                    <div key={module.id || index} className="border rounded p-3 bg-light mb-3">
                      <p>
                        <strong>Created in module:</strong> {popModuleName(module)}
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
                  setState({ ...state, isComparing: true, error: null, tripleOriginResult: null });

                  const result = await findTripleOrigin(id, state.graphPatternOrigin);
                  if (result.status) {
                    setState({ ...state, error: result.message, tripleOriginResult: null, isComparing: false });
                  } else {
                    setState({ ...state, error: null, tripleOriginResult: result, isComparing: false });
                  }
                }}
              >
                <Form.Group controlId="findTripleOrigin" className="mb-3 w-75">
                  <Form.Label>Find out in which module a triple was created</Form.Label>

                  <InputGroup>
                    <Form.Control
                      type="text"
                      value={state.graphPatternOrigin}
                      onFocus={(e) => e.target.select()}
                      // onChange={(e) => setGraphPatternOrigin(e.target.value)}
                      onChange={(e) => setState({ ...state, graphPatternOrigin: e.target.value })}
                      placeholder="<http://some/subject> <http://some/predicate> <http://some/object>"
                    />
                    <Button variant="primary" type="submit" disabled={state.isComparing}>
                      {state.isComparing ? "Loading..." : "Compare Executions"}
                    </Button>
                  </InputGroup>
                </Form.Group>
              </Form>
              {state.isComparing && <LoadingSpinner />}
              {state.error && <ErrorAlert message={state.error} />}
              {state.tripleOriginResult && state.tripleOriginResult.length > 0 && (
                <div className="mt-4">
                  <h5>Triple Origin Results</h5>
                  {state.tripleOriginResult.map((module, index) => (
                    <div key={module.id || index} className="border rounded p-3 bg-light mb-3">
                      <p>
                        <strong>Created in module:</strong> {popModuleName(module)}
                      </p>
                      <p>
                        <strong>Module ID:</strong> {module.has_module_id}
                      </p>
                      <p>
                        <strong>Input Triple Count:</strong> {module.input_triple_count}
                      </p>
                      <p>
                        <b>Input triples: </b>
                        <GraphDBLink id={module.has_rdf4j_input && module.has_rdf4j_input.id} />
                      </p>
                      <p>
                        <strong>Output Triple Count:</strong> {module.output_triple_count}
                      </p>
                      <p>
                        <b>Output triples: </b>
                        <GraphDBLink id={module.has_rdf4j_output && module.has_rdf4j_output.id} />
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
                  setState({ ...state, isComparing: true, error: null, tripleEliminationResult: null });

                  const result = await findTripleElimination(id, state.graphPatternElimination);
                  if (result.status) {
                    setState({ ...state, error: result.message, tripleEliminationResult: null, isComparing: false });
                  } else {
                    setState({ ...state, error: null, tripleEliminationResult: result, isComparing: false });
                  }
                }}
              >
                <Form.Group controlId="findTripleElimination" className="mb-3 w-75">
                  <Form.Label>Find out in which module a triple was eliminated</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type="text"
                      value={state.graphPatternElimination}
                      onFocus={(e) => e.target.select()}
                      onChange={(e) => setState({ ...state, graphPatternElimination: e.target.value })}
                      placeholder="<http://some/subject> <http://some/predicate> <http://some/object>"
                    />
                    <Button variant="primary" type="submit" disabled={state.isComparing}>
                      {state.isComparing ? "Loading..." : "Compare Executions"}
                    </Button>
                  </InputGroup>
                </Form.Group>
              </Form>

              {state.isComparing && <LoadingSpinner />}
              {state.error && <ErrorAlert message={state.error} />}

              {state.tripleEliminationResult && state.tripleEliminationResult.length > 0 && (
                <div className="mt-4">
                  <h5>Triple Elimination Results</h5>
                  {state.tripleEliminationResult.map((module, index) => (
                    <div key={module.id || index} className="border rounded p-3 bg-light mb-3">
                      <p>
                        <strong>Eliminated in module:</strong> {popModuleName(module)}
                      </p>
                      <p>
                        <strong>Module ID:</strong> {module.has_module_id}
                      </p>
                      <p>
                        <strong>Input Triple Count:</strong> {module.input_triple_count}
                      </p>
                      <p>
                        <b>Input triples: </b>
                        <GraphDBLink id={module.has_rdf4j_input && module.has_rdf4j_input.id} />
                      </p>
                      <p>
                        <strong>Output Triple Count:</strong> {module.output_triple_count}
                      </p>
                      <p>
                        <b>Output triples: </b>
                        <GraphDBLink id={module.has_rdf4j_output && module.has_rdf4j_output.id} />
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
