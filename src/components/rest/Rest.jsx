//TODO - refactor to separate
export const SCRIPT_DTO = "http://onto.fel.cvut.cz/ontologies/s-pipes/script-dto";
export const QUESTION_DTO = "http://onto.fel.cvut.cz/ontologies/s-pipes/question-dto";
export const ROOT_QUESTION = "http://onto.fel.cvut.cz/ontologies/s-pipes/has-root-question";
export const SCRIPT_PATH = "http://onto.fel.cvut.cz/ontologies/s-pipes/has-script-path";
export const MODULE_DTO = "http://onto.fel.cvut.cz/ontologies/s-pipes/module-dto";
export const DEPENDENCY_DTO = "http://onto.fel.cvut.cz/ontologies/s-pipes/dependency-dto";
export const MOVE_MODULE_DTO = "http://onto.fel.cvut.cz/ontologies/s-pipes/move-module-dto";
export const ABSOLUTE_PATH = "http://onto.fel.cvut.cz/ontologies/s-pipes/has-absolute-path";
export const MODULE_URI = "http://onto.fel.cvut.cz/ontologies/s-pipes/has-module-uri";
export const RULE_COMMENT = "http://onto.fel.cvut.cz/ontologies/s-pipes/rule-comment";
export const ERROR_MESSAGE = "http://onto.fel.cvut.cz/ontologies/s-pipes/error-message";
export const MODULE_LOG = "http://onto.fel.cvut.cz/ontologies/s-pipes/module-log-dto";
export const MODULE_TYPE_URI = "http://onto.fel.cvut.cz/ontologies/s-pipes/has-module-type-uri";
export const TARGET_MODULE_URI = "http://onto.fel.cvut.cz/ontologies/s-pipes/has-target-module-uri";
export const TRANSFORMATION_ID = "http://onto.fel.cvut.cz/ontologies/s-pipes/has-transformation-id";
export const DISPLAY_NAME = "http://onto.fel.cvut.cz/ontologies/s-pipes/has-display-name";
export const START_DATE_UNIX = "http://onto.fel.cvut.cz/ontologies/s-pipes/has-pipeline-execution-start-date-unix";
export const FINISH_DATE_UNIX = "http://onto.fel.cvut.cz/ontologies/s-pipes/has-pipeline-execution-finish-date-unix";
export const EXECUTION_DURATION = "http://onto.fel.cvut.cz/ontologies/s-pipes/has-pipeline-execution-duration";
export const TRANSFORMATION = "http://onto.fel.cvut.cz/ontologies/dataset-descriptor/transformation";
export const FUNCTION = "http://onto.fel.cvut.cz/ontologies/s-pipes/has-function-uri";
export const FUNCTION_NAME = "http://onto.fel.cvut.cz/ontologies/s-pipes/has-function-local-name";
export const ONTOLOGY_URI = "http://onto.fel.cvut.cz/ontologies/s-pipes/has-ontology-uri";
export const SCRIPT_NAME = "http://onto.fel.cvut.cz/ontologies/s-pipes/has-name";
export const SCRIPT_CREATE_DTO = "http://onto.fel.cvut.cz/ontologies/s-pipes/script-create-dto";
export const SCRIPT_ONTOLOGY_CREATE_DTO = "http://onto.fel.cvut.cz/ontologies/s-pipes/script-ontology-create-dto";
export const MODULE_FROM_PATH = "http://onto.fel.cvut.cz/ontologies/s-pipes/has-module-from-path";
export const MODULE_TO_PATH = "http://onto.fel.cvut.cz/ontologies/s-pipes/has-module-to-path";
export const RENAME_MODULE = "http://onto.fel.cvut.cz/ontologies/s-pipes/rename-module";
export const EXECUTION_INFO = "http://onto.fel.cvut.cz/ontologies/s-pipes/module-execution-info";
export const EXECUTION_VARIABLE = "http://onto.fel.cvut.cz/ontologies/s-pipes/execution-variable-dto";
export const MODULE_VARIABLES = "http://onto.fel.cvut.cz/ontologies/s-pipes/has-module-variables";
export const MODULE_EXECUTION_DURATION = "http://onto.fel.cvut.cz/ontologies/s-pipes/has-module-execution-duration";
export const MODULE_EXECUTION_START_DATE =
  "http://onto.fel.cvut.cz/ontologies/s-pipes/has-module-execution-start-date-unix";
export const MODULE_EXECUTION_FINISH_DATE =
  "http://onto.fel.cvut.cz/ontologies/s-pipes/has-module-execution-finish-date-unix";
export const MODULE_INPUT_PATH = "http://onto.fel.cvut.cz/ontologies/s-pipes/has-module-input-path";
export const MODULE_OUTPUT_PATH = "http://onto.fel.cvut.cz/ontologies/s-pipes/has-module-output-path";
export const MODULE_VARIABLE_NAME = "http://onto.fel.cvut.cz/ontologies/s-pipes-view/has-variable-name";
export const MODULE_VARIABLE_VALUE = "http://onto.fel.cvut.cz/ontologies/s-pipes-view/has-variable-value";

const postRequestOptions = {
  method: "POST",
  headers: {
    Accept: "application/json, text/plain, */*",
    "Content-Type": "application/json",
  },
};

//TODO consider React api
export const Rest = {
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
      "@type": SCRIPT_DTO,
      [SCRIPT_PATH]: script,
      [TRANSFORMATION_ID]: transformation,
    });
    return fetch("/rest/views/new", postRequestOptions)
      .then((res) => res.json())
      .then((result) => {
        return result;
      });
  },

  deleteScript: function (script) {
    postRequestOptions["body"] = JSON.stringify({
      "@type": SCRIPT_DTO,
      [ABSOLUTE_PATH]: script,
    });
    return fetch("/rest/scripts/delete", postRequestOptions).then((result) => {
      return result;
    });
  },

  getScriptOntologies: function (script) {
    postRequestOptions["body"] = JSON.stringify({
      "@type": SCRIPT_DTO,
      [ABSOLUTE_PATH]: script,
    });
    return fetch("/rest/scripts/ontologies", postRequestOptions)
      .then((res) => res.json())
      .then((result) => {
        return result;
      });
  },

  removeScriptOwnOntology: function (script, ontologyURI) {
    postRequestOptions["body"] = JSON.stringify({
      "@type": SCRIPT_ONTOLOGY_CREATE_DTO,
      [SCRIPT_PATH]: script,
      [ONTOLOGY_URI]: ontologyURI,
    });
    return fetch("/rest/scripts/ontology/remove", postRequestOptions).then((result) => {
      return result;
    });
  },

  addScriptOwnOntology: function (script, ontologyURI) {
    postRequestOptions["body"] = JSON.stringify({
      "@type": SCRIPT_ONTOLOGY_CREATE_DTO,
      [SCRIPT_PATH]: script,
      [ONTOLOGY_URI]: ontologyURI,
    });
    return fetch("/rest/scripts/ontology/add", postRequestOptions).then((result) => {
      return result;
    });
  },

  getScriptOwnOntology: function (script) {
    postRequestOptions["body"] = JSON.stringify({
      "@type": SCRIPT_DTO,
      [ABSOLUTE_PATH]: script,
    });
    return fetch("/rest/scripts/own-ontology", postRequestOptions)
      .then((res) => res.json())
      .then((result) => {
        return result;
      });
  },

  getScriptForm: function (moduleTypeUri, moduleUri, scriptPath) {
    postRequestOptions["body"] = JSON.stringify({
      "@type": QUESTION_DTO,
      [MODULE_TYPE_URI]: moduleTypeUri,
      [MODULE_URI]: moduleUri,
      [SCRIPT_PATH]: scriptPath,
    });
    return fetch("/rest/scripts/forms", postRequestOptions)
      .then((res) => res.json())
      .then((result) => {
        return result;
      });
  },

  getFunctionForm: function (scriptPath, functionUri) {
    postRequestOptions["body"] = JSON.stringify({
      "@type": "http://onto.fel.cvut.cz/ontologies/s-pipes/execution-function-dto",
      [SCRIPT_PATH]: scriptPath,
      [FUNCTION]: functionUri,
    });
    return fetch("/rest/function/form", postRequestOptions)
      .then((res) => res.json())
      .then((result) => {
        return result;
      });
  },

  createScript: function (ontologyURI, scriptName, scriptPath) {
    postRequestOptions["body"] = JSON.stringify({
      "@type": SCRIPT_CREATE_DTO,
      [ONTOLOGY_URI]: ontologyURI,
      [SCRIPT_NAME]: scriptName,
      [SCRIPT_PATH]: scriptPath,
    });
    return fetch("/rest/scripts/create", postRequestOptions).then((result) => {
      return result;
    });
  },

  getLogForm: function (logPath) {
    postRequestOptions["body"] = JSON.stringify({
      "@type": MODULE_LOG,
      [ABSOLUTE_PATH]: logPath,
    });
    return fetch("/rest/scripts/load-log", postRequestOptions)
      .then((res) => res.json())
      .then((result) => {
        return result;
      });
  },

  updateScriptForm: function (moduleTypeUri, rootQuestion, scriptPath) {
    postRequestOptions["body"] = JSON.stringify({
      "@type": QUESTION_DTO,
      [MODULE_TYPE_URI]: moduleTypeUri,
      [ROOT_QUESTION]: rootQuestion,
      [SCRIPT_PATH]: scriptPath,
    });
    console.log("update script json: " + postRequestOptions);
    return fetch("/rest/scripts/forms/answers", postRequestOptions);
  },

  deleteScriptNode: function (filepath, nodeId) {
    postRequestOptions["body"] = JSON.stringify({
      "@type": MODULE_DTO,
      [ABSOLUTE_PATH]: filepath,
      [MODULE_URI]: nodeId,
    });
    return fetch("/rest/scripts/modules/delete", postRequestOptions);
  },

  deleteScriptEdge: function (filepath, fromNodeId, toNodeId) {
    postRequestOptions["body"] = JSON.stringify({
      "@type": DEPENDENCY_DTO,
      [ABSOLUTE_PATH]: filepath,
      [MODULE_URI]: fromNodeId,
      [TARGET_MODULE_URI]: toNodeId,
    });
    return fetch("/rest/scripts/modules/dependencies/delete", postRequestOptions);
  },

  moveModule: function (fromScript, toScript, moduleUri, rename) {
    postRequestOptions["body"] = JSON.stringify({
      "@type": MOVE_MODULE_DTO,
      [MODULE_FROM_PATH]: fromScript,
      [MODULE_TO_PATH]: toScript,
      [MODULE_URI]: moduleUri,
      [RENAME_MODULE]: rename,
    });
    return fetch("/rest/scripts/modules/move", postRequestOptions).then((result) => {
      return result;
    });
  },

  getModulesTypes: function (filepath) {
    postRequestOptions["body"] = JSON.stringify({
      "@type": SCRIPT_DTO,
      [ABSOLUTE_PATH]: filepath,
    });
    return fetch("/rest/scripts/moduleTypes", postRequestOptions)
      .then((res) => res.json())
      .then((result) => {
        return result;
      });
  },

  getModulesFunctions: function (filepath) {
    postRequestOptions["body"] = JSON.stringify({
      "@type": SCRIPT_DTO,
      [ABSOLUTE_PATH]: filepath,
    });
    return fetch("/rest/function/script", postRequestOptions)
      .then((res) => res.json())
      .then((result) => {
        return result;
      });
  },

  executeFunction: function (functionUri, params) {
    postRequestOptions["body"] = JSON.stringify({
      "@type": "http://onto.fel.cvut.cz/ontologies/s-pipes/execution-function-dto",
      ["http://onto.fel.cvut.cz/ontologies/s-pipes/has-function-uri"]: functionUri,
      ["http://onto.fel.cvut.cz/ontologies/s-pipes-view/has-parameter"]: params,
    });
    return fetch("/rest/function/execute", postRequestOptions);
  },

  executeModule: function (scriptPath, moduleURI, moduleInput, params) {
    postRequestOptions["body"] = JSON.stringify({
      "@type": "http://onto.fel.cvut.cz/ontologies/s-pipes/execution-module-dto",
      ["http://onto.fel.cvut.cz/ontologies/s-pipes/has-script-path"]: scriptPath,
      ["http://onto.fel.cvut.cz/ontologies/s-pipes/has-module-uri"]: moduleURI,
      ["http://onto.fel.cvut.cz/ontologies/s-pipes-view/has-input-parameter"]: moduleInput,
      ["http://onto.fel.cvut.cz/ontologies/s-pipes-view/has-parameter"]: params,
    });
    return fetch("/rest/function/module/execute", postRequestOptions)
      .then((res) => res.text())
      .then((result) => {
        return result;
      });
  },

  addModuleDependency: function (scriptPath, moduleUri, targetModuleUri) {
    postRequestOptions["body"] = JSON.stringify({
      "@type": DEPENDENCY_DTO,
      [ABSOLUTE_PATH]: scriptPath,
      [MODULE_URI]: moduleUri,
      [TARGET_MODULE_URI]: targetModuleUri,
    });
    return fetch("/rest/scripts/modules/dependency", postRequestOptions);
  },

  validateScript: function (filepath) {
    postRequestOptions["body"] = JSON.stringify({
      "@type": SCRIPT_DTO,
      [ABSOLUTE_PATH]: filepath,
    });
    return fetch("/rest/scripts/validate", postRequestOptions)
      .then((res) => res.json())
      .then((result) => {
        return result;
      });
  },

  getScriptModuleExecution: function (transformationId) {
    postRequestOptions["body"] = JSON.stringify({
      "@type": SCRIPT_DTO,
      [TRANSFORMATION_ID]: transformationId,
    });
    return fetch("/rest/execution/history-modules", postRequestOptions)
      .then((res) => res.json())
      .then((result) => {
        return result;
      });
  },
};
