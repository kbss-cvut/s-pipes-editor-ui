import React, { useEffect, useState } from "react";
import DebugModal from "@components/modal/DebugModal";

import Rest from "@rest/Rest.tsx";
import { Table } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
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
            <th>Modules Executed</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody style={{ textAlign: "center" }}>
          {data
            .filter((v) => v !== null)
            .map((data, key) => {
              const executionId = data.id.split("/").pop();
              return (
                <tr key={key}>
                  <td>{executionId}</td>
                  <td>{dayjs(data.has_pipepline_execution_date).format("YYYY-MM-DD HH:mm:ss.SSS")}</td>
                  <td>{data.has_module_executions.length}</td>
                  <td>
                    <Link to={`/execution?id=${executionId}`}>
                      <FontAwesomeIcon icon={faSearch} />
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

export default ExecutionsPage;
