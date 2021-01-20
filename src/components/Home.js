import React from 'react';
import { Grid } from 'semantic-ui-react';

import Layout from './Layout';
import ScriptsTree from "./treebeard/ScriptsTree";

class Home extends React.Component {

  render() {
    return (
        <Layout>
          <Grid stackable columns={2}>
            <Grid.Row>
              <Grid.Column>
                {/*<Features />*/}
                {/*<Link to="/dynamic">Navigate to Dynamic Page</Link>*/}
                {/*<br />*/}
                {/*<Link to="/dagre_example">Navigate to Dagre Page</Link>*/}
                  <ScriptsTree />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Layout>
    );
  }

}

export default Home;
