import React from 'react';
import SForms from 's-forms';

import 'react-datepicker/dist/react-datepicker.css';
import {Alert, Button, Col, Container, Form, Modal, Row, Table} from "react-bootstrap";
import {
    ABSOLUTE_PATH,
    DISPLAY_NAME, ERROR_MESSAGE,
    EXECUTION_DURATION,
    FINISH_DATE_UNIX, MODULE_URI, ONTOLOGY_URI,
    Rest, RULE_COMMENT, SCRIPT_PATH,
    START_DATE_UNIX,
    TRANSFORMATION
} from "../rest/Rest";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit, faMugHot, faPlayCircle, faTrash} from "@fortawesome/free-solid-svg-icons";
import Moment from "react-moment";
import {Link} from "react-router-dom";
import Layout from "../Layout";

class MoveModuleModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            scriptPath: null,
            moduleURI: null,
            ontologies: null,
            isLoaded: false,
            modalVisible: false
        };

        this.handleModuleMove = this.handleModuleMove.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    componentWillReceiveProps(newProps){
        if(newProps.modalMove && newProps.scriptPath && newProps.moduleURI){
            Rest.getScriptOntologies(newProps['scriptPath']).then((response) => {
                this.setState({
                    scriptPath: newProps['scriptPath'],
                    moduleURI: newProps['moduleURI'],
                    ontologies: response,
                    isLoaded: true,
                    modalVisible: true
                });
            })
        }
    }

    handleModuleMove(ontologyURI){
        alert('Not implemented yet')
        //this.state.moduleURI
        this.setState({isLoaded: false,  modalVisible: false});
    }

    handleClose(){
        this.setState({isLoaded: false,  modalVisible: false});
    }

    render() {
        if(this.state.isLoaded){
            return (
                <Modal
                    show={this.state.modalVisible}
                    onHide={() => this.handleClose()}
                    dialogClassName="modal-80w"
                    aria-labelledby="example-custom-modal-styling-title"
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Move module</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        {this.state.ontologies.length > 0 &&
                        <Container>
                            <Row>
                                <Col><h4>Ontology</h4></Col>
                                <Col><h4>File</h4></Col>
                            </Row>
                            <hr/>
                            {this.state.ontologies.map((data, key) => {
                                return (
                                    <Row key={key}>
                                        <Col><Alert onClick={() => this.handleModuleMove(data[ONTOLOGY_URI])} variant="info" style={{cursor: 'pointer'}}>{data[ONTOLOGY_URI]}</Alert>                                        </Col>
                                        <Col>{data[SCRIPT_PATH].replace(/^.*[\\\/]/, '')}</Col>
                                    </Row>
                                );
                            })}
                        </Container>
                        }

                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.handleClose()}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            );
        }else{
            return null;
        }
    }
}

export default MoveModuleModal;

