import React, {Fragment} from 'react';
import {includes} from 'lodash';

import styles from './styles';
import Header from './Header';
import {Treebeard, decorators} from 'react-treebeard';
import {Rest} from "../rest/Rest";
import { withRouter } from "react-router-dom";
import ScriptActionsModuleModal from "../modal/ScriptActionsModuleModal";
import { LoopCircleLoading } from 'react-loadingg';

class ScriptsTree extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            scriptPath: null,
            displayName: null,
            type: null,
            isLoaded: null
        };
        this.handleRefresh = this.handleRefresh.bind(this);
        this.onToggle = this.onToggle.bind(this);
        this.onSelect = this.onSelect.bind(this);
    }

    componentDidMount() {
        Rest.getScripts().then(response => {
            response['toggled']=true;
            if(response['children'][0] !== undefined){
                response['children'][0]['toggled']=true;
            }
            this.setState({ data: response});

            document.addEventListener('contextmenu', (e) => {
                let dataId = e.target.getAttribute("data-id");
                if(dataId !== undefined){
                    e.preventDefault()
                    if(dataId !== ""){
                        let childrenId = e.target.getAttribute("data-children");
                        let displayName = e.target.innerText;
                        this.setState({ scriptPath: dataId, displayName: displayName, type: childrenId });
                    }
                }
            });
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
            window.location.href='/script?file=' + node.id
            // this.props.history.push({
            //     pathname: '/dagre_example',
            //     search: '?file=' + node.id
            // });
        }

        this.setState(() => ({cursor: node, data: Object.assign({}, data), scriptPath: null}));
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

        this.setState(() => ({cursor: node, data: Object.assign({}, data), scriptPath: null}));
    }

    handleRefresh(){
        this.componentDidMount();
    }

    render() {
        if(this.state.data === []){
            return (<LoopCircleLoading />);
        }else{
            return (
                <Fragment>
                    <h3>Scripts</h3>
                    <p>Right click on directory/file to add/remove file</p>
                    <div style={styles.component}>
                        <Treebeard
                            data={this.state.data}
                            onToggle={this.onToggle}
                            onSelect={this.onSelect}
                            decorators={{...decorators, Header}}
                            style={styles.treeStyle}
                        />
                    </div>

                    <ScriptActionsModuleModal
                        scriptPath={this.state.scriptPath}
                        displayName={this.state.displayName}
                        type={this.state.type}
                        handleRefresh={this.handleRefresh}
                    />
                </Fragment>
            );

        }
    }
}

export default withRouter(ScriptsTree);
