import * as Vocabulary from "../../constants/Vocabulary.js";

const postRequestOptions = {
  method: "POST",
  headers: {
    Accept: "application/json, text/plain, */*",
    "Content-Type": "application/json",
  },
};

const Rest = {
  getScripts: function () {
    return fetch("/rest/scripts")
      .then((res) => res.json())
      .catch((error) => {
        return error;
      });
  },

  getExecutions: function () {
    return fetch("/rest/execution/history").then((res) => res.json());
  },

  getScript: function (script, transformation) {
    postRequestOptions["body"] = JSON.stringify({
      "@type": Vocabulary.SCRIPT_DTO,
      [Vocabulary.SCRIPT_PATH]: script,
      [Vocabulary.TRANSFORMATION_ID]: transformation,
    });
    return fetch("/rest/views/new", postRequestOptions)
      .then((res) => res.json())
      .then((result) => {
        return result;
      });
  },

  deleteScript: function (script) {
    postRequestOptions["body"] = JSON.stringify({
      "@type": Vocabulary.SCRIPT_DTO,
      [Vocabulary.ABSOLUTE_PATH]: script,
    });
    return fetch("/rest/scripts/delete", postRequestOptions).then((result) => {
      return result;
    });
  },

  getScriptOntologies: function (script) {
    postRequestOptions["body"] = JSON.stringify({
      "@type": Vocabulary.SCRIPT_DTO,
      [Vocabulary.ABSOLUTE_PATH]: script,
    });
    return fetch("/rest/scripts/ontologies", postRequestOptions)
      .then((res) => res.json())
      .then((result) => {
        return result;
      });
  },

  removeScriptOwnOntology: function (script, ontologyURI) {
    postRequestOptions["body"] = JSON.stringify({
      "@type": Vocabulary.SCRIPT_ONTOLOGY_CREATE_DTO,
      [Vocabulary.SCRIPT_PATH]: script,
      [Vocabulary.ONTOLOGY_URI]: ontologyURI,
    });
    return fetch("/rest/scripts/ontology/remove", postRequestOptions).then((result) => {
      return result;
    });
  },

  addScriptOwnOntology: function (script, ontologyURI) {
    postRequestOptions["body"] = JSON.stringify({
      "@type": Vocabulary.SCRIPT_ONTOLOGY_CREATE_DTO,
      [Vocabulary.SCRIPT_PATH]: script,
      [Vocabulary.ONTOLOGY_URI]: ontologyURI,
    });
    return fetch("/rest/scripts/ontology/add", postRequestOptions).then((result) => {
      return result;
    });
  },

  getScriptOwnOntology: function (script) {
    postRequestOptions["body"] = JSON.stringify({
      "@type": Vocabulary.SCRIPT_DTO,
      [Vocabulary.ABSOLUTE_PATH]: script,
    });
    return fetch("/rest/scripts/own-ontology", postRequestOptions)
      .then((res) => res.json())
      .then((result) => {
        return result;
      });
  },

  getScriptForm: function (moduleTypeUri, moduleUri, scriptPath) {
    postRequestOptions["body"] = JSON.stringify({
      "@type": Vocabulary.QUESTION_DTO,
      [Vocabulary.MODULE_TYPE_URI]: moduleTypeUri,
      [Vocabulary.MODULE_URI]: moduleUri,
      [Vocabulary.SCRIPT_PATH]: scriptPath,
    });
    return fetch("/rest/scripts/forms", postRequestOptions)
      .then((res) => res.json())
      .then((result) => {
        return result;
      });
  },

  getFunctionForm: function (scriptPath, functionUri) {
    postRequestOptions["body"] = JSON.stringify({
      "@type": Vocabulary.EXECUTION_FUNCTION_DTO,
      [Vocabulary.SCRIPT_PATH]: scriptPath,
      [Vocabulary.FUNCTION_URI]: functionUri,
    });
    return fetch("/rest/function/form", postRequestOptions)
      .then((res) => res.json())
      .then((result) => {
        return result;
      });
  },

  createScript: function (ontologyURI, scriptName, scriptPath) {
    postRequestOptions["body"] = JSON.stringify({
      "@type": Vocabulary.SCRIPT_CREATE_DTO,
      [Vocabulary.ONTOLOGY_URI]: ontologyURI,
      [Vocabulary.SCRIPT_NAME]: scriptName,
      [Vocabulary.SCRIPT_PATH]: scriptPath,
    });
    return fetch("/rest/scripts/create", postRequestOptions).then((result) => {
      return result;
    });
  },

  getLogForm: function (logPath) {
    postRequestOptions["body"] = JSON.stringify({
      "@type": Vocabulary.MODULE_LOG,
      [Vocabulary.ABSOLUTE_PATH]: logPath,
    });
    return fetch("/rest/scripts/load-log", postRequestOptions)
      .then((res) => res.json())
      .then((result) => {
        return result;
      });
  },

  updateScriptForm: function (moduleTypeUri, rootQuestion, scriptPath) {
    postRequestOptions["body"] = JSON.stringify({
      "@type": Vocabulary.QUESTION_DTO,
      [Vocabulary.MODULE_TYPE_URI]: moduleTypeUri,
      [Vocabulary.ROOT_QUESTION]: rootQuestion,
      [Vocabulary.SCRIPT_PATH]: scriptPath,
    });
    console.log("update script json: " + postRequestOptions);
    return fetch("/rest/scripts/forms/answers", postRequestOptions);
  },

  deleteScriptNode: function (filepath, nodeId) {
    postRequestOptions["body"] = JSON.stringify({
      "@type": Vocabulary.MODULE_DTO,
      [Vocabulary.ABSOLUTE_PATH]: filepath,
      [Vocabulary.MODULE_URI]: nodeId,
    });
    return fetch("/rest/scripts/modules/delete", postRequestOptions);
  },

  deleteScriptEdge: function (filepath, fromNodeId, toNodeId) {
    postRequestOptions["body"] = JSON.stringify({
      "@type": Vocabulary.DEPENDENCY_DTO,
      [Vocabulary.ABSOLUTE_PATH]: filepath,
      [Vocabulary.MODULE_URI]: fromNodeId,
      [Vocabulary.TARGET_MODULE_URI]: toNodeId,
    });
    return fetch("/rest/scripts/modules/dependencies/delete", postRequestOptions);
  },

  moveModule: function (fromScript, toScript, moduleUri, rename) {
    postRequestOptions["body"] = JSON.stringify({
      "@type": Vocabulary.MOVE_MODULE_DTO,
      [Vocabulary.MODULE_FROM_PATH]: fromScript,
      [Vocabulary.MODULE_TO_PATH]: toScript,
      [Vocabulary.MODULE_URI]: moduleUri,
      [Vocabulary.RENAME_MODULE]: rename,
    });
    return fetch("/rest/scripts/modules/move", postRequestOptions).then((result) => {
      return result;
    });
  },

  getModulesTypes: function (filepath) {
    postRequestOptions["body"] = JSON.stringify({
      "@type": Vocabulary.SCRIPT_DTO,
      [Vocabulary.ABSOLUTE_PATH]: filepath,
    });
    return fetch("/rest/scripts/moduleTypes", postRequestOptions)
      .then((res) => res.json())
      .then((result) => {
        return result;
      });
  },

  getModulesFunctions: function (filepath) {
    postRequestOptions["body"] = JSON.stringify({
      "@type": Vocabulary.SCRIPT_DTO,
      [Vocabulary.ABSOLUTE_PATH]: filepath,
    });
    return fetch("/rest/function/script", postRequestOptions)
      .then((res) => res.json())
      .then((result) => {
        return result;
      });
  },

  executeFunction: function (functionUri, params) {
    postRequestOptions["body"] = JSON.stringify({
      "@type": Vocabulary.EXECUTION_FUNCTION_DTO,
      [Vocabulary.FUNCTION_URI]: functionUri,
      [Vocabulary.PARAMETER]: params,
    });
    return fetch("/rest/function/execute", postRequestOptions);
  },

  executeModule: function (scriptPath, moduleURI, moduleInput, params) {
    postRequestOptions["body"] = JSON.stringify({
      "@type": Vocabulary.EXECUTION_MODULE_DTO,
      [Vocabulary.SCRIPT_PATH]: scriptPath,
      [Vocabulary.MODULE_URI]: moduleURI,
      [Vocabulary.INPUT_PARAMETER]: moduleInput,
      [Vocabulary.PARAMETER]: params,
    });
    return fetch("/rest/function/module/execute", postRequestOptions)
      .then((res) => res.text())
      .then((result) => {
        return result;
      });
  },

  addModuleDependency: function (scriptPath, moduleUri, targetModuleUri) {
    postRequestOptions["body"] = JSON.stringify({
      "@type": Vocabulary.DEPENDENCY_DTO,
      [Vocabulary.ABSOLUTE_PATH]: scriptPath,
      [Vocabulary.MODULE_URI]: moduleUri,
      [Vocabulary.TARGET_MODULE_URI]: targetModuleUri,
    });
    return fetch("/rest/scripts/modules/dependency", postRequestOptions);
  },

  validateScript: function (filepath) {
    postRequestOptions["body"] = JSON.stringify({
      "@type": Vocabulary.SCRIPT_DTO,
      [Vocabulary.ABSOLUTE_PATH]: filepath,
    });
    return fetch("/rest/scripts/validate", postRequestOptions)
      .then((res) => res.json())
      .then((result) => {
        return result;
      });
  },

  getScriptModuleExecution: function (transformationId) {
    postRequestOptions["body"] = JSON.stringify({
      "@type": Vocabulary.SCRIPT_DTO,
      [Vocabulary.TRANSFORMATION_ID]: transformationId,
    });
    return fetch("/rest/execution/history-modules", postRequestOptions)
      .then((res) => res.json())
      .then((result) => {
        return result;
      });
  },
};

export default Rest;
