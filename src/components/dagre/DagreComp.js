import React from 'react';
import CytoscapeComponent from 'react-cytoscapejs';

import cytoscape from 'cytoscape';
import dagre from 'cytoscape-dagre';
import edgehandles from 'cytoscape-edgehandles';
import cxtmenu from 'cytoscape-cxtmenu';

class DagreComp extends React.Component {
    constructor(props){
        super(props);
        cytoscape.use( dagre );
        cytoscape.use( edgehandles );
        cytoscape.use( cxtmenu );
    }

    render(){
        const elements = [
            { data: { id: 'one', label: 'Node 1' }, position: { x: 0, y: 0 } },
            { data: { id: 'two', label: 'Node 2' }, position: { x: 100, y: 0 } },
            { data: { id: 'three', label: 'Node 3' }, position: { x: 200, y: 0 } },
            { data: { id: 'four', label: 'Node 4' }, position: { x: 300, y: 0 } },
            { data: { source: 'one', target: 'two', label: 'Edge from Node1 to Node2' } },
            { data: { source: 'two', target: 'three', label: 'Edge from Node2 to Node3' } },
            { data: { source: 'two', target: 'four', label: 'Edge from Node2 to Node3' } },
            { data: { source: 'three', target: 'four', label: 'Edge from Node3 to Node4' } }
        ];
        const lay = {
            name: 'dagre',
            rankDir: 'LR'
        };
        const styles = {
            width: '100%',
            height: '100%',
            position: 'absolute',
            left: 0,
            top: 0
        };
        const stylesheet=[
            {
                selector: 'node',
                style: {
                    'background-color': '#11479e',
                    'label': 'data(id)'
                }
            },

            {
                selector: 'edge',
                style: {
                    'width': 2,
                    'target-arrow-shape': 'triangle',
                    'line-color': '#9dbaea',
                    'target-arrow-color': '#9dbaea',
                    'curve-style': 'bezier'
                }
            }
        ]

        // let cy = cytoscape({
        //     container: document.getElementById('#cy'),
        //     /* ... */
        // });

        return (
            <CytoscapeComponent elements={elements} style={styles} stylesheet={stylesheet} layout={lay} zoom={1}
            />
            // <Layout>
            //     <Header as="h2">Dagre page!</Header>
            // </Layout>
        );

    }
}

export default DagreComp;

