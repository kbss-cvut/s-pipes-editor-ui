import React, { Component } from "react";
import { Switch, BrowserRouter as Router, Route } from "react-router-dom";
import importedComponent from "react-imported-component";

import Home from "./Home.jsx";
import Loading from "./Loading.jsx";

const Scripts = importedComponent(() => import(/* webpackChunkName:'Scripts' */ "./Scripts.jsx"), {
  LoadingComponent: Loading,
});
const Executions = importedComponent(() => import(/* webpackChunkName:'Executions' */ "./Executions.jsx"), {
  LoadingComponent: Loading,
});
const AsyncDynamicPAge = importedComponent(() => import(/* webpackChunkName:'DynamicPage' */ "./DynamicPage.jsx"), {
  LoadingComponent: Loading,
});
const AsyncDagre = importedComponent(() => import(/* webpackChunkName:'Dagre' */ "./dagre/Dagre.jsx"), {
  LoadingComponent: Loading,
});
const AsyncNoMatch = importedComponent(() => import(/* webpackChunkName:'NoMatch' */ "./NoMatch.jsx"), {
  LoadingComponent: Loading,
});

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/scripts" component={Scripts} />
            <Route exact path="/executions" component={Executions} />
            {/*<Route exact path="/dynamic" component={AsyncDynamicPAge} />*/}
            <Route exact path="/script" component={AsyncDagre} />
            <Route component={AsyncNoMatch} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
