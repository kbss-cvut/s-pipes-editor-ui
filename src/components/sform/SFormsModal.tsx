import React from "react";
import SForms from "@kbss-cvut/s-forms";
import { Button, Modal } from "react-bootstrap";
import Rest from "@rest/Rest.js";
import Loading from "../Loading.js";
import "@triply/yasgui/build/yasgui.min.css";
import ErrorModal from "../modal/ErrorModal";

class SFormsModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoaded: false,
      isLoading: false,
      modalVisible: false,
      selectedForm: null,
      moduleTypeUri: null,
      moduleUri: null,
      errorMessage: null,
      scriptPath: null,
    };
    this.refForm = React.createRef();
    this.handleErrorModal = this.handleErrorModal.bind(this);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.moduleTypeUri && newProps.scriptPath) {
      this.setState({ isLoading: true });
      Rest.getScriptForm(newProps.moduleTypeUri, newProps.moduleUri, newProps.scriptPath).then((response) => {
        this.setState({
          isLoaded: true,
          isLoading: false,
          selectedForm: response,
          modalVisible: true,
          moduleTypeUri: newProps.moduleTypeUri,
          moduleUri: newProps.moduleUri,
          scriptPath: newProps.scriptPath,
        });
      });
    }
  }

  handleClose() {
    this.setState({ modalVisible: false, isLoaded: false, isLoading: false });
  }

  handleErrorModal() {
    this.setState({ errorMessage: null });
  }

  async handleSubmit() {
    try {
      let form = this.state.selectedForm;
      form["http://onto.fel.cvut.cz/ontologies/documentation/has_related_question"] =
        this.refForm.current.getFormQuestionsData();

      this.setState({ isLoading: true, isLoaded: false });

      await Rest.updateScriptForm(this.state.moduleTypeUri, form, this.state.scriptPath);

      this.setState({ isLoading: false });
      window.location.reload(false);
    } catch (error) {
      this.setState({ errorMessage: "An error occurred during script update." });
      console.error(`An error occurred during script update: ${error}`);
    }
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
    } else if (this.state.isLoading) {
      return <Loading size={"large"} style={{ margin: "auto", position: "absolute", inset: "0px", zIndex: 9000 }} />;
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

export default SFormsModal;
