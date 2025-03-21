import React from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { Rest } from "../../rest/Rest.js";

class FunctionExecutionModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoaded: false,
      modalVisible: false,
      functionUri: null,
      params: "",
    };
    this.refForm = React.createRef();

    this.handleClose = this.handleClose.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillReceiveProps(newProps) {
    //Suggest possible parameters based on parameters BindWithConstant?
    if (newProps.functionUri) {
      this.setState({
        isLoaded: true,
        modalVisible: true,
        functionUri: newProps["functionUri"],
      });
    }
  }

  handleClose() {
    this.setState({ functionUri: false, isLoaded: false });
  }

  async handleSubmit() {
    try {
      const { functionUri, params } = this.state;
      const response = await Rest.executeFunction(functionUri, params);
      console.log(response);
      window.location.href = "/executions";
    } catch (error) {
      alert("An error occurred during script execution.");
      console.error(`An error occurred during script execution: ${error}`);
    }
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
            <Modal.Title>
              Function execution:
              <br />
              {this.state.functionUri}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="exampleForm.Textarea" onSubmit={this.handleSubmit}>
                <Form.Label>Function parameters</Form.Label>
                <Form.Control
                  onChange={(e) => this.setState({ params: e.target.value })}
                  as="textarea"
                  placeholder="firstName=Robert&lastName=Plant"
                  rows={3}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => this.handleClose()}>
              Close
            </Button>
            <Button variant="primary" onClick={() => this.handleSubmit()}>
              Debug
            </Button>
          </Modal.Footer>
        </Modal>
      );
    } else {
      return null;
    }
  }
}

export default FunctionExecutionModal;
