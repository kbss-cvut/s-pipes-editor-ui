import { Button, Col, Form, InputGroup, Row } from "react-bootstrap";

const CreateScriptForm = ({ state, setState, onSubmit }) => {
  const {
    scriptName,
    scriptType,
    scriptPrefix,
    fragment,
    ontologyVersion,
    returnModuleName,
    returnSuffix,
    functionName,
    showTemplateFunctions,
    functionArguments = [],
  } = state;

  const addArgument = () => {
    setState({
      ...state,
      functionArguments: [
        ...functionArguments,
        {
          name: "",
          optional: false,
          label: "",
          comment: "",
        },
      ],
    });
  };
  const updateArgument = (index, field, value) => {
    const updatedArguments = [...functionArguments];
    updatedArguments[index] = {
      ...updatedArguments[index],
      [field]: value,
    };
    setState({ ...state, functionArguments: updatedArguments });
  };

  const removeArgument = (index) => {
    const updatedArguments = [...functionArguments];
    updatedArguments.splice(index, 1);
    setState({ ...state, functionArguments: updatedArguments });
  };
  return (
    <Form onSubmit={onSubmit}>
      <Form.Group controlId="scriptName" className="mb-3">
        <Form.Label>Script name</Form.Label>
        <InputGroup>
          <Form.Control
            required
            value={scriptName}
            onFocus={(e) => e.target.select()}
            onChange={(e) => {
              const scriptName = e.target.value;
              if (/^[a-zA-Z0-9._-]*$/.test(scriptName)) {
                setState((prevState) => ({
                  ...state,
                  scriptName,
                  functionName: `${prevState.returnModuleName}-${scriptName}`,
                  fragment: scriptName,
                }));
              }
            }}
          />
          <Form.Select
            value={scriptType}
            onChange={(e) => setState({ ...state, scriptType: e.target.value })}
            style={{ maxWidth: "10rem" }}
          >
            <option value=".sms.ttl">.sms.ttl</option>
            <option value=".ttl">.ttl</option>
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
                value={scriptPrefix}
                onFocus={(e) => e.target.select()}
                onChange={(e) => setState({ ...state, scriptPrefix: e.target.value })}
                className="rounded-start rounded-0"
              />
            </Col>
            <Col xs={4}>
              <Form.Label>Fragment</Form.Label>
              <Form.Control
                value={fragment}
                onFocus={(e) => e.target.select()}
                onChange={(e) => setState({ ...state, fragment: e.target.value })}
                className="rounded-0 border-start-0"
              />
            </Col>
            <Col xs={1}>
              <Form.Label>Version suffix</Form.Label>
              <Form.Control
                value={ontologyVersion}
                onFocus={(e) => e.target.select()}
                onChange={(e) => setState({ ...state, ontologyVersion: e.target.value })}
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
            label="Include function"
            checked={showTemplateFunctions}
            onChange={(e) =>
              setState({
                ...state,
                showTemplateFunctions: e.target.checked,
                returnModuleName: "",
                returnSuffix: "_Return",
                functionName: "",
              })
            }
          />
        </Form.Group>
        {showTemplateFunctions && (
          <>
            <Form.Group controlId="returnModuleName" className="mb-3">
              <Row className="g-0">
                <Col xs={5}>
                  <Form.Label>Return module name</Form.Label>
                  <Form.Control
                    required
                    value={returnModuleName}
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => {
                      const returnModuleName = e.target.value;
                      setState((prevState) => ({
                        ...state,
                        returnModuleName,
                        functionName: `${returnModuleName}-${prevState.scriptName}`,
                      }));
                    }}
                    className="rounded-start rounded-0"
                  />
                </Col>
                <Col xs={7}>
                  <Form.Label>Suffix</Form.Label>
                  <Form.Control
                    value={returnSuffix}
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => setState({ ...state, returnSuffix: e.target.value })}
                    className="rounded-0 border-start-0 rounded-end"
                  />
                </Col>
              </Row>
            </Form.Group>
            <Form.Group controlId="functionName" className="mb-3">
              <Form.Label>Function name</Form.Label>
              <InputGroup>
                <Form.Control
                  required
                  defaultValue={`${returnModuleName}-${scriptName}`}
                  placeholder="<return module name>-<script name>"
                  value={functionName}
                  onFocus={(e) => e.target.select()}
                  onChange={(e) => setState({ ...state, functionName: e.target.value })}
                />
              </InputGroup>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Function Arguments</Form.Label>
              <div className="border rounded p-3">
                {functionArguments &&
                  functionArguments.map((param, index) => (
                    <div key={index} className="mb-3 pb-3 border-bottom">
                      <Row className="align-items-center">
                        <Col xs={3}>
                          <Form.Control
                            value={param.name}
                            required
                            onChange={(e) => updateArgument(index, "name", e.target.value)}
                            placeholder="Variable name [spl:predicate]"
                          />
                        </Col>
                        <Col xs={3}>
                          <Form.Control
                            value={param.label}
                            onChange={(e) => updateArgument(index, "label", e.target.value)}
                            placeholder="rdfs:label"
                          />
                        </Col>
                        <Col xs={5}>
                          <Form.Control
                            value={param.comment}
                            onChange={(e) => updateArgument(index, "comment", e.target.value)}
                            placeholder="rdfs:comment"
                          />
                        </Col>
                        <Col xs={1}>
                          <Button variant="outline-danger" size="sm" onClick={() => removeArgument(index)}>
                            X
                          </Button>
                        </Col>
                      </Row>
                      <div className="text-end"></div>
                    </div>
                  ))}

                <div className="text-center">
                  <Button variant="outline-primary" onClick={addArgument}>
                    Add Argument
                  </Button>
                </div>
              </div>
            </Form.Group>
          </>
        )}
      </div>
      <Button variant="primary" type="submit" className="mt-3">
        Create script
      </Button>
    </Form>
  );
};

export default CreateScriptForm;
