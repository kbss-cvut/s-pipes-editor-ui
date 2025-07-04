import React from "react";

import { Button, Modal } from "react-bootstrap";

class ErrorModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoaded: false,
      modalVisible: false,
      errorMessage: null,
      subscript: null,
    };

    this.handleClose = this.handleClose.bind(this);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.errorMessage) {
      this.setState({
        isLoaded: true,
        modalVisible: true,
        errorMessage: newProps["errorMessage"],
        subscript: newProps["subscript"],
      });
    }
  }

  handleClose() {
    this.props.handleErrorModal();
    this.setState({ errorMessage: null, subscript: null });
  }

  render() {
    if (this.state.errorMessage) {
      const subscript = this.state.subscript;
      return (
        <Modal
          show={true}
          onHide={() => this.handleClose()}
          dialogClassName="modal-80w"
          aria-labelledby="example-custom-modal-styling-title"
        >
          <Modal.Header closeButton>
            <Modal.Title>Error</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {this.state.errorMessage.split("\n").map((line, index) => (
              <React.Fragment key={index}>
                {line}
                <br />
              </React.Fragment>
            ))}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => this.handleClose()}>
              Close
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                const url = `${window.location.origin}/script?file=${subscript}`;
                console.log("Opening subscript editor at:", subscript);
                window.open(url, "_blank");
              }}
            >
              Open SubScript in Editor
            </Button>
          </Modal.Footer>
        </Modal>
      );
    } else {
      return null;
    }
  }
}

export default ErrorModal;
