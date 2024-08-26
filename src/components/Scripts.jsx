import React from "react";
import { Grid } from "semantic-ui-react";

import Layout from "./Layout.jsx";
import ScriptsTree from "./treebeard/ScriptsTree.jsx";
import { Link } from "react-router-dom";

class Scripts extends React.Component {
  render() {
    return (
      <Layout>
        <Grid stackable columns={2}>
          <Grid.Row>
            <Grid.Column>
              <ScriptsTree />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Layout>
    );
  }
}

export default Scripts;
