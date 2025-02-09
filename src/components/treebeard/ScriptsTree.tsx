import React, { useEffect, useState, Fragment } from "react";
import { includes } from "lodash";

import styles from "./styles";
import Header from "./Header.js";
import { Treebeard, decorators } from "react-treebeard";
import Rest from "@rest/Rest.js";
import ScriptActionsModuleModal from "../modal/ScriptActionsModuleModal";
import Loading from "../Loading.js";
import ErrorModal from "../modal/ErrorModal";

const ScriptsTree = () => {
  const [data, setData] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [scriptPath, setScriptPath] = useState(null);
  const [displayName, setDisplayName] = useState(null);
  const [type, setType] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    loadScripts();

    const handleContextMenu = (e) => {
      const dataId = e.target.getAttribute("data-id");
      if (dataId !== undefined) {
        e.preventDefault();
        if (dataId !== "") {
          const childrenId = e.target.getAttribute("data-children");
          const displayName = e.target.innerText;
          setScriptPath(dataId);
          setDisplayName(displayName);
          setType(childrenId);
        }
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);

  const loadScripts = async () => {
    try {
      const response = await Rest.getScripts();
      if (response.status === 404 || !response.children) {
        console.error("ERROR when loading scripts! Check configuration.");
        setErrorMessage("ERROR when loading scripts! Check configuration.");
      } else {
        response.toggled = true;
        if (response.children[0]) {
          response.children[0].toggled = true;
        }
        setData(response);
        setIsLoaded(true);
      }
    } catch (error) {
      console.error("Failed to load scripts", error);
      setErrorMessage("An error occurred while loading scripts.");
    }
  };

  const handleErrorModal = () => {
    setErrorMessage(null);
  };

  const onToggle = (node, toggled) => {
    if (cursor) {
      cursor.active = false;
    }

    node.active = true;
    if (node.children) {
      node.toggled = toggled;
    } else {
      window.location.href = `/script?file=${node.id}`;
    }

    setCursor(node);
    setData({ ...data });
    setScriptPath(null);
  };

  const onSelect = (node) => {
    if (cursor) {
      cursor.active = false;
      if (!includes(cursor.children, node)) {
        cursor.toggled = false;
        cursor.selected = false;
      }
    }

    node.selected = true;
    setCursor(node);
    setData({ ...data });
    setScriptPath(null);
  };

  const handleRefresh = () => {
    setDisplayName(null);
    loadScripts();
  };

  if (!isLoaded) {
    return <Loading size={"large"} style={{ margin: "auto", position: "absolute", inset: "0px", zIndex: 9000 }} />;
  }

  return (
    <Fragment>
      <h3>Scripts</h3>
      <p>Right click on directory/file to add/remove file</p>
      <div style={styles.component}>
        <Treebeard
          data={data}
          onToggle={onToggle}
          onSelect={onSelect}
          decorators={{ ...decorators, Header }}
          style={styles.treeStyle}
        />
      </div>
      <ScriptActionsModuleModal
        scriptPath={scriptPath}
        displayName={displayName}
        type={type}
        handleRefresh={handleRefresh}
      />
      <ErrorModal errorMessage={errorMessage} handleErrorModal={handleErrorModal} />
    </Fragment>
  );
};

export default ScriptsTree;
