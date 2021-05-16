import React from 'react';
import cytoscape from 'cytoscape';
import dagre from "cytoscape-dagre";
import edgehandles from "cytoscape-edgehandles";
import cxtmenu from 'cytoscape-cxtmenu';
import popper from 'cytoscape-popper';
import navigator from 'cytoscape-navigator';
import expandCollapse from 'cytoscape-expand-collapse';
import {Rest, SCRIPT_PATH} from '../rest/Rest';
import NavbarMenu from "../NavbarMenu";
import SFormsModal from "../sform/SFormsModal";
import ModuleTypesSelection from "../ModuleTypesSelection";
import ScriptInputOutputModal from "../sform/ScriptInputOutputModal";
import {Dropdown} from "semantic-ui-react";
import {ICONS_MAP} from "./DagreIcons";
import ScriptFunctionSelection from "../ScriptFunctionSelection";
import FunctionExecutionModal from "../modal/FunctionExecutionModal";


const TYPE = "http://onto.fel.cvut.cz/ontologies/s-pipes-view/has-module-type";
const LABEL = "http://www.w3.org/2000/01/rdf-schema#label";
const X = "http://onto.fel.cvut.cz/ontologies/s-pipes-view/has-x-coordinate";
const Y = "http://onto.fel.cvut.cz/ontologies/s-pipes-view/has-y-coordinate";
const EDGE = "http://onto.fel.cvut.cz/ontologies/s-pipes-view/consists-of-edge";
const SOURCE_NODE = "http://onto.fel.cvut.cz/ontologies/s-pipes-view/has-source-node";
const DESTINATION_NODE = "http://onto.fel.cvut.cz/ontologies/s-pipes-view/has-destination-node";
const NODE = "http://onto.fel.cvut.cz/ontologies/s-pipes-view/consists-of-node";
const ICON = "http://topbraid.org/sparqlmotion#icon";
const COMMENT = "http://www.w3.org/2000/01/rdf-schema#comment";
const ANSWERS = "http://onto.fel.cvut.cz/ontologies/documentation/has_answer";
const OBJECT_VALUE = "http://onto.fel.cvut.cz/ontologies/documentation/has_object_value";
const COMPONENT = "http://onto.fel.cvut.cz/ontologies/s-pipes-view/component";
const FUNCTION_LOCAL_NAME = "http://onto.fel.cvut.cz/ontologies/s-pipes/has-function-local-name";
const FUNCTION_URI = "http://onto.fel.cvut.cz/ontologies/s-pipes/has-function-uri";
const INPUT_PARAMETER = "http://onto.fel.cvut.cz/ontologies/s-pipes-view/has-input-parameter"
const OUTPUT_PARAMETER = "http://onto.fel.cvut.cz/ontologies/s-pipes-view/has-output-parameter"
const GROUP = "http://onto.fel.cvut.cz/ontologies/s-pipes-view/group"

const rankDirOptions = [
    // preset
    // {'text' : 'Preset', 'key' : 'preset', 'value' : 'preset'},
    {'text' : 'LeftRight', 'key' : 'LR', 'value' : 'LR'},
    {'text' : 'TopBottom', 'key' : 'TB', 'value' : 'TB'}
]

const cyLayout = (rank) => {
    return ({
        name: 'dagre',
        rankDir: rank,
        nodeSep: 50,
        rankSep: 100,
        directed: true,
        padding: 100
    })
}

class Dagre extends React.Component{
    constructor(props){
        super(props);

        const params = new URLSearchParams(props.location.search);
        this.state = {
            isLoaded: false,
            file: params.get('file'),
            transformation: params.get('transformation'),
            groups : new Set(),
            nodes : [],
            edges : [],
            moduleTypeUri: null,
            moduleUri: null,
            scriptPath: null,
            moduleLabel: null,
            logPath: null,
            rankDir: 'TB',
            popperItems: []
        }

        cytoscape.use( dagre );
        cytoscape.use( edgehandles );
        cytoscape.use( cxtmenu );
        cytoscape.use( popper );
        cytoscape.use( navigator );
        cytoscape.use( expandCollapse );
        this.renderCytoscapeElement = this.renderCytoscapeElement.bind(this);
        this.handleRenderChange = this.handleRenderChange.bind(this);
    }

    componentDidMount() {
        Rest.getScript(this.state.file, this.state.transformation).then(response => {
            this._processGraph(response);
            this.renderCytoscapeElement();
        });
    }

    _addNode(n){
        if(n[GROUP] !== undefined){
            if(!this.state.groups.has(n[GROUP])){
                this.state.groups.add(n[GROUP]);
                this.state.nodes.push({
                    data: { id: n[GROUP], label: n[GROUP], input: [], output: []}
                })
            }
        }

        const label = n[LABEL] === undefined ? n["@id"].toString().split("/").reverse()[0] : n[LABEL];
        this.state.nodes.push({
            data: {
                id: n["@id"],
                label: label,
                component: n[COMPONENT],
                type: n[TYPE],
                input: n[INPUT_PARAMETER],
                output: n[OUTPUT_PARAMETER],
                icon: '/public/icons/' + ICONS_MAP[n[COMPONENT]],
                menu: true,
                scriptPath: n[SCRIPT_PATH],
                parent: n[GROUP]
            },
            selectable: false,
            position: { x: n[X], y: n[Y] }
        })
    }

    _processGraph(data){
        data[NODE].map(n => {
            if (n[TYPE] !== undefined){
                this._addNode(n)
            }
        });
        data[EDGE].map(e => {
            if (e[SOURCE_NODE][TYPE] !== undefined) {
                let n = e[SOURCE_NODE];
                this._addNode(n)
            }
            if (e[DESTINATION_NODE][TYPE] !== undefined) {
                let n = e[DESTINATION_NODE];
                this._addNode(n)
            }
        });
        data[EDGE].map(e => {
            let from = typeof e[SOURCE_NODE] === "object" ? e[SOURCE_NODE]["@id"] :e[SOURCE_NODE];
            let to = typeof e[DESTINATION_NODE] === "object" ? e[DESTINATION_NODE]["@id"] : e[DESTINATION_NODE];
            this.state.edges.push({
                data: { source: from, target: to, menu: true },
                selectable: false
            })
        });
    }

    handleRenderChange = (e, { value }) => {
        this.setState({
            rankDir : value,
            moduleTypeUri: null,
            moduleUri: null,
            logPath: null,
            functionUri: null
        });
        let layout = this.cy.layout(cyLayout(value));
        layout.run();
    }

    renderCytoscapeElement(){
        console.log('* Cytoscape.js is rendering the graph..');
        console.log(this.state.nodes)

        this.cy = cytoscape(
            {
                container: document.getElementById('cy'),
                style: [
                    {
                        selector: 'node',
                        style: {
                            'shape' : 'rectangle',
                            'content': 'data(name)',
                            'label': 'data(label)',
                            'height': 40,
                            'width': 40,
                            'background-image': 'data(icon)',
                            'background-fit': 'cover cover'
                        }
                    },
                    {
                        selector: 'edge',
                        style: {
                            'curve-style': 'straight',
                            'target-arrow-shape': 'triangle'
                        }
                    },
                    {
                        selector: '.eh-handle',
                        style: {
                            'background-color': 'black',
                            'width': 8,
                            'height': 8,
                            'shape': 'ellipse',
                            'overlay-opacity': 0,
                            'border-width': 8, // makes the handle easier to hit
                            'border-opacity': 0
                        }
                    },
                    {
                        selector: '.eh-hover',
                        style: {
                            'background-color': 'black'
                        }
                    },
                    {
                        selector: '.eh-source',
                        style: {
                            'border-width': 2,
                            'border-color': 'black'
                        }
                    },
                    {
                        selector: '.eh-target',
                        style: {
                            'border-width': 2,
                            'border-color': 'black'
                        }
                    },
                    {
                        selector: '.eh-preview, .eh-ghost-edge',
                        style: {
                            'background-color': 'black',
                            'line-color': 'black',
                            'target-arrow-color': 'black',
                            'source-arrow-color': 'black'
                        }
                    },
                    {
                        selector: '.eh-ghost-edge.eh-preview-active',
                        style: {
                            'opacity': 0
                        }
                    },
                    {
                        selector: ':parent',
                        style: {
                            'background-opacity': 0.111,
                            'label': 'data(label)'
                        }
                    },
                    {
                        selector: "node.cy-expand-collapse-collapsed-node",
                        style: {
                            "background-color": "darkblue",
                            "shape": "rectangle"
                        }
                    },
                    {
                        selector: 'edge.meta',
                        style: {
                            'width': 2,
                            'line-color': 'red'
                        }
                    },
                    {
                        selector: ':selected',
                        style: {
                            // "border-width": 3,
                            // "border-color": '#DAA520'
                        }
                    }
                ],
                elements: {
                    nodes: this.state.nodes,
                    edges: this.state.edges
                },
                //https://github.com/cytoscape/cytoscape.js-dagre
                layout: cyLayout(this.state.rankDir)
            });

        // TODO consider usage of https://github.com/iVis-at-Bilkent/cytoscape.js-context-menus
        let filepath = this.state.file;
        this.cy.cxtmenu({
            selector: 'node[menu]',
            commands: [
                {
                    content: '<span class="fa fa-trash fa-2x"/>',
                    select: (ele) => {
                        Rest.deleteScriptNode(filepath, ele.data('id')).then(response => {
                            if(response.status === 204){
                                ele.remove();
                            }else{
                                console.log("node not delete some kind of error message");
                            }
                        });
                    }
                },
                {
                    content: '<span class="fa fa-info-circle fa-2x"/>',
                    select: (ele) => {
                        this.setState({
                            logPath: ele.data('input'),
                            moduleLabel: ele.data('label'),
                            moduleTypeUri: null,
                            moduleUri: null,
                            functionUri: null
                        })
                    }
                },
                {
                    content: '<span class="fa fa-file fa-2x"/>',
                    select: (ele) => {
                        //TODO modal with style
                        if(ele.data('scriptPath') === this.state.file) {
                            alert("Script path is the same as actual one")
                        }else if(ele.data('scriptPath') === undefined){
                            alert("Script path is not defined")
                        }else{
                            window.location.href='?file=' + ele.data('scriptPath')
                        }
                    }
                },
                {
                    content: '<span class="fa fa-info-circle fa-2x"/>',
                    select: (ele) => {
                        this.setState({
                            logPath: ele.data('output'),
                            moduleLabel: ele.data('label'),
                            moduleTypeUri: null,
                            moduleUri: null,
                            functionUri: null
                        })
                    }
                },
                {
                    content: '<span class="fa fa-cogs fa-2x"/>',
                    select: (ele) => {
                        this.setState({
                            moduleTypeUri: ele.data('component'),
                            moduleUri: ele.data('id'),
                            logPath: null,
                            functionUri: null
                        })
                    }
                }
            ]
        });

        this.cy.cxtmenu({
            selector: 'edge[menu]',
            commands: [
                {
                    content: '<span class="fa fa-trash fa-2x"/>',
                    select: function(ele){
                        let sourceNode = ele.data('source');
                        let targetNode = ele.data('target');
                        Rest.deleteScriptEdge(filepath, sourceNode, targetNode).then(response => {
                            if(response.status === 200){
                                ele.remove();
                            }else{
                                console.log("node not delete ome kind of message");
                            }
                        });
                    }
                }
            ]
        });

        this.cy.edgehandles({
            handleNodes: 'node[menu]',
            handlePosition: function( node ){
                return 'right right';
            },
            complete: (sourceNode, targetNode, addedEles ) => {
                console.log(sourceNode.data('id'))
                console.log(targetNode.data('id'))
                Rest.addModuleDependency(
                    this.state.file,
                    sourceNode.data('id'),
                    targetNode.data('id')
                ).then((res) => {
                    if(res.status === 204){
                        //TODO reload?
                    }else{
                        console.log("ERROR add edge/dependency")
                    }
                })
            },
        })


        for (const [index, value] of this.state.popperItems.entries()) {
            value.destroy();
        }
        //JUST visualization of input/output - it would be much better menu, but onclick is tricky to make work
        const items = [];
        const poperContent = () => {
            let div = document.createElement('div');
            div.classList.add('popper-div');
            div.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" height="0.75em"><path d="M256 8C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm0 110c23.196 0 42 18.804 42 42s-18.804 42-42 42-42-18.804-42-42 18.804-42 42-42zm56 254c0 6.627-5.373 12-12 12h-88c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h12v-64h-12c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h64c6.627 0 12 5.373 12 12v100h12c6.627 0 12 5.373 12 12v24z"/></svg>';
            document.body.appendChild( div );
            return div;
        }
        for (const [index, value] of this.cy.nodes().entries()) {
            if(value.data('input').length > 0){
                let p = value.popper({
                    content: poperContent,
                    popper: {
                        placement: 'left-end'
                    }
                });
                items.push(p);
                this.state.popperItems.push(p);
            }
            if(value.data('output').length > 0){
                let p = value.popper({
                    content: poperContent,
                    popper: {
                        placement: 'right-end'
                    }
                });
                items.push(p);
                this.state.popperItems.push(p);
            }
        }
        let update = () => {
            for (const [index, value] of items.entries()) {
                value.update();
            }
        };
        for (const [index, value] of this.cy.nodes().entries()) {
            value.on('position', update);
        }
        this.cy.on('pan zoom resize', update);

        //navigator bird-eye
        this.cy.navigator( {} );

        this.cy.expandCollapse({
            undoable: false
        });

        this.setState()
    }

    render(){
        const cyStyle = {
            width: '100%',
            height: '100%',
            position: 'absolute',
            left: 0,
            top: 0,
            zIndex: 2
        };
        return (
            <div>
                <NavbarMenu />

                {/*Options*/}
                <div style={{position: 'absolute', padding: 20, zIndex: 20, width: '20%'}}>
                    <h5>Modules operations</h5>
                    <ModuleTypesSelection
                        scriptPath={this.state.file}
                        onChange={(value) => this.setState({moduleTypeUri: value, functionUri: null, moduleUri: null, logPath: null})}
                    />

                    <br/>

                    <h5>Function call</h5>
                    <ScriptFunctionSelection
                        scriptPath={this.state.file}
                        onChange={(value) => this.setState({functionUri: value[1], moduleTypeUri: null, moduleUri: null, logPath: null})}
                    />

                    <br/>

                    <h5>Graph render strategy</h5>
                    <Dropdown
                        placeholder='Render strategy'
                        options={rankDirOptions}
                        value={this.state.rankDir}
                        selection
                        onChange={this.handleRenderChange}
                    />
                </div>

                {/*Modal windows*/}
                <SFormsModal
                    moduleTypeUri={this.state.moduleTypeUri}
                    moduleUri={this.state.moduleUri}
                    scriptPath={this.state.file}
                />

                <ScriptInputOutputModal
                    logPath={this.state.logPath}
                    moduleLabel={this.state.moduleLabel}
                />

                <FunctionExecutionModal
                    functionUri={this.state.functionUri}
                />
                <div>
                    <div key={"cyKey"} style={cyStyle} id="cy"/>
                </div>
            </div>
        )
    }
}

export default Dagre;