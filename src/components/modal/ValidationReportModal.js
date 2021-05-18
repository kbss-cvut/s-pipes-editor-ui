import React from 'react';
import SForms from 's-forms';

import 'react-datepicker/dist/react-datepicker.css';
import {Alert, Button, Col, Container, Form, Modal, Row} from "react-bootstrap";
import {
    ABSOLUTE_PATH,
    DISPLAY_NAME,
    EXECUTION_DURATION,
    FINISH_DATE_UNIX,
    Rest,
    START_DATE_UNIX,
    TRANSFORMATION
} from "../rest/Rest";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit, faMugHot, faPlayCircle, faTrash} from "@fortawesome/free-solid-svg-icons";
import Moment from "react-moment";
import {Link} from "react-router-dom";

class FunctionExecutionModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            validationMap: null,
            modalValidation: false
        };

        this.handleClose = this.handleClose.bind(this);
    }

    componentWillReceiveProps(newProps){
        console.log(newProps)
        if(newProps.modalValidation && newProps['modalValidation']){
            this.setState({
                validationOrigin: newProps['validationOrigin'],
                modalValidation: newProps['modalValidation'],
            });
        }
    }

    handleClose(){
        this.setState({isLoaded: false,  modalValidation: false});
    }

    render() {
        if(this.state.modalValidation){
            return (
                <Modal
                    show={this.state.modalValidation}
                    onHide={() => this.handleClose()}
                    dialogClassName="modal-80w"
                    aria-labelledby="example-custom-modal-styling-title"
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Validation report</Modal.Title>
                    </Modal.Header>

                    {/*http://onto.fel.cvut.cz/ontologies/s-pipes/rule-uri: "file:/home/jordan/IdeaProjects/s-pipes-newgen/src/main/resources/rules/SHACL/module-requires-rdfs_label.ttl"*/}
                    <Modal.Body>
                        {this.state.validationOrigin.length > 0 &&
                            <Container>
                                <Row>
                                    <Col><h4>Module</h4></Col>
                                    <Col><h4>Rule</h4></Col>
                                    <Col><h4>Error message</h4></Col>
                                </Row>
                                {this.state.validationOrigin.map((data, key) => {
                                    return (
                                        <Row key={key}>
                                            <Col>{data['http://onto.fel.cvut.cz/ontologies/s-pipes/has-module-uri']}</Col>
                                            <Col>{data['http://onto.fel.cvut.cz/ontologies/s-pipes/rule-comment']}</Col>
                                            <Col><Alert variant="danger">{data['http://onto.fel.cvut.cz/ontologies/s-pipes/error-message']}</Alert></Col>
                                        </Row>
                                    );
                                })}
                            </Container>
                        }
                        {this.state.validationOrigin.length === 0 &&
                            <Alert variant="success">EVERYTHING IS OK</Alert>
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

export default FunctionExecutionModal;

