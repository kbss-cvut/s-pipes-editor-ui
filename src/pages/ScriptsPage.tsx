import React from "react";
import { Grid } from "semantic-ui-react";
import ScriptsTree from "@components/treebeard/ScriptsTree";

class ScriptsPage extends React.Component {
  render() {
    return (
      <Grid stackable columns={2}>
        <Grid.Row>
          <Grid.Column>
            <ScriptsTree />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default ScriptsPage;
