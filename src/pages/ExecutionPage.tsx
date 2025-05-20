import React, { useEffect, useRef, useState } from "react";
import cytoscape from "cytoscape";
import dagre from "cytoscape-dagre";
import { createPopper } from "@popperjs/core";
import popper from "cytoscape-popper";
import dayjs from "dayjs";
import { createRoot } from "react-dom/client";
import { Rest } from "@rest/Rest.tsx";
import { useSearchParams } from "react-router-dom";
import { Button, Col, Container, Row } from "react-bootstrap";
import NavbarMenu from "@components/NavbarMenu";
import Loading from "@components/Loading";
import DebugModal from "@components/modal/DebugModal";
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

cytoscape.use(dagre);
cytoscape.use(popper(createPopper));

const openJsonInNewTab = (jsonData) => {
  const jsonString = JSON.stringify(jsonData, null, 2);
  const newWindow = window.open();
  newWindow.document.open();
  newWindow.document.write("<html><body><pre>" + jsonString + "</pre></body></html>");
  newWindow.document.close();
};

export function GraphDBLink({ id }) {
  if (!id) return null;
  const baseUrl = "http://localhost:1235/services/db-server/resource";
  const url = `${baseUrl}?uri=${encodeURIComponent(id)}&role=context`;
  return (
    <a href={url} target="_blank" rel="noopener noreferrer">
      GraphDB <FontAwesomeIcon icon={faExternalLinkAlt} />
    </a>
  );
}

function NodePopperContent({ nodeData, onClose }) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #ccc",
        borderRadius: 8,
        padding: 12,
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        minWidth: 250,
        zIndex: 2000,
        position: "relative",
      }}
    >
      <button
        onClick={onClose}
        style={{
          position: "absolute",
          top: 8,
          right: 8,
          background: "transparent",
          border: "none",
          fontSize: 24,
          fontWeight: "bold",
          cursor: "pointer",
          lineHeight: 1,
        }}
        aria-label="Close"
      >
        ×
      </button>
      <div>
        <div>
          <b>Label:</b> {nodeData.label}
        </div>
        <div>
          <b>ID:</b> {nodeData.id.split("/").pop()}
        </div>
        <div>
          <b>Start date:</b> {dayjs(nodeData.start_date).format("YYYY-MM-DD HH:mm:ss.SSS")}
        </div>
        <div>
          <b>Finish date:</b> {dayjs(nodeData.finish_date).format("YYYY-MM-DD HH:mm:ss.SSS")}
        </div>
        <div>
          <b>Duration:</b> {nodeData.duration} ms
        </div>
        <div>
          <b>Input triples count:</b> {nodeData.input_triple_count}
        </div>

        <div>
          <b>Input:</b> <GraphDBLink id={nodeData.has_rdf4j_input && nodeData.has_rdf4j_input} />
        </div>
        <div>
          <b>Output triples count:</b> {nodeData.output_triple_count}
        </div>
        <div>
          <b>Output:</b> <GraphDBLink id={nodeData.has_rdf4j_output && nodeData.has_rdf4j_output} />
        </div>
      </div>
    </div>
  );
}

function renderGraph(modules) {
  if (!Array.isArray(modules)) {
    return { nodes: [], edges: [] };
  }
  const nodes = modules.map((mod) => ({
    data: {
      id: mod.id,
      label: mod.has_module_id ? mod.has_module_id.split("/").pop() : mod.id,
      start_date: mod.start_date,
      finish_date: mod.finish_date,
      duration: mod.duration,
      input_triple_count: mod.input_triple_count,
      output_triple_count: mod.output_triple_count,
      has_related_resources: mod.has_related_resources.id,
      executed_in: mod.executed_in.id,
      has_rdf4j_input: mod.has_rdf4j_input.id,
      has_rdf4j_output: mod.has_rdf4j_output.id,
    },
  }));
  console.log("nodes", nodes);

  const edges = [];
  modules.forEach((mod) => {
    if (mod.has_next) {
      edges.push({
        data: {
          source: mod.id,
          target: mod.has_next,
        },
      });
    }
  });

  return { nodes, edges };
}

function ExecutionPage() {
  const [executionData, setExecutionData] = useState([]);
  const [executionName, setExecutionName] = useState([]);
  const [moduleData, setModuleData] = useState(null);
  const [searchParams] = useSearchParams();
  const executionId = searchParams.get("id");
  const [showDebugModal, setShowDebugModal] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const cyRef = useRef(null);
  const cyInstance = useRef(null);

  useEffect(() => {
    setIsLoaded(false);
    Promise.all([
      Rest.getExecution(executionId),
      Rest.getExecutionName(executionId),
      Rest.getExecutionModules(executionId),
    ]).then(([execution, name, modules]) => {
      setExecutionData(execution);
      setExecutionName(name);
      setModuleData(modules);
      setIsLoaded(true);
      processGraph(modules);
    });
  }, [executionId]);

  useEffect(() => {
    if (isLoaded && moduleData) {
      processGraph(moduleData);
    }
  }, [isLoaded, moduleData]);

  function processGraph(executionData) {
    if (!executionData || !isLoaded) {
      return;
    }
    const { nodes, edges } = renderGraph(executionData);

    if (cyInstance.current) {
      cyInstance.current.destroy();
    }

    cyInstance.current = cytoscape({
      container: cyRef.current,
      elements: { nodes, edges },
      style: [
        {
          selector: "node",
          style: {
            shape: "rectangle",
            content: "data(label)",
            "text-valign": "center",
            "text-halign": "center",
            width: "label",
            height: "label",
            padding: "10px",
            "background-color": "#ccc",
            color: "black",
            "font-size": 14,
            "text-wrap": "wrap",
            "text-max-width": 120,
          },
        },
        {
          selector: "edge",
          style: {
            "curve-style": "straight",
            "target-arrow-shape": "triangle",
          },
        },
      ],
      layout: {
        name: "dagre",
        rankDir: "TB",
        nodeSep: 100,
        rankSep: 100,
        directed: true,
        padding: 100,
      },
    });

    let popperInstance = null;
    let popperDiv = null;
    let popperRoot = null;

    function closePopper() {
      if (popperInstance) {
        popperInstance.destroy();
        popperInstance = null;
      }
      if (popperRoot && popperDiv) {
        popperRoot.unmount();
        popperDiv.remove();
        popperRoot = null;
        popperDiv = null;
      }
    }

    cyInstance.current.on("tap", "node", (evt) => {
      closePopper();

      const node = evt.target;
      const nodeData = node.data();

      popperDiv = document.createElement("div");
      document.body.appendChild(popperDiv);
      popperRoot = createRoot(popperDiv);
      popperRoot.render(<NodePopperContent nodeData={nodeData} onClose={closePopper} />);
      popperInstance = node.popper({
        content: () => popperDiv,
        popper: { placement: "right", removeOnDestroy: true },
      });
    });

    return () => {
      closePopper();
      if (cyInstance.current) {
        cyInstance.current.destroy();
        cyInstance.current = null;
      }
    };
  }

  return (
    <>
      <NavbarMenu />
      {!isLoaded ? (
        <Loading />
      ) : (
        <Container>
          <Row>
            <h6 className="mt-2">Pipeline Execution</h6>
            <h2 className="mb-4">{executionName}</h2>
          </Row>
          <Row>
            <Col xs={3}>
              <div className="sidebar-panel">
                <h5>Execution Info</h5>
                <div>
                  <b>ID:</b> {executionData.id?.split("/").pop()}
                </div>
                <div>
                  <b>Date:</b> {dayjs(executionData.has_pipepline_execution_date).format("YYYY-MM-DD HH:mm:ss.SSS")}
                </div>
                <div>
                  <b>Type:</b> {executionData.types?.join(", ")}
                </div>
                <div>
                  <b>Modules executed: </b> {executionData.has_module_executions?.length}
                </div>
              </div>
              <Button variant="primary" className="mt-3" onClick={() => setShowDebugModal(true)}>
                Debug Modal
              </Button>
              <br />
              <Button variant="outline-secondary" className="mt-3" onClick={() => openJsonInNewTab(executionData)}>
                Execution JSON <FontAwesomeIcon icon={faExternalLinkAlt} />
              </Button>
            </Col>
            <Col xs={9}>
              <div
                ref={cyRef}
                style={{
                  width: "100%",
                  height: "90vh",
                  border: "2px solid #ccc",
                  background: "#fcfcfc",
                }}
              />
            </Col>
          </Row>
        </Container>
      )}
      {showDebugModal && (
        <DebugModal
          show={showDebugModal}
          onHide={() => setShowDebugModal(false)}
          id={executionId}
          name={executionName}
          modulesData={moduleData}
        />
      )}
    </>
  );
}

export default ExecutionPage;
