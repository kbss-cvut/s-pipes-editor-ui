import React from 'react';

import {Alert, Button, Form, Modal} from "react-bootstrap";
import {Rest} from "../rest/Rest";


class ScriptInputOutputModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoaded: false,
            basicModalVisible: false,
            logPath: null,
            input: null,
            moduleURI: null,
            moduleLabel: null,
            logContent: null,
            inputData: null
        };
        this.refForm = React.createRef();

        this.handleClose = this.handleClose.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.renderTextAreas = this.renderTextAreas.bind(this)
    }


    componentWillReceiveProps(newProps){
        if(newProps.logPath && newProps.moduleLabel && newProps.moduleURI){
            Rest.getLogForm(newProps.logPath).then((response) => {
                console.log(response)
                this.setState({
                    isLoaded: true,
                    basicModalVisible: true,
                    input: newProps.input,
                    moduleURI: newProps.moduleURI,
                    logPath: newProps.logPath,
                    moduleLabel: newProps.moduleLabel,
                    logContent: response
                })
            })
        }
    }

    handleClose(){
        this.setState({basicModalVisible:false, isLoaded: false, moduleResponse: null});
    }

    handleChange(event){
        let value = event.target.value;
        this.setState({inputData: value})
    }

    handleSubmit(){
        this.setState({basicModalVisible:false});
        let inputData = this.state.logContent["http://onto.fel.cvut.cz/ontologies/s-pipes/has-absolute-path"][0]['@id']
        if(this.state.inputData){
            inputData = this.state.inputData
        }
        //todo consider better framework
        const ttl2jsonld = require('@frogcat/ttl2jsonld').parse;
        const jsonld = ttl2jsonld(inputData);
        console.log(jsonld)

        Rest.executeModule(this.state.moduleURI, jsonld, null).then((response) => {
            this.setState({moduleResponse: response})
        })
    }

    renderTextAreas(){
        return this.state.logContent["http://onto.fel.cvut.cz/ontologies/s-pipes/has-absolute-path"].map((data, i) => {
            // this.setState({inputData: data['@id']})
            return (
                    <Form.Group controlId="exampleForm.ControlTextarea1" key={i}>
                        <Form.Label>Log info</Form.Label>
                        <Form.Control
                            as="textarea"
                            defaultValue={data['@id']}
                            onChange={this.handleChange.bind(this)}
                            rows={30}
                        />
                    </Form.Group>
            );
        });
    }

    render() {
        if(this.state.moduleResponse){
            return (
                <Modal
                    show={true}
                    onHide={() => this.handleClose()}
                    dialogClassName="modal-80w"
                    aria-labelledby="example-custom-modal-styling-title"
                >
                    <Modal.Body>
                        {this.state.moduleResponse}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.handleClose()}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            );

        }else if(this.state.isLoaded){
            return (
                <Modal
                    show={this.state.basicModalVisible}
                    onHide={() => this.handleClose()}
                    dialogClassName="modal-80w"
                    aria-labelledby="example-custom-modal-styling-title"
                >
                    <Modal.Header closeButton>
                        <Modal.Title>{this.state.moduleLabel}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {this.state.logContent["http://onto.fel.cvut.cz/ontologies/s-pipes/has-absolute-path"].length === 0 &&
                            <Alert variant="warning">
                                Module does not have input or output
                            </Alert>
                        }
                        {this.state.logContent["http://onto.fel.cvut.cz/ontologies/s-pipes/has-absolute-path"].length > 0 &&
                            <Form>
                                {this.renderTextAreas()}
                            </Form>
                        }
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.handleClose()}>
                            Close
                        </Button>
                        {this.state.input === "input" && this.state.logContent["http://onto.fel.cvut.cz/ontologies/s-pipes/has-absolute-path"].length > 0 &&
                            <Button variant="primary" onClick={() => this.handleSubmit()}>
                                Debug
                            </Button>
                        }
                    </Modal.Footer>
                </Modal>
            );
        }else{
            return null;
        }
    }
}

export default ScriptInputOutputModal;

