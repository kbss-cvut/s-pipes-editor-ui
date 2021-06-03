import React from 'react';

import 'react-datepicker/dist/react-datepicker.css';
import {Alert, Button, Col, Container, Modal, Row, Table} from "react-bootstrap";
import {
    MODULE_EXECUTION_FINISH_DATE, MODULE_EXECUTION_START_DATE,
    MODULE_EXECUTION_DURATION, MODULE_URI,
    Rest, MODULE_INPUT_PATH, MODULE_OUTPUT_PATH, EXECUTION_VARIABLE
} from "../rest/Rest";
import {faDownload, faMugHot} from '@fortawesome/free-solid-svg-icons'
import Moment from "react-moment";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

class ScriptOntologyModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            executions: null,
            cytoscape: null,
            isLoaded: false,
            modalVisible: false
        };

        this.handleClose = this.handleClose.bind(this);
    }

    componentWillReceiveProps(newProps){
        if(newProps.transformationId && newProps.modalExecution){
            Rest.getScriptModuleExecution(newProps['transformationId']).then((response) => {
                console.log(response);
                this.setState({
                    executions: response,
                    cytoscape: newProps['cy'],
                    isLoaded: true,
                    modalVisible: true
                });
            })
        }
    }

    handleNodeZoom(id){
        this.state.cytoscape.zoom({
            level: 4
        });
        this.state.cytoscape.center( this.state.cytoscape.getElementById(id) )
        this.setState({isLoaded: false,  modalValidation: false});
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
                        <Modal.Title>Execution info</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>

                        <Table>
                            <thead>
                            <tr>
                                <th>#</th>
                                <th>ModuleURI</th>
                                <th>Duration</th>
                                {/*<th>Year</th>*/}
                                <th>Start</th>
                                <th>Finish</th>
                                <th>Input</th>
                                <th>Output</th>
                                <th>Variables</th>
                            </tr>
                            </thead>
                            <tbody>
                            {this.state.executions.map((data, key) => {
                                return (
                                    <tr key={key}>
                                        <td>{key}</td>
                                        <td onClick={() => this.handleNodeZoom(data[MODULE_URI])} style={{cursor: 'pointer'}}>{data[MODULE_URI]}</td>
                                        <td>{data[MODULE_EXECUTION_DURATION]}ms</td>
                                        {/*<td><Moment unix format="DD.MM.YYYY">{data[MODULE_EXECUTION_START_DATE]/1000}</Moment></td>*/}
                                        <td><Moment unix format="HH:mm:ss">{data[MODULE_EXECUTION_START_DATE]/1000}</Moment></td>
                                        <td><Moment unix format="HH:mm:ss">{data[MODULE_EXECUTION_FINISH_DATE]/1000}</Moment></td>
                                        <td>
                                            {data[MODULE_INPUT_PATH].map((d, k) => {return(
                                                <span key={"input"+d} onClick={() => window.open("/rest/file/download?file="+d["@id"], '_blank').focus()}  style={{cursor: 'pointer'}}>
                                                    <FontAwesomeIcon icon={faDownload}/>
                                                </span>
                                            );})}
                                        </td>
                                        <td>
                                            {data[MODULE_OUTPUT_PATH].map((d, k) => {return(
                                                <span key={"input"+d} onClick={() => window.open("/rest/file/download?file="+d["@id"], '_blank').focus()}  style={{cursor: 'pointer'}}>
                                                    <FontAwesomeIcon icon={faDownload}/>
                                                </span>
                                            );})}
                                        </td>
                                        <td>
                                            {data["http://onto.fel.cvut.cz/ontologies/s-pipes/has-module-variables"].map((d, k) => {return(
                                                <div key={"variable"+key}>
                                                    {d['http://onto.fel.cvut.cz/ontologies/s-pipes-view/has-variable-name']}: {d['http://onto.fel.cvut.cz/ontologies/s-pipes-view/has-variable-value']}
                                                </div>
                                            );})}
                                        </td>

                                    </tr>
                                );
                            })}
                            </tbody>
                        </Table>
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

export default ScriptOntologyModal;

