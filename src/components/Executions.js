import React, {Fragment} from 'react';

import Layout from './Layout';
import {
    ABSOLUTE_PATH,
    DISPLAY_NAME,
    EXECUTION_DURATION,
    FINISH_DATE_UNIX,
    Rest,
    START_DATE_UNIX,
    TRANSFORMATION
} from "./rest/Rest";
import {Col, Container, Row, Table} from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMugHot, faTrash, faRunning, faPlayCircle, faEdit } from '@fortawesome/free-solid-svg-icons'
import Moment from 'react-moment';
import {Link} from "react-router-dom";

class Executions extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: []
        };
    }

    componentDidMount() {
        Rest.getExecutions().then(response => {
            console.log(response);
            this.setState({ data: response});
        });
    }

    handleRemove(transformationURI){
        console.log(transformationURI);
        Rest.deleteExecution(transformationURI).then(() => {
            Rest.getExecutions().then(response => {
                this.setState({ data: response});
            });
        })
    }

    render() {
        if(this.state.data === []){
            return (<h3>Loading</h3>);
        }else{
            return (
                <Layout>
                    <h3>Executions</h3>
                    <Table striped bordered hover>
                        <thead>
                        <tr>
                            <th>Status</th>
                            <th>Name</th>
                            <th>Started</th>
                            <th>Finished</th>
                            <th>Duration</th>
                            <th style={{textAlign: 'center'}}>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.state.data.map((data, key) => {
                            return (
                                <tr key={key}>
                                    <td align={"center"}><FontAwesomeIcon icon={faMugHot} /></td>
                                    <td>{data[DISPLAY_NAME]}</td>
                                    <td><Moment unix format="DD.MM.YYYY - HH:mm:ss">{data[START_DATE_UNIX]/1000}</Moment></td>
                                    <td><Moment unix format="DD.MM.YYYY - HH:mm:ss">{data[FINISH_DATE_UNIX]/1000}</Moment></td>
                                    <td>{data[EXECUTION_DURATION]}ms</td>
                                    <td>
                                        <Container>
                                            <Row>
                                                <Col><Link to={`/dagre_example?file=${data[ABSOLUTE_PATH]}&transformation=${data[TRANSFORMATION]}`}><FontAwesomeIcon icon={faEdit} /></Link></Col>
                                                {/*<Col><FontAwesomeIcon icon={faPlayCircle} /></Col>*/}
                                                <Col onClick={() => this.handleRemove(data[TRANSFORMATION])} style={{cursor: 'pointer'}}><FontAwesomeIcon icon={faTrash} /></Col>
                                            </Row>
                                        </Container>
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </Table>
                </Layout>
            );
        }
    }
}



export default Executions;
