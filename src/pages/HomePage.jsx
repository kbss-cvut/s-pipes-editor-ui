import React from "react";
import { Grid } from "semantic-ui-react";
import ScriptsTree from "../components/treebeard/ScriptsTree.jsx";

class HomePage extends React.Component {
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

export default HomePage;
