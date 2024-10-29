import React from "react";
import { Grid } from "semantic-ui-react";

import Layout from "./Layout";
import ScriptsTree from "./treebeard/ScriptsTree";
import { Link } from "react-router-dom";

class Home extends React.Component {
  render() {
    return (
      <Grid stackable columns={2}>
        <Grid.Row>
          <Grid.Column>
            <h1>Welcome to SPipes editor</h1>
            <br></br>
            <ScriptsTree />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default Home;
