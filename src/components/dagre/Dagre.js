import React from 'react';
import cytoscape from 'cytoscape';
import dagre from "cytoscape-dagre";
import edgehandles from "cytoscape-edgehandles";
import cxtmenu from 'cytoscape-cxtmenu';
import {Scripts} from '../rest/Scripts';
import NavbarMenu from "../NavbarMenu";
import SFormsModal from "../sform/SFormsModal";
import ModuleTypesSelection from "../ModuleTypesSelection";
import {Button} from "react-bootstrap";


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


class Dagre extends React.Component{
    constructor(props){
        super(props);

        const params = new URLSearchParams(props.location.search);
        this.state = {
            isLoaded: false,
            file: params.get('file'),
            nodes : [],
            edges : [],
            moduleTypeUri: null,
            moduleUri: null,
            scriptPath: null,
        }

        cytoscape.use( dagre );
        cytoscape.use( edgehandles );
        cytoscape.use( cxtmenu );
        this.renderCytoscapeElement = this.renderCytoscapeElement.bind(this);
    }

    componentDidMount() {
        Scripts.getScript(this.state.file).then(response => {
            console.log(response);
            this._processGraph(response);
            this.renderCytoscapeElement();
        });
    }

    _addNode(n){
        const label = n[LABEL] === undefined ? n["@id"].toString().split("/").reverse()[0] : n[LABEL];
        this.state.nodes.push({
            data: { id: n["@id"], label: label, component: n[COMPONENT], type: n[TYPE], x: n[X], y: n[Y] }
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
                data: { source: from, target: to }
            })
        });
    }

    renderCytoscapeElement(){
        console.log('* Cytoscape.js is rendering the graph..');

        //TODO ask if ok like this
        this.cy = cytoscape(
            {
                container: document.getElementById('cy'),
                boxSelectionEnabled: false,
                autounselectify: true,
                style: [
                    {
                        selector: 'node',
                        style: {
                            'shape' : 'rectangle',
                            'content': 'data(name)',
                            'label': 'data(label)',
                            'height': 40,
                            'width': 40,
                            // 'background-image': 'url("https://react.semantic-ui.com/images/avatar/small/matt.jpg")'
                        }
                    },
                    {
                        selector: 'edge',
                        style: {
                            'curve-style': 'straight',
                            // 'curve-style': 'unbundled-bezier',
                            'target-arrow-shape': 'triangle'
                        }
                    },
                    {
                        selector: '.eh-handle',
                        style: {
                            'background-color': 'red',
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
                            'background-color': 'red'
                        }
                    },
                    {
                        selector: '.eh-source',
                        style: {
                            'border-width': 2,
                            'border-color': 'red'
                        }
                    },
                    {
                        selector: '.eh-target',
                        style: {
                            'border-width': 2,
                            'border-color': 'red'
                        }
                    },
                    {
                        selector: '.eh-preview, .eh-ghost-edge',
                        style: {
                            'background-color': 'red',
                            'line-color': 'red',
                            'target-arrow-color': 'red',
                            'source-arrow-color': 'red'
                        }
                    },
                    {
                        selector: '.eh-ghost-edge.eh-preview-active',
                        style: {
                            'opacity': 0
                        }
                    }
                ],
                elements: {
                    nodes: this.state.nodes,
                    edges: this.state.edges
                },
                //https://github.com/cytoscape/cytoscape.js-dagre
                layout: {
                    name: 'dagre',
                    rankDir: 'LR',//TB;LR
                    nodeSep: 100,
                    rankSep: 200,
                    directed: true,
                    padding: 300
                }
            });

        this.cy = this.cy.on('tap', 'node', (evt) => {
            const node = evt.target;
            // node["http://onto.fel.cvut.cz/ontologies/s-pipes-view/component"]
            //     node.id,
            //     this.state.file

        });

        let filepath = this.state.file;
        this.cy.cxtmenu({
            selector: 'node',
            commands: [
                {
                    content: '<span class="fa fa-trash fa-2x"/>',
                    select: (ele) => {
                        Scripts.deleteScriptNode(filepath, ele.data('id')).then(response => {
                            if(response.status === 204){
                                ele.remove();
                            }else{
                                console.log("node not delete some kind of error message");
                            }
                        });
                    }
                },
                {
                    content: '<span class="fa fa-cogs fa-2x"/>',
                    select: (ele) => {
                        this.setState({
                            moduleTypeUri: ele.data('component'),
                            moduleUri: ele.data('id')
                        })
                    }
                }
            ]
        });


        this.cy.cxtmenu({
            selector: 'edge',
            commands: [
                {
                    content: '<span class="fa fa-trash fa-2x"/>',
                    select: function(ele){
                        let sourceNode = ele.data('source');
                        let targetNode = ele.data('target');
                        Scripts.deleteScriptEdge(filepath, sourceNode, targetNode).then(response => {
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
            handlePosition: function( node ){
                return 'right right';
            },
            complete: (sourceNode, targetNode, addedEles ) => {
                console.log(sourceNode.data('id'))
                console.log(targetNode.data('id'))
                Scripts.addModuleDependency(
                    this.state.file,
                    sourceNode.data('id'),
                    targetNode.data('id')
                ).then((res) => {
                    if(res.status === 201){
                        //TODO reload?
                    }else{
                        console.log("ERROR add edge/dependency")
                    }
                })
            },
        })
    }

    handleChange(e) {
        console.log("Fruit Selected!!");
        this.setState({ fruit: e.target.value });
    }

    render(){
        const cyStyle = {
            width: '100%',
            height: '100%',
            position: 'absolute',
            left: 0,
            top: 0,
            zIndex: 10
        };
        console.log("Dagree2: " + this.state.moduleTypeUri);
        return (
            <div>
                <NavbarMenu />

                <div style={{position: 'absolute', padding: 20, zIndex: 20, width: '20%'}}>
                    <h5>Modules operations</h5>
                    <ModuleTypesSelection
                        scriptPath={this.state.file}
                        onChange={(value) => this.setState({moduleTypeUri: value, moduleUri: null})}
                    />
                </div>

                <SFormsModal
                    moduleTypeUri={this.state.moduleTypeUri}
                    moduleUri={this.state.moduleUri}
                    scriptPath={this.state.file}
                />
                <div>
                    <div style={cyStyle} id="cy"/>
                </div>
            </div>
        )
    }
}

export default Dagre;