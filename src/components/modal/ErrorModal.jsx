import React from "react";

import { Button, Modal } from "react-bootstrap";

class ErrorModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoaded: false,
      modalVisible: false,
      errorMessage: null,
    };

    this.handleClose = this.handleClose.bind(this);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.errorMessage) {
      this.setState({
        isLoaded: true,
        modalVisible: true,
        errorMessage: newProps["errorMessage"],
      });
    }
  }

  handleClose() {
    this.props.handleErrorModal();
    this.setState({ errorMessage: null });
  }

  render() {
    if (this.state.errorMessage) {
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
          <Modal.Body>{this.state.errorMessage}</Modal.Body>
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

export default ErrorModal;
