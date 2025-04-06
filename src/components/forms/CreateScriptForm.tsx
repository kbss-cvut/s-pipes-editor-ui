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
  } = state;
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
                  scriptName,
                  functionName: `${prevState.returnModuleName}-${scriptName}`,
                  fragment: scriptName,
                }));
              }
            }}
          />
          <Form.Select
            value={scriptType}
            onChange={(e) => setState({ scriptType: e.target.value })}
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
                value={scriptPrefix}
                onFocus={(e) => e.target.select()}
                onChange={(e) => setState({ scriptPrefix: e.target.value })}
                className="rounded-start rounded-0"
              />
            </Col>
            <Col xs={4}>
              <Form.Label>Fragment</Form.Label>
              <Form.Control
                value={fragment}
                onFocus={(e) => e.target.select()}
                onChange={(e) => setState({ fragment: e.target.value })}
                className="rounded-0 border-start-0"
              />
            </Col>
            <Col xs={1}>
              <Form.Label>Version</Form.Label>
              <Form.Control
                value={ontologyVersion}
                onFocus={(e) => e.target.select()}
                onChange={(e) => setState({ ontologyVersion: e.target.value })}
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
            checked={showTemplateFunctions}
            onChange={(e) =>
              setState({
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
              <Form.Label>Return module name</Form.Label>
              <InputGroup>
                <Form.Control
                  required
                  value={returnModuleName}
                  onFocus={(e) => e.target.select()}
                  onChange={(e) => {
                    const returnModuleName = e.target.value;
                    setState((prevState) => ({
                      returnModuleName,
                      functionName: `${returnModuleName}-${prevState.scriptName}`,
                    }));
                  }}
                />
                <Form.Control
                  value={returnSuffix}
                  onFocus={(e) => e.target.select()}
                  onChange={(e) => setState({ returnSuffix: e.target.value })}
                />
              </InputGroup>
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
                  onChange={(e) => setState({ functionName: e.target.value })}
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
  );
};

export default CreateScriptForm;
