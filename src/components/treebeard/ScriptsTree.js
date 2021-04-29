import React, {Fragment} from 'react';
import {includes} from 'lodash';

import styles from './styles';
import Header from './Header';
import {Treebeard, decorators} from 'react-treebeard';
import {Rest} from "../rest/Rest";
import { withRouter } from "react-router-dom";


class ScriptsTree extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            isLoaded: null
        };
        this.onToggle = this.onToggle.bind(this);
        this.onSelect = this.onSelect.bind(this);
    }

    componentDidMount() {
        Rest.getScripts().then(response => {
            console.log(response);
            this.setState({ data: response});
        });
    }

    onToggle(node, toggled) {
        const {cursor, data} = this.state;

        if (cursor) {
            this.setState(() => ({cursor, active: false}));
        }

        node.active = true;
        if (node.children) {
            node.toggled = toggled;
        }else{
            console.log(node.file);
            this.props.history.push({
                pathname: '/dagre_example',
                search: '?file=' + node.file
            });
        }

        this.setState(() => ({cursor: node, data: Object.assign({}, data)}));
    }

    onSelect(node) {
        const {cursor, data} = this.state;

        if (cursor) {
            this.setState(() => ({cursor, active: false}));
            if (!includes(cursor.children, node)) {
                cursor.toggled = false;
                cursor.selected = false;
            }
        }

        node.selected = true;

        this.setState(() => ({cursor: node, data: Object.assign({}, data)}));
    }

    render() {
        if(this.state.data === []){
            return (<h3>Loading</h3>);
        }else{
            return (
                <Fragment>
                    <h3>Scripts</h3>
                    <div style={styles.component}>
                        <Treebeard
                            data={this.state.data}
                            onToggle={this.onToggle}
                            onSelect={this.onSelect}
                            decorators={{...decorators, Header}}
                            style={styles.treeStyle}
                        />
                    </div>
                </Fragment>
            );

        }
    }
}

export default withRouter(ScriptsTree);
