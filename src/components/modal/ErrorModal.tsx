import React, { Dispatch, SetStateAction, useState } from "react";

import { Button, Modal } from "react-bootstrap";

interface ErrorModalProps {
  errorMessage: string;
  handleErrorModal: () => void;
  subscript?: string;
}

const ErrorModal: React.FC<ErrorModalProps> = ({ errorMessage, handleErrorModal, subscript }) => {
  const handleClose = () => {
    handleErrorModal();
  };

  if (errorMessage == null) return null;

  return (
    <Modal
      show={true}
      onHide={() => handleClose()}
      dialogClassName="modal-80w"
      aria-labelledby="example-custom-modal-styling-title"
    >
      <Modal.Header closeButton>
        <Modal.Title>Error</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {errorMessage.split("\n").map((line, index) => (
          <React.Fragment key={index}>
            {line}
            <br />
          </React.Fragment>
        ))}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => handleClose()}>
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
};

export default ErrorModal;
