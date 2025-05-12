import React, { useEffect, useRef, useState } from "react";
import cytoscape from "cytoscape";
import cytoscapePopper from "cytoscape-popper";
import { createPopper } from "@popperjs/core";
import dagre from "cytoscape-dagre";
import { createRoot } from "react-dom/client";
import { Rest } from "@rest/Rest.tsx";
import { useSearchParams } from "react-router-dom";

cytoscape.use(dagre);
cytoscape.use(cytoscapePopper(createPopper));

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
      <strong>Label:</strong> {nodeData.label}
      <br />
      <strong>ID:</strong> {nodeData.id}
      <br />
      <strong>Input triples:</strong> {nodeData.input_triple_count}
      <br />
      <strong>Output triples:</strong> {nodeData.output_triple_count}
      <br />
      <button onClick={onClose} style={{ marginTop: 10 }}>
        Close
      </button>
    </div>
  );
}

function buildExecutionGraph(data) {
  if (!data || !Array.isArray(data.has_module_executions)) {
    return { nodes: [], edges: [] };
  }
  const nodes = data.has_module_executions.map((mod) => ({
    data: {
      id: mod.id,
      label: mod.has_module_id.split("/").pop(),
      input_triple_count: mod.input_triple_count,
      output_triple_count: mod.output_triple_count,
    },
  }));

  const edges = [];
  data.has_module_executions.forEach((mod) => {
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
  const [searchParams] = useSearchParams();
  const executionId = searchParams.get("id");

  const cyRef = useRef(null);
  const cyInstance = useRef(null);
  useEffect(() => {
    Rest.getExecution(executionId).then((response) => {
      setExecutionData(response);
    });
    Rest.getExecutionName(executionId).then((response) => {
      setExecutionName(response[0]);
    });
  }, []);

  useEffect(() => {
    if (!executionData) return;

    const { nodes, edges } = buildExecutionGraph(executionData);

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
            "background-color": "#888",
            color: "#fff",
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
  }, [executionData]);

  return (
    <div>
      <h2>{executionName}</h2>
      <p>Execution ID: {executionId}</p>
      <div
        ref={cyRef}
        style={{
          width: "80vw",
          height: "90vh",
          border: "2px solid #ccc",
          background: "#fafafa",
        }}
      />
    </div>
  );
}

export default ExecutionPage;
