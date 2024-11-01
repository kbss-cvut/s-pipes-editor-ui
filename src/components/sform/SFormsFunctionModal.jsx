import React from "react";
import SForms from "@kbss-cvut/s-forms";

import { Button, Modal } from "react-bootstrap";
import { Rest } from "../../api/Rest.jsx";
import "@triply/yasgui/build/yasgui.min.css";
import ErrorModal from "../modal/ErrorModal";
import ScriptActionsModuleModal from "../modal/ScriptActionsModuleModal";

class SFormsFunctionModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoaded: false,
      modalVisible: false,
      selectedForm: null,
      moduleTypeUri: null,
      moduleUri: null,
      scriptPath: null,
      errorMessage: null,
    };
    this.refForm = React.createRef();
    this.handleErrorModal = this.handleErrorModal.bind(this);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.scriptPath && newProps.functionUri) {
      Rest.getFunctionForm(newProps.scriptPath, newProps.functionUri).then((response) => {
        this.setState({
          isLoaded: true,
          selectedForm: response,
          modalVisible: true,
          moduleTypeUri: newProps.scriptPath,
          moduleUri: newProps.functionUri,
        });
      });
    }
  }

  handleClose() {
    this.setState({ modalVisible: false });
  }

  handleErrorModal() {
    this.setState({ errorMessage: null });
  }

  handleSubmit() {
    let data =
      this.refForm.current.getFormQuestionsData()[0][
        "http://onto.fel.cvut.cz/ontologies/documentation/has_related_question"
      ];
    let functionUri = "";
    let params = [];
    data.forEach((q) => {
      let label = q["http://www.w3.org/2000/01/rdf-schema#label"] + "=";
      let value =
        q["http://onto.fel.cvut.cz/ontologies/documentation/has_answer"][0][
          "http://onto.fel.cvut.cz/ontologies/documentation/has_data_value"
        ];
      if (value["@value"] !== undefined) {
        params.push(label + value["@value"]);
      } else if (label === "URI=") {
        functionUri = value;
      }
    });

    Rest.executeFunction(functionUri, params.join("&")).then((response) => {
      console.log(response);
      console.log(response.status);
      if (response.status === 200) {
        console.log(response);
        window.location.href = "/executions";
      } else {
        console.log("ERROR during script execution");
        this.setState({ errorMessage: "ERROR during script execution" });
      }
      this.setState({ isLoaded: false, modalVisible: false });
    });
  }

  render() {
    const options = {
      i18n: {
        "wizard.next": "Next",
        "wizard.previous": "Previous",
        "section.expand": "Expand",
        "section.collapse": "Collapse",
      },
      intl: {
        locale: "cs",
      },
      modalView: false,
      // modalProps,
      horizontalWizardNav: false,
      wizardStepButtons: true,
      enableForwardSkip: true,
    };

    if (this.state.errorMessage) {
      return <ErrorModal errorMessage={this.state.errorMessage} handleErrorModal={this.handleErrorModal} />;
    } else if (this.state.isLoaded) {
      return (
        <Modal
          show={this.state.modalVisible}
          onHide={() => this.handleClose()}
          dialogClassName="modal-80w"
          aria-labelledby="example-custom-modal-styling-title"
        >
          <Modal.Header closeButton>
            <Modal.Title>Modal heading</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <SForms ref={this.refForm} form={this.state.selectedForm} options={options} />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => this.handleClose()}>
              Close
            </Button>
            <Button variant="primary" onClick={() => this.handleSubmit()}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      );
    } else {
      return null;
    }
  }
}

export default SFormsFunctionModal;
