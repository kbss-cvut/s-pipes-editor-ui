import React, { Fragment } from "react";
import { includes } from "lodash";

import styles from "./styles";
import Header from "./Header";
import { Treebeard, decorators } from "react-treebeard";
import Rest from "../rest/Rest";
import { withRouter } from "react-router-dom";
import ScriptActionsModuleModal from "../modal/ScriptActionsModuleModal";
import Loading from "../Loading";
import ErrorModal from "../modal/ErrorModal";

class ScriptsTree extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      scriptPath: null,
      displayName: null,
      type: null,
      errorMessage: null,
      isLoaded: null,
    };
    this.handleRefresh = this.handleRefresh.bind(this);
    this.handleErrorModal = this.handleErrorModal.bind(this);
    this.onToggle = this.onToggle.bind(this);
    this.onSelect = this.onSelect.bind(this);
  }

  componentDidMount() {
    Rest.getScripts().then((response) => {
      if (response.status === 404 || response["children"] === undefined) {
        console.log("ERROR when loading scripts! Check configuration.");
        this.setState({ errorMessage: "ERROR when loading scripts! Check configuration." });
      } else {
        response["toggled"] = true;
        if (response["children"][0] !== undefined) {
          response["children"][0]["toggled"] = true;
        }
        this.setState({ data: response });

        document.addEventListener("contextmenu", (e) => {
          let dataId = e.target.getAttribute("data-id");
          if (dataId !== undefined) {
            e.preventDefault();
            if (dataId !== "") {
              let childrenId = e.target.getAttribute("data-children");
              let displayName = e.target.innerText;
              this.setState({ scriptPath: dataId, displayName: displayName, type: childrenId });
            }
          }
        });
      }
    });
  }

  handleErrorModal() {
    this.setState({ errorMessage: null });
  }

  onToggle(node, toggled) {
    const { cursor, data } = this.state;

    if (cursor) {
      this.setState(() => ({ cursor, active: false }));
    }

    node.active = true;
    if (node.children) {
      node.toggled = toggled;
    } else {
      window.location.href = "/script?file=" + node.id;
    }

    this.setState(() => ({ cursor: node, data: Object.assign({}, data), scriptPath: null }));
  }

  onSelect(node) {
    const { cursor, data } = this.state;

    if (cursor) {
      this.setState(() => ({ cursor, active: false }));
      if (!includes(cursor.children, node)) {
        cursor.toggled = false;
        cursor.selected = false;
      }
    }

    node.selected = true;

    this.setState(() => ({ cursor: node, data: Object.assign({}, data), scriptPath: null }));
  }

  handleRefresh() {
    this.setState({ displayName: null });
    this.componentDidMount();
  }

  render() {
    if (this.state.data.length === 0) {
      return <Loading size={"large"} style={{ margin: "auto", position: "absolute", inset: "0px", zIndex: 9000 }} />;
    } else {
      return (
        <Fragment>
          <h3>Scripts</h3>
          <p>Right click on directory/file to add/remove file</p>
          <div style={styles.component}>
            <Treebeard
              data={this.state.data}
              onToggle={this.onToggle}
              onSelect={this.onSelect}
              decorators={{ ...decorators, Header }}
              style={styles.treeStyle}
            />
          </div>

          <ScriptActionsModuleModal
            scriptPath={this.state.scriptPath}
            displayName={this.state.displayName}
            type={this.state.type}
            handleRefresh={this.handleRefresh}
          />
          <ErrorModal errorMessage={this.state.errorMessage} handleErrorModal={this.handleErrorModal} />
        </Fragment>
      );
    }
  }
}

export default withRouter(ScriptsTree);
