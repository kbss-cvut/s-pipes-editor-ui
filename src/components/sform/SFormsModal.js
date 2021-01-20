import React from 'react';
import SForms from 's-forms';

import 'react-datepicker/dist/react-datepicker.css';
import {Button, Modal} from "react-bootstrap";
import {Scripts} from "../rest/Scripts";


class SFormsModal extends React.Component {
    constructor(props) {
        super(props);
        // const { moduleTypeUri, moduleUri, scriptPath, modalVisible } = this.props;

        this.state = {
            isLoaded: false,
            modalVisible: false,
            selectedForm: null,
            moduleTypeUri: null,
            moduleUri: null,
            scriptPath: null
        };
        this.refForm = React.createRef();
    }


    componentWillReceiveProps(newProps){
        if(newProps.moduleTypeUri && newProps.scriptPath){
            Scripts.getScriptForm(newProps.moduleTypeUri, newProps.moduleUri, newProps.scriptPath).then((response) => {
                console.log(response)
                this.setState({
                    isLoaded: true,
                    selectedForm: response,
                    modalVisible: true,
                    moduleTypeUri: newProps.moduleTypeUri,
                    moduleUri: newProps.moduleUri,
                    scriptPath: newProps.scriptPath
                })
            })
        }
    }

    handleClose(){
        this.setState({modalVisible:false});
    }

    handleSubmit(){
        let form = this.state.selectedForm
        form["http://onto.fel.cvut.cz/ontologies/documentation/has_related_question"] = this.refForm.current.context.getFormQuestionsData();

        Scripts.updateScriptForm(this.state.moduleTypeUri, form, this.state.scriptPath).then((response) => {
            if(response.status === 200){
                window.location.reload(false);
            }else{
                console.log("ERROR on script update")
            }
        })
    }

    render() {
        // const modalProps = {
        //   onHide: () => {},
        //   show: true,
        //   title: 'Title'
        // };

        const options = {
          i18n: {
            'wizard.next': 'Next',
            'wizard.previous': 'Previous',
            'section.expand': 'Expand',
            'section.collapse': 'Collapse'
          },
          intl: {
            locale: 'cs'
          },
          modalView: false,
          // modalProps,
          horizontalWizardNav: false,
          wizardStepButtons: true,
          enableForwardSkip: true
        };

        // console.log("SForm: " + this.props.modalVisible);
        // console.log("SForm visible: " + this.props.modalVisible);
        // console.log("SForm loaded: " + this.state.isLoaded);

        if(this.state.isLoaded){
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
                        <SForms
                            ref={this.refForm}
                            form={this.state.selectedForm}
                            options={options}
                        />
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
        }else{
            return null;
        }
          // <div className="p-4">
          //   karel
          //   <SForms
          //     ref={this.refForm}
          //     form={this.state.selectedForm}
          //     options={options}
          //   />
          //   <button
          //     style={{ width: '100px', margin: '1rem -50px', position: 'relative', left: '50%' }}
          //     onClick={() => {
          //       let res = this.state.selectedForm
          //       res["http://onto.fel.cvut.cz/ontologies/documentation/has_related_question"] = this.refForm.current.context.getFormQuestionsData();
          //       console.log(JSON.stringify(res));
          //       // console.log(JSON.stringify(this.refForm.current.context.getFormQuestionsData(), null, 4));
          //     }}
          //   >
          //     Save
          //   </button>
          // </div>
    }
}

export default SFormsModal;

