import React, {Component} from 'react';
import { Switch, BrowserRouter as Router, Route } from 'react-router-dom';
import importedComponent from 'react-imported-component';

import Home from './Home';
import Loading from './Loading';

const Scripts = importedComponent(
    () => import(/* webpackChunkName:'Scripts' */ './Scripts'),
    {
        LoadingComponent: Loading
    }
);
const Executions = importedComponent(
    () => import(/* webpackChunkName:'Executions' */ './Executions'),
    {
        LoadingComponent: Loading
    }
);
const AsyncDynamicPAge = importedComponent(
  () => import(/* webpackChunkName:'DynamicPage' */ './DynamicPage'),
  {
    LoadingComponent: Loading
  }
);
const AsyncDagre = importedComponent(
    () => import(/* webpackChunkName:'Dagre' */ './dagre/Dagre.js'),
    {
        LoadingComponent: Loading
    }
);
const AsyncNoMatch = importedComponent(
  () => import(/* webpackChunkName:'NoMatch' */ './NoMatch'),
  {
    LoadingComponent: Loading
  }
);


class App extends Component {

    render() {
        return(
                <Router>
                    <div>
                        <Switch>
                            <Route exact path="/" component={Home} />
                            <Route exact path="/scripts" component={Scripts} />
                            <Route exact path="/executions" component={Executions} />
                            {/*<Route exact path="/dynamic" component={AsyncDynamicPAge} />*/}
                            <Route exact path="/dagre_example" component={AsyncDagre} />
                            <Route component={AsyncNoMatch} />
                        </Switch>
                    </div>
                </Router>
            )
    }
}

export default App;
