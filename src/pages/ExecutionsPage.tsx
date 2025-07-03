import React, { useEffect, useState } from "react";
import DebugModal from "@components/modal/DebugModal";

import Rest from "@rest/Rest.tsx";
import { Table } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faEdit } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import Loading from "@components/Loading";

const ExecutionsPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Rest.getDebugExecutions().then((response) => {
      console.log(response);
      setData(response);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <h3 className="mt-3">Executions</h3>
      <Table striped bordered hover>
        <thead style={{ textAlign: "center" }}>
          <tr>
            <th>ID</th>
            <th>Started</th>
            <th>Completed</th>
            <th>Modules Executed</th>
            <th>Status</th>
            <th>Function Name</th>
            <th>Script Name</th>
            <th>Action</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody style={{ textAlign: "center" }}>
          {data
            .filter((v) => v !== null)
            .map((data, key) => {
              const executionId = data.id?.split("/").pop() ?? "—";
              return (
                <tr key={key}>
                  <td>
                    <span
                      style={{ cursor: "pointer", color: "#007bff", textDecoration: "underline" }}
                      onClick={() => openJsonInNewTab(data)}
                      title="Open JSON"
                    >
                      {executionId}
                    </span>
                  </td>
                  <td>
                    {data.has_pipepline_execution_date
                      ? dayjs(data.has_pipepline_execution_date).format("YYYY-MM-DD HH:mm:ss.SSS")
                      : "—"}
                  </td>
                  <td>
                    {data.has_pipeline_execution_finish_date
                      ? dayjs(data.has_pipeline_execution_finish_date).format("YYYY-MM-DD HH:mm:ss.SSS")
                      : "—"}
                  </td>
                  <td>{data.has_module_executions?.length ?? 0}</td>
                  <td>{data.has_pipeline_execution_status ?? "STARTED"}</td>
                  <td>{data.has_executed_function_name ?? "—"}</td>
                  <td>{data.has_pipeline_name ?? "—"}</td>
                  <td>
                    <Link to={`/execution?id=${executionId}`}>
                      <FontAwesomeIcon icon={faSearch} />
                    </Link>
                  </td>
                  <td>
                    <Link to={`/script?file=${data.has_executed_function_script_path}`}>
                      <FontAwesomeIcon icon={faEdit} />
                    </Link>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </Table>
    </>
  );
};

const openJsonInNewTab = (jsonData) => {
  const jsonString = JSON.stringify(jsonData, null, 2);
  const newWindow = window.open();
  newWindow.document.open();
  newWindow.document.write("<html><body><pre>" + jsonString + "</pre></body></html>");
  newWindow.document.close();
};

export default ExecutionsPage;
