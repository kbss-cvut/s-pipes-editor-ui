import React from "react";

import { Button, Modal, Table } from "react-bootstrap";
import {
  MODULE_EXECUTION_DURATION,
  MODULE_URI,
  MODULE_INPUT_PATH,
  MODULE_OUTPUT_PATH,
  MODULE_VARIABLES,
  MODULE_VARIABLE_NAME,
  MODULE_VARIABLE_VALUE,
} from "../../constants/vocabulary.js";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class ScriptOntologyModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      executions: null,
      cytoscape: null,
      isLoaded: false,
      modalVisible: false,
    };

    this.handleClose = this.handleClose.bind(this);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.transformationId && newProps.modalExecution) {
      Rest.getScriptModuleExecution(newProps["transformationId"]).then((response) => {
        console.log(response);
        this.setState({
          executions: response,
          cytoscape: newProps["cy"],
          isLoaded: true,
          modalVisible: true,
        });
      });
    }
  }

  handleNodeZoom(id) {
    this.state.cytoscape.zoom({
      level: 4,
    });
    this.state.cytoscape.center(this.state.cytoscape.getElementById(id));
    this.setState({ isLoaded: false, modalValidation: false });
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
            <Modal.Title>Execution info - full path of the URI is truncated</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>ModuleURI</th>
                  <th>Duration</th>
                  {/*<th>Year</th>*/}
                  <th>Start</th>
                  <th>Finish</th>
                  <th>Input</th>
                  <th>Output</th>
                  <th>Variables</th>
                </tr>
              </thead>
              <tbody>
                {this.state.executions.map((data, key) => {
                  return (
                    <tr key={key}>
                      <td>{key}</td>
                      <td onClick={() => this.handleNodeZoom(data[MODULE_URI])} style={{ cursor: "pointer" }}>
                        {data[MODULE_URI].replace(/^.*[\\\/]/, "")}
                      </td>
                      <td>{data[MODULE_EXECUTION_DURATION]}ms</td>
                      {/*<td><Moment unix format="DD.MM.YYYY">{data[MODULE_EXECUTION_START_DATE]/1000}</Moment></td>*/}
                      <td>
                        {data[MODULE_INPUT_PATH].map((d, k) => {
                          return (
                            <span
                              key={"input" + k}
                              onClick={() => window.open("/rest/file/download?file=" + d["@id"], "_blank").focus()}
                              style={{ cursor: "pointer" }}
                            >
                              <FontAwesomeIcon icon={faDownload} />
                            </span>
                          );
                        })}
                      </td>
                      <td>
                        {data[MODULE_OUTPUT_PATH].map((d, k) => {
                          return (
                            <span
                              key={"output" + k}
                              onClick={() => window.open("/rest/file/download?file=" + d["@id"], "_blank").focus()}
                              style={{ cursor: "pointer" }}
                            >
                              <FontAwesomeIcon icon={faDownload} />
                            </span>
                          );
                        })}
                      </td>
                      <td>
                        {data[MODULE_VARIABLES].sort((a, b) =>
                          a[MODULE_VARIABLE_NAME].localeCompare(b[MODULE_VARIABLE_NAME]),
                        ).map((d, k) => {
                          return (
                            <div key={"variable" + k}>
                              {d[MODULE_VARIABLE_NAME]}: {d[MODULE_VARIABLE_VALUE].replace(/^.*[\\\/]/, "")}
                            </div>
                          );
                        })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
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

export default ScriptOntologyModal;
