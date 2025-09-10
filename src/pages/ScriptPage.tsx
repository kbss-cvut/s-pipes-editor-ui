import React from "react";
import cytoscape from "cytoscape";
import dagre from "cytoscape-dagre";
import edgehandles from "cytoscape-edgehandles";
import cxtmenu from "cytoscape-cxtmenu";
import popper from "cytoscape-popper";
import navigator from "cytoscape-navigator";
import expandCollapse from "cytoscape-expand-collapse";
import Rest from "@rest/Rest.tsx";
import NavbarMenu from "@components/NavbarMenu";
import SFormsModal from "@components/sform/SFormsModal";
import ModuleTypesSelection from "@components/ModuleTypesSelection";
import ScriptInputOutputModal from "@components/sform/ScriptInputOutputModal";
import { Dropdown } from "semantic-ui-react";
import { ICONS_MAP } from "@constants/dagreIcons";
import ScriptFunctionSelection from "@components/ScriptFunctionSelection";
import { Button, Toast, ToastContainer } from "react-bootstrap";
import ValidationReportModal from "@components/modal/ValidationReportModal";
import MoveModuleModal from "@components/modal/MoveModuleModal";
import ScriptOntologyModal from "@components/modal/ScriptOntologyModal";
import ScriptExecutionModal from "@components/modal/ScriptExecutionModal";
import ModuleExecutionModal from "@components/modal/ModuleExecutionModal";
import "@triply/yasgui/build/yasgui.min.css";
import SFormsFunctionModal from "@components/sform/SFormsFunctionModal";
import "@kbss-cvut/s-forms/css";
import Loading from "@components/Loading";
import ErrorModal from "@components/modal/ErrorModal";
import { useLocation } from "react-router-dom";
import {
  TYPE,
  LABEL,
  X,
  Y,
  EDGE,
  SOURCE_NODE,
  DESTINATION_NODE,
  NODE,
  COMPONENT,
  INPUT_PARAMETER,
  OUTPUT_PARAMETER,
  GROUP,
  MODULE_URI,
  MODULE_VARIABLE_NAME,
  MODULE_VARIABLE_VALUE,
  MODULE_VARIABLES,
  SCRIPT_PATH,
} from "@constants/vocabulary";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import { debounce } from "lodash";
import tippy from "tippy.js";
import "tippy.js/dist/tippy.css";

const rankDirOptions = [
  // preset
  // {'text' : 'Preset', 'key' : 'preset', 'value' : 'preset'},
  { text: "LeftRight", key: "LR", value: "LR" },
  { text: "TopBottom", key: "TB", value: "TB" },
];

const cyLayout = (rank) => {
  return {
    name: "dagre",
    rankDir: rank,
    nodeSep: 100,
    rankSep: 100,
    directed: true,
    padding: 100,
  };
};

const modalInputs = {
  logPath: null,
  moduleLabel: null,
  moduleTypeUri: null,
  moduleUri: null,
  functionUri: null,
  modalValidation: null,
  modalOntology: null,
  modalMove: null,
  selectedScript: null,
  modalExecution: null,
  fileEdit: null,
  errorMessage: null,
};

const websocketURL = new URL("/rest/notifications", window.location.href);
websocketURL.protocol = websocketURL.protocol.replace("http", "ws");
const client = new W3CWebSocket(websocketURL);

function getMenuButtonHtml({ iconClass, tooltip }: { iconClass: string; tooltip: string }) {
  return `<span class="menu-btn" data-tippy-content="${tooltip}">
    <i class="${iconClass}"></i>
  </span>`;
}

class Script extends React.Component {
  private domMutationObserver: MutationObserver;
  constructor(props) {
    super(props);

    const params = new URLSearchParams(props.location.search);
    this.state = {
      isLoaded: false,
      file: params.get("file"),
      transformation: params.get("transformation"),
      groups: new Set(),
      validationMap: new Map(),
      validationOrigin: null,
      nodes: [],
      edges: [],
      moduleTypeUri: null,
      moduleUri: null,
      scriptPath: null,
      moduleLabel: null,
      logPath: null,
      selectedScript: null,
      modalValidation: false,
      executionInfo: [],
      rankDir: "TB",
      popperItems: [],
      cytoscape: null,
      showNotification: false,
      notificationData: null,
      showModuleExecutionModal: false,
      subscript: null,
    };

    cytoscape.use(dagre);
    cytoscape.use(edgehandles);
    cytoscape.use(cxtmenu);
    cytoscape.use(popper);
    cytoscape.use(navigator);
    cytoscape.use(expandCollapse);
    cytoscape.warnings(false);
    this._keepAlive = this._keepAlive.bind(this);
    this.renderCytoscapeElement = this.renderCytoscapeElement.bind(this);
    this.handleRenderChange = this.handleRenderChange.bind(this);
    this.handleValidateReport = this.handleValidateReport.bind(this);
    this.handleErrorModal = this.handleErrorModal.bind(this);
  }

  componentWillMount() {
    client.onopen = () => {
      console.log("Open websocket");
      client.send(this.state.file);
      this._keepAlive(20000);
    };
    client.onmessage = (message) => {
      const msg = `${message["data"]}. Page should be reloaded!`;
      console.log(msg);
      this.setState({
        showNotification: true,
        notificationData: msg,
      });
    };
  }

  //prevent session timeout
  _keepAlive(timeout = 20000) {
    if (client.readyState === client.OPEN) {
      client.send("");
    }
    setTimeout(() => {
      this._keepAlive(20000);
    }, timeout);
  }

  componentWillUnmount() {
    if (client.readyState === client.OPEN || client.readyState === client.CONNECTING) {
      client.close();
    }

    if (this.domMutationObserver) {
      this.domMutationObserver.disconnect();
    }
  }

  componentDidMount() {
    //consider validation as part of module
    Rest.validateScript(this.state.file).then((validation) => {
      let result = new Map(validation.map((i) => [i[MODULE_URI], i]));
      this.setState({ validationMap: result, validationOrigin: validation });
      Rest.getScript(this.state.file, this.state.transformation).then((response) => {
        this._processGraph(response).then(() => {
          this.renderCytoscapeElement();
        });
      });
    });
  }

  _addNode(n, newNodes, newGroups) {
    if (n[GROUP] !== undefined) {
      if (!newGroups.has(n[GROUP])) {
        newGroups.add(n[GROUP]);
        newNodes.push({
          data: { id: n[GROUP], label: n[GROUP], input: [], output: [] },
        });
      }
    }

    const label = n[LABEL] === undefined ? n["@id"].toString().split("/").reverse()[0] : n[LABEL];
    const icon = ICONS_MAP[n[COMPONENT]] === undefined ? "beer.png" : ICONS_MAP[n[COMPONENT]];

    newNodes.push({
      data: {
        id: n["@id"],
        label: label,
        component: n[COMPONENT],
        type: n[TYPE],
        input: n[INPUT_PARAMETER],
        output: n[OUTPUT_PARAMETER],
        variables: n[MODULE_VARIABLES],
        icon: "/icons/" + icon,
        menu: true,
        scriptPath: n[SCRIPT_PATH],
        parent: n[GROUP],
        validation: this.state.validationMap.get(n["@id"]),
      },
      selectable: false,
      position: { x: n[X], y: n[Y] },
    });
  }

  _processGraph(data) {
    return new Promise((resolve) => {
      const newNodes = [];
      const newEdges = [];
      const newGroups = new Set(this.state.groups);

      data[NODE].forEach((n) => {
        if (n[TYPE] !== undefined) {
          this._addNode(n, newNodes, newGroups);
        }
      });

      data[EDGE].forEach((e) => {
        if (e[SOURCE_NODE][TYPE] !== undefined) {
          this._addNode(e[SOURCE_NODE], newNodes, newGroups);
        }
        if (e[DESTINATION_NODE][TYPE] !== undefined) {
          this._addNode(e[DESTINATION_NODE], newNodes, newGroups);
        }
      });

      data[EDGE].forEach((e) => {
        let from = typeof e[SOURCE_NODE] === "object" ? e[SOURCE_NODE]["@id"] : e[SOURCE_NODE];
        let to = typeof e[DESTINATION_NODE] === "object" ? e[DESTINATION_NODE]["@id"] : e[DESTINATION_NODE];
        newEdges.push({
          data: { source: from, target: to, menu: true },
          selectable: false,
        });
      });
      this.setState(
        (prevState) => ({
          nodes: [...prevState.nodes, ...newNodes],
          edges: [...prevState.edges, ...newEdges],
          groups: newGroups,
          isLoaded: true,
        }),
        () => {
          this.renderCytoscapeElement();
          resolve();
        },
      );
    });
  }

  handleErrorModal() {
    this.setState({ errorMessage: null, subscript: null });
  }

  handleRenderChange = (e, { value }) => {
    const modalState = JSON.parse(JSON.stringify(modalInputs));
    modalState["rankDir"] = value;
    this.setState(modalState);
    let layout = this.cy.layout(cyLayout(value));
    layout.run();
  };

  handleValidateReport = () => {
    const modalState = JSON.parse(JSON.stringify(modalInputs));
    modalState["modalValidation"] = true;
    this.setState(modalState);
    // window.location.href='?file=' + this.state.file
  };

  handleOntologyReport = () => {
    const modalState = JSON.parse(JSON.stringify(modalInputs));
    modalState["scriptPath"] = this.state.file;
    modalState["modalOntology"] = true;
    this.setState(modalState);
  };

  handleExecutionReport = () => {
    const modalState = JSON.parse(JSON.stringify(modalInputs));
    modalState["modalExecution"] = true;
    this.setState(modalState);
  };

  renderCytoscapeElement() {
    console.log("* Cytoscape.js is rendering the graph..");
    console.log(this.state.nodes);

    this.cy = cytoscape({
      container: document.getElementById("cy"),
      style: [
        {
          selector: "node",
          style: {
            shape: "rectangle",
            content: "data(name)",
            label: "data(label)",
            height: 40,
            width: 40,
            "background-image": "data(icon)",
            "background-fit": "cover cover",
          },
        },
        {
          selector: "node[validation]",
          css: {
            "background-color": "#721c24",
          },
        },
        {
          selector: "edge",
          style: {
            "curve-style": "straight",
            "target-arrow-shape": "triangle",
          },
        },
        {
          selector: ".eh-handle",
          style: {
            "background-color": "black",
            width: 8,
            height: 8,
            shape: "ellipse",
            "overlay-opacity": 0,
            "border-width": 8, // makes the handle easier to hit
            "border-opacity": 0,
          },
        },
        {
          selector: ".eh-hover",
          style: {
            "background-color": "black",
          },
        },
        {
          selector: ".eh-source",
          style: {
            "border-width": 2,
            "border-color": "black",
          },
        },
        {
          selector: ".eh-target",
          style: {
            "border-width": 2,
            "border-color": "black",
          },
        },
        {
          selector: ".eh-preview, .eh-ghost-edge",
          style: {
            "background-color": "black",
            "line-color": "black",
            "target-arrow-color": "black",
            "source-arrow-color": "black",
          },
        },
        {
          selector: ".eh-ghost-edge.eh-preview-active",
          style: {
            opacity: 0,
          },
        },
        {
          selector: ":parent",
          style: {
            "background-opacity": 0.111,
            label: "data(label)",
          },
        },
        {
          selector: "node.cy-expand-collapse-collapsed-node",
          style: {
            "background-color": "darkblue",
            shape: "rectangle",
          },
        },
        {
          selector: "edge.meta",
          style: {
            width: 2,
            "line-color": "red",
          },
        },
        {
          selector: ":selected",
          style: {
            // "border-width": 3,
            // "border-color": '#DAA520'
          },
        },
      ],
      elements: {
        nodes: this.state.nodes,
        edges: this.state.edges,
      },
      //https://github.com/cytoscape/cytoscape.js-dagre
      layout: cyLayout(this.state.rankDir),
    });

    // TODO consider usage of https://github.com/iVis-at-Bilkent/cytoscape.js-context-menus
    let filepath = this.state.file;
    this.cy.cxtmenu({
      selector: "node[menu]",
      commands: [
        {
          content: getMenuButtonHtml({ iconClass: "fa fa-trash fa-2x", tooltip: "Delete this module" }),
          select: (ele) => {
            this.setState({ isLoaded: false });
            Rest.deleteScriptNode(filepath, ele.data("id"))
              .then(() => {
                this.setState({ isLoaded: true });
                ele.remove();
              })
              .catch((error) => {
                this.setState({ errorMessage: "An error occurred during node deletion." });
                console.error(`An error occurred during node deletion: ${error}`);
              });
          },
          contentStyle: { "pointer-events": "all" },
        },
        {
          content: getMenuButtonHtml({
            iconClass: "fa fa-info-circle fa-2x",
            tooltip: "Show input and debug this module",
          }),
          select: (ele) => {
            const modalState = JSON.parse(JSON.stringify(modalInputs));
            modalState["input"] = "input";
            modalState["moduleURI"] = ele.data("id");
            modalState["logPath"] = ele.data("input");
            modalState["moduleLabel"] = ele.data("label");
            modalState["variables"] = ele.data("variables");
            modalState["scriptPath"] = ele.data("scriptPath");
            this.setState(modalState);
          },
          contentStyle: { "pointer-events": "all" },
        },
        {
          content: getMenuButtonHtml({ iconClass: "fa fa-play-circle fa-2x", tooltip: "Execute this module" }),
          select: (ele) => {
            const modalState = JSON.parse(JSON.stringify(modalInputs));
            modalState["moduleURI"] = ele.data("id");
            modalState["moduleLabel"] = ele.data("label");
            modalState["scriptPath"] = ele.data("scriptPath");
            modalState["showModuleExecutionModal"] = true;
            this.setState(modalState);
          },
          contentStyle: { "pointer-events": "all" },
        },
        {
          content: getMenuButtonHtml({
            iconClass: "fa fa-file fa-2x",
            tooltip: "Open script where this module is defined",
          }),
          select: (ele) => {
            //TODO modal with style
            if (ele.data("scriptPath") === this.state.file) {
              alert("Script path is the same as actual one");
            } else if (ele.data("scriptPath") === undefined) {
              alert("Script path is not defined");
            } else {
              window.location.href = "?file=" + ele.data("scriptPath");
            }
          },
          contentStyle: { "pointer-events": "all" },
        },
        {
          content: getMenuButtonHtml({ iconClass: "fa fa-plane fa-2x", tooltip: "Move this module to another script" }),
          select: (ele) => {
            const modalState = JSON.parse(JSON.stringify(modalInputs));
            modalState["selectedScript"] = ele.data("scriptPath");
            modalState["moduleURI"] = ele.data("id");
            modalState["modalMove"] = true;
            this.setState(modalState);
          },
          contentStyle: { "pointer-events": "all" },
        },
        {
          content: getMenuButtonHtml({ iconClass: "fa fa-bug fa-2x", tooltip: "Validate" }),
          select: (ele) => {
            // //TODO modal with style
            console.log(ele.data("validation"));
            if (ele.data("validation") === undefined) {
              alert("EVERYTHING IS OK");
            } else {
              alert(
                ele.data("validation")["http://onto.fel.cvut.cz/ontologies/s-pipes/rule-comment"] +
                  "\n" +
                  ele.data("validation")["http://onto.fel.cvut.cz/ontologies/s-pipes/error-message"],
              );
            }
          },
          contentStyle: { "pointer-events": "all" },
        },
        {
          content: getMenuButtonHtml({ iconClass: "fa fa-info-circle fa-2x", tooltip: "Show output" }),
          select: (ele) => {
            const modalState = JSON.parse(JSON.stringify(modalInputs));
            modalState["input"] = "output";
            modalState["moduleURI"] = ele.data("id");
            modalState["logPath"] = ele.data("output");
            modalState["moduleLabel"] = ele.data("label");
            this.setState(modalState);
          },
          contentStyle: { "pointer-events": "all" },
        },
        {
          content: getMenuButtonHtml({ iconClass: "fa fa-cogs fa-2x", tooltip: "Edit this module" }),
          select: (ele) => {
            const modalState = JSON.parse(JSON.stringify(modalInputs));
            modalState["moduleTypeUri"] = ele.data("component");
            modalState["moduleUri"] = ele.data("id");
            modalState["fileEdit"] = ele.data("scriptPath");
            this.setState(modalState);
          },
          contentStyle: { "pointer-events": "all" },
        },
      ],
    });

    this.cy.cxtmenu({
      selector: "edge[menu]",
      commands: [
        {
          content: getMenuButtonHtml({ iconClass: "fa fa-trash fa-2x", tooltip: "Delete dependency" }),
          select: (ele) => {
            let sourceNode = ele.data("source");
            let targetNode = ele.data("target");
            this.setState({ isLoaded: false });
            Rest.deleteScriptEdge(filepath, sourceNode, targetNode)
              .then(() => {
                this.setState({ isLoaded: true });
                ele.remove();
              })
              .catch((error) => {
                this.setState({
                  errorMessage: `An error occurred during edge deletion\n ${error.response?.data.message}`,
                  subscript: error.response?.data.subscript ?? null,
                });
                console.error(`An error occurred during edge deletion: ${error.response?.data.message}`);
              });
          },
          contentStyle: { "pointer-events": "all" },
        },
      ],
    });

    // Callback to initialize tooltips for menu buttons of modules
    const initTooltipDOMMutationCallback = debounce(() => {
      document.querySelectorAll(".menu-btn[data-tippy-content]").forEach((el) => {
        if (el._tippy) return;

        tippy(el, {
          content: el.getAttribute("data-tippy-content"),
          placement: "right",
          arrow: true,
          delay: [500, 0],
        });
      });
    }, 100);

    this.domMutationObserver = new MutationObserver(initTooltipDOMMutationCallback);
    const cytoscapeContainer = document.querySelector(".__________cytoscape_container");
    if (cytoscapeContainer) {
      this.domMutationObserver.observe(cytoscapeContainer, { childList: true, subtree: true });
    }

    this.cy.edgehandles({
      handleNodes: "node[menu]",
      handlePosition: function (node) {
        return "right right";
      },
      complete: (sourceNode, targetNode, addedEles) => {
        console.log(sourceNode.data("id"));
        console.log(targetNode.data("id"));
        if (sourceNode.data("menu") !== undefined && targetNode.data("menu")) {
          this.setState({ isLoaded: false });
          Rest.addModuleDependency(this.state.file, sourceNode.data("id"), targetNode.data("id"))
            .then((res) => {
              this.setState({ isLoaded: true });
            })
            .catch((error) => {
              this.setState({
                errorMessage: `An error occurred while adding edge/dependency\n ${error.response?.data.message}`,
                subscript: error.response?.data.subscript ?? null,
              });
              console.error(`An error occurred while adding edge/dependency: ${error.response?.data.message}`);
            });
        } else {
          this.cy.remove("edge[source='" + sourceNode.data("id") + "']");
          this.cy.remove("edge[target='" + targetNode.data("id") + "']");
          alert("Invalid operation.");
        }
      },
    });

    for (const [index, value] of this.state.popperItems.entries()) {
      value.destroy();
    }
    //JUST visualization of input/output - it would be much better menu, but onclick is tricky to make work
    const items = [];
    const poperContent = () => {
      let div = document.createElement("div");
      div.classList.add("popper-div");
      div.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" height="0.75em"><path d="M256 8C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm0 110c23.196 0 42 18.804 42 42s-18.804 42-42 42-42-18.804-42-42 18.804-42 42-42zm56 254c0 6.627-5.373 12-12 12h-88c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h12v-64h-12c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h64c6.627 0 12 5.373 12 12v100h12c6.627 0 12 5.373 12 12v24z"/></svg>';
      document.body.appendChild(div);
      return div;
    };
    for (const [index, value] of this.cy.nodes().entries()) {
      if (value.data("input").length > 0) {
        let p = value.popper({
          content: poperContent,
          popper: {
            placement: "left-end",
          },
        });
        items.push(p);
        this.setState({
          popperItems: [...this.state.popperItems, p],
        });
      }
      if (value.data("output").length > 0) {
        let p = value.popper({
          content: poperContent,
          popper: {
            placement: "right-end",
          },
        });
        items.push(p);
        this.setState({
          popperItems: [...this.state.popperItems, p],
        });
      }
    }
    let update = () => {
      for (const [index, value] of items.entries()) {
        value.update();
      }
    };
    for (const [index, value] of this.cy.nodes().entries()) {
      value.on("position", update);
    }
    this.cy.on("pan zoom resize", update);

    //navigator bird-eye
    this.cy.navigator({});

    this.cy.expandCollapse({
      undoable: false,
    });

    this.cy.on(
      "mouseover",
      "node[menu]",
      function (event) {
        const modalState = JSON.parse(JSON.stringify(modalInputs));
        let variables = event.target.data("variables");
        modalState["executionInfo"] = variables;
        this.setState(modalState);
      }.bind(this),
    );

    this.cy.on(
      "mouseout",
      "node[menu]",
      function (event) {
        const modalState = JSON.parse(JSON.stringify(modalInputs));
        modalState["executionInfo"] = [];
        this.setState(modalState);
      }.bind(this),
    );

    this.cy.on("tap", ":parent", ({ target: node }) => {
      const scriptPath = node.children()[0]?.data("scriptPath");

      if (scriptPath) {
        const url = `${location.origin}/script?file=${scriptPath}`;
        console.log("Opening script editor at:", url);
        window.open(url, "_blank");
      } else {
        console.warn("File path not found in parent node!");
      }
    });
  }

  render() {
    const cyStyle = {
      width: "100%",
      height: "100%",
      position: "absolute",
      left: 0,
      top: 0,
      zIndex: 2,
    };
    return (
      <div>
        {this.state.isLoaded === false && <Loading />}
        <NavbarMenu />

        <ToastContainer position="top-end" className="p-3" style={{ zIndex: 100 }}>
          <Toast
            onClose={() => {
              this.setState({
                showNotification: false,
              });
            }}
            show={this.state.showNotification}
            delay={5000}
            autohide
          >
            <Toast.Header className="bg-warning">
              <strong className="me-auto">Notification</strong>
            </Toast.Header>
            <Toast.Body>{this.state.notificationData}</Toast.Body>
          </Toast>
        </ToastContainer>

        <div>
          <div key={"cyKey"} style={cyStyle} id="cy" />
        </div>

        {/*Options*/}
        <div style={{ position: "absolute", padding: 20, zIndex: 20, width: "25%" }}>
          <h5>Nodes count: {this.state.nodes.filter((x) => x["selectable"] !== undefined).length}</h5>
          <h5>Add module</h5>
          <ModuleTypesSelection
            scriptPath={this.state.file}
            onChange={(value) => {
              const modalState = JSON.parse(JSON.stringify(modalInputs));
              modalState["moduleTypeUri"] = value;
              this.setState(modalState);
            }}
          />

          <br />

          <h5>Function call</h5>
          <ScriptFunctionSelection
            scriptPath={this.state.file}
            onChange={(value) => {
              const modalState = JSON.parse(JSON.stringify(modalInputs));
              modalState["functionUri"] = value[1];
              this.setState(modalState);
            }}
          />

          <br />

          <h5>Graph render strategy</h5>
          <Dropdown
            placeholder="Render strategy"
            options={rankDirOptions}
            value={this.state.rankDir}
            selection
            onChange={this.handleRenderChange}
          />

          {this.state.transformation !== null && (
            <div>
              <br />
              <Button variant="info" onClick={() => this.handleExecutionReport()}>
                Execution report
              </Button>
              <br />
            </div>
          )}

          <div>
            <br />
            <Button variant="info" onClick={() => this.handleOntologyReport()}>
              Manage script's ontology
            </Button>
            <br />
          </div>

          <div>
            <br />
            <Button variant="info" onClick={() => this.handleValidateReport()}>
              Validate Report
            </Button>
          </div>

          {this.state.executionInfo.length > 0 && (
            <div>
              <hr />
              <h4>Variables info</h4>
              {this.state.executionInfo
                .sort((a, b) => a[MODULE_VARIABLE_NAME].localeCompare(b[MODULE_VARIABLE_NAME]))
                .map((d, k) => {
                  return (
                    <div key={"variable" + k}>
                      {d[MODULE_VARIABLE_NAME]}: {d[MODULE_VARIABLE_VALUE].replace(/^.*[\\\/]/, "")}
                    </div>
                  );
                })}
            </div>
          )}
        </div>

        {/*Modal windows*/}
        <SFormsModal
          moduleTypeUri={this.state.moduleTypeUri}
          moduleUri={this.state.moduleUri}
          scriptPath={this.state.fileEdit != null ? this.state.fileEdit : this.state.file}
          executionScriptPath={this.state.fileEdit != null ? this.state.file : undefined}
        />

        <SFormsFunctionModal scriptPath={this.state.file} functionUri={this.state.functionUri} />

        <ScriptInputOutputModal
          logPath={this.state.logPath}
          input={this.state.input}
          variables={this.state.variables}
          scriptPath={this.state.scriptPath}
          moduleURI={this.state.moduleURI}
          moduleLabel={this.state.moduleLabel}
        />
        <ModuleExecutionModal
          moduleURI={this.state.moduleURI}
          moduleLabel={this.state.moduleLabel}
          scriptPath={this.state.scriptPath}
          showModuleExecutionModal={this.state.showModuleExecutionModal}
          onClose={() => {
            const modalState = JSON.parse(JSON.stringify(this.state));
            modalState.showModuleExecutionModal = false;
            this.setState(modalState);
          }}
        />

        {/*<FunctionExecutionModal*/}
        {/*    functionUri={this.state.functionUri}*/}
        {/*/>*/}

        <ValidationReportModal
          validationOrigin={this.state.validationOrigin}
          modalValidation={this.state.modalValidation}
          cy={this.cy}
        />

        <MoveModuleModal
          sourceScriptPath={this.state.file}
          moduleScriptPath={this.state.selectedScript}
          moduleURI={this.state.moduleURI}
          modalMove={this.state.modalMove}
        />

        <ScriptOntologyModal scriptPath={this.state.scriptPath} modalOntology={this.state.modalOntology} />

        <ScriptExecutionModal
          transformationId={this.state.transformation}
          modalExecution={this.state.modalExecution}
          cy={this.cy}
        />

        <ErrorModal
          errorMessage={this.state.errorMessage}
          subscript={this.state.subscript}
          handleErrorModal={this.handleErrorModal}
        />
      </div>
    );
  }
}

const ScriptPage = () => {
  const location = useLocation();
  return <Script location={location} />;
};

export default ScriptPage;
