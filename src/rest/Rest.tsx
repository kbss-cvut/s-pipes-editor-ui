import URLs from "./apiUrls.ts";
import * as Vocabulary from "@constants/vocabulary";
import { getFetcher, postFetcher } from "./fetchers.js";

const normaliseData = (response) => {
  if (response["@list"]) {
    return response["@list"];
  }
  return response;
};

export const Rest = {
  getScripts: function () {
    return getFetcher(URLs.SCRIPTS);
  },

  getExecutions: function () {
    return normaliseData(getFetcher(URLs.EXECUTION_HISTORY)).then((response) => {
      return normaliseData(response);
    });
  },

  getScript: function (script, transformation) {
    const data = {
      "@type": Vocabulary.SCRIPT_DTO,
      [Vocabulary.SCRIPT_PATH]: script,
      [Vocabulary.TRANSFORMATION_ID]: transformation,
    };
    return postFetcher(URLs.VIEWS_NEW, data);
  },

  deleteScript: function (script) {
    const data = {
      "@type": Vocabulary.SCRIPT_DTO,
      [Vocabulary.ABSOLUTE_PATH]: script,
    };
    return postFetcher(URLs.SCRIPTS_DELETE, data);
  },

  getScriptOntologies: function (script) {
    const data = {
      "@type": Vocabulary.SCRIPT_DTO,
      [Vocabulary.ABSOLUTE_PATH]: script,
    };
    return normaliseData(postFetcher(URLs.SCRIPTS_ONTOLOGIES, data)).then((response) => {
      return normaliseData(response);
    });
  },

  removeScriptOwnOntology: function (script, ontologyURI) {
    const data = {
      "@type": Vocabulary.SCRIPT_ONTOLOGY_CREATE_DTO,
      [Vocabulary.SCRIPT_PATH]: script,
      [Vocabulary.ONTOLOGY_URI]: ontologyURI,
    };
    return postFetcher(URLs.SCRIPTS_OWN_ONTOLOGY, data);
  },

  addScriptOwnOntology: function (script, ontologyURI) {
    const data = {
      "@type": Vocabulary.SCRIPT_ONTOLOGY_CREATE_DTO,
      [Vocabulary.SCRIPT_PATH]: script,
      [Vocabulary.ONTOLOGY_URI]: ontologyURI,
    };
    return normaliseData(postFetcher(URLs.SCRIPTS_OWN_ONTOLOGY, data)).then((response) => {
      return normaliseData(response);
    });
  },

  getScriptOwnOntology: function (script) {
    const data = {
      "@type": Vocabulary.SCRIPT_DTO,
      [Vocabulary.ABSOLUTE_PATH]: script,
    };
    return normaliseData(postFetcher(URLs.SCRIPTS_OWN_ONTOLOGY, data)).then((response) => {
      return normaliseData(response);
    });
  },

  getScriptForm: function (moduleTypeUri, moduleUri, scriptPath, executionScriptPath) {
    const data = {
      "@type": Vocabulary.QUESTION_DTO,
      [Vocabulary.MODULE_TYPE_URI]: moduleTypeUri,
      [Vocabulary.MODULE_URI]: moduleUri,
      [Vocabulary.SCRIPT_PATH]: scriptPath,
      [Vocabulary.EXECUTION_SCRIPT_PATH]: executionScriptPath || scriptPath,
    };
    return postFetcher(URLs.SCRIPTS_FORMS, data);
  },

  getFunctionForm: function (scriptPath, functionUri) {
    const data = {
      "@type": Vocabulary.EXECUTION_FUNCTION_DTO,
      [Vocabulary.SCRIPT_PATH]: scriptPath,
      [Vocabulary.FUNCTION_URI]: functionUri,
    };
    return postFetcher(URLs.FUNCTION_FORM, data);
  },

  createScript: function (ontologyURI, filename, scriptPath, returnModuleName, functionName, functionArguments) {
    const mappedArguments = functionArguments.map((arg) => ({
      "@type": [Vocabulary.SCRIPT_FUNCTION_ARGUMENT],
      [Vocabulary.SCRIPT_FUNCTION_ARGUMENT_NAME]: arg.name,
      [Vocabulary.SCRIPT_FUNCTION_ARGUMENT_LABEL]: arg.label,
      [Vocabulary.SCRIPT_FUNCTION_ARGUMENT_COMMENT]: arg.comment,
    }));
    const data = {
      "@type": Vocabulary.SCRIPT_CREATE_DTO,
      [Vocabulary.ONTOLOGY_URI]: ontologyURI,
      [Vocabulary.SCRIPT_NAME]: filename,
      [Vocabulary.SCRIPT_PATH]: scriptPath,
      [Vocabulary.SCRIPT_RETURN_MODULE_NAME]: returnModuleName,
      [Vocabulary.SCRIPT_FUNCTION_NAME]: functionName,
      [Vocabulary.SCRIPT_FUNCTION_ARGUMENTS]: mappedArguments,
    };
    return postFetcher(URLs.SCRIPTS_CREATE, data);
  },

  getLogForm: function (logPath) {
    const data = {
      "@type": Vocabulary.MODULE_LOG,
      [Vocabulary.ABSOLUTE_PATH]: logPath,
    };
    return postFetcher(URLs.LOAD_LOG, data);
  },

  updateScriptForm: function (moduleTypeUri, rootQuestion, scriptPath) {
    const data = {
      "@type": Vocabulary.QUESTION_DTO,
      [Vocabulary.MODULE_TYPE_URI]: moduleTypeUri,
      [Vocabulary.ROOT_QUESTION]: rootQuestion,
      [Vocabulary.SCRIPT_PATH]: scriptPath,
    };
    return postFetcher(URLs.SCRIPTS_FORMS_ANSWERS, data);
  },

  deleteScriptNode: function (filepath, nodeId) {
    const data = {
      "@type": Vocabulary.MODULE_DTO,
      [Vocabulary.ABSOLUTE_PATH]: filepath,
      [Vocabulary.MODULE_URI]: nodeId,
    };
    return postFetcher(URLs.SCRIPTS_MODULES_DELETE, data);
  },

  deleteScriptEdge: function (filepath, fromNodeId, toNodeId) {
    const data = {
      "@type": Vocabulary.DEPENDENCY_DTO,
      [Vocabulary.ABSOLUTE_PATH]: filepath,
      [Vocabulary.MODULE_URI]: fromNodeId,
      [Vocabulary.TARGET_MODULE_URI]: toNodeId,
    };
    return postFetcher(URLs.SCRIPTS_DEPENDENCIES_DELETE, data);
  },

  moveModule: function (fromScript, toScript, moduleUri, rename) {
    const data = {
      "@type": Vocabulary.MOVE_MODULE_DTO,
      [Vocabulary.MODULE_FROM_PATH]: fromScript,
      [Vocabulary.MODULE_TO_PATH]: toScript,
      [Vocabulary.MODULE_URI]: moduleUri,
      [Vocabulary.RENAME_MODULE]: rename,
    };
    return postFetcher(URLs.SCRIPTS_MODULES_MOVE, data);
  },

  getModulesTypes: function (filepath) {
    const data = {
      "@type": Vocabulary.SCRIPT_DTO,
      [Vocabulary.ABSOLUTE_PATH]: filepath,
    };
    return normaliseData(postFetcher(URLs.MODULE_TYPES, data)).then((response) => {
      return normaliseData(response);
    });
  },

  getModulesFunctions: function (filepath) {
    const data = {
      "@type": Vocabulary.SCRIPT_DTO,
      [Vocabulary.ABSOLUTE_PATH]: filepath,
    };
    return postFetcher(URLs.FUNCTION_SCRIPT, data).then((response) => {
      return normaliseData(response);
    });
  },

  executeFunction: function (functionUri, params) {
    const data = {
      "@type": Vocabulary.EXECUTION_FUNCTION_DTO,
      [Vocabulary.FUNCTION_URI]: functionUri,
      [Vocabulary.PARAMETER]: params,
    };
    return postFetcher(URLs.FUNCTION_EXECUTE, data);
  },

  executeModule: function (scriptPath, moduleURI, moduleInput, params) {
    const data = {
      "@type": Vocabulary.EXECUTION_MODULE_DTO,
      [Vocabulary.SCRIPT_PATH]: scriptPath,
      [Vocabulary.MODULE_URI]: moduleURI,
      [Vocabulary.INPUT_PARAMETER]: moduleInput,
      [Vocabulary.PARAMETER]: params,
    };
    return postFetcher(URLs.FUNCTION_MODULE_EXECUTE, data);
  },

  addModuleDependency: function (scriptPath, moduleUri, targetModuleUri) {
    const data = {
      "@type": Vocabulary.DEPENDENCY_DTO,
      [Vocabulary.ABSOLUTE_PATH]: scriptPath,
      [Vocabulary.MODULE_URI]: moduleUri,
      [Vocabulary.TARGET_MODULE_URI]: targetModuleUri,
    };
    return postFetcher(URLs.SCRIPTS_MODULE_DEPENDENCY, data);
  },

  validateScript: function (filepath) {
    const data = {
      "@type": Vocabulary.SCRIPT_DTO,
      [Vocabulary.ABSOLUTE_PATH]: filepath,
    };
    return postFetcher(URLs.SCRIPTS_VALIDATE, data);
  },

  getScriptModuleExecution: function (transformationId) {
    const data = {
      "@type": Vocabulary.SCRIPT_DTO,
      [Vocabulary.TRANSFORMATION_ID]: transformationId,
    };
    return postFetcher(URLs.EXECUTION_HISTORY_MODULES, data);
  },

  getDebugExecutions: function () {
    return getFetcher(URLs.DEBUG_EXECUTIONS);
  },

  getExecution: function (executionId) {
    return getFetcher(`${URLs.DEBUG_EXECUTIONS}/${executionId}`);
  },

  getExecutionName: function (executionId) {
    return normaliseData(getFetcher(`${URLs.EXECUTION}/${executionId}`)).then((response) => {
      return normaliseData(response);
    });
  },

  getExecutionModules: function (executionId) {
    return getFetcher(`${URLs.DEBUG_EXECUTIONS}/${executionId}/modules`);
  },

  compareExecutions: function (executionId, executionIdToCompare) {
    return getFetcher(`${URLs.DEBUG_EXECUTIONS}/${executionId}/compare/${executionIdToCompare}`);
  },

  findVariableOrigin: function (executionId, targetVariable) {
    return getFetcher(`${URLs.DEBUG_VARIABLE_ORIGIN}/${executionId}?variable=${targetVariable}`);
  },

  findTripleOrigin: function (executionId, triplePattern) {
    return getFetcher(`${URLs.DEBUG_TRIPLE_ORIGIN}/${executionId}?graphPattern=${triplePattern}`);
  },

  findTripleElimination: function (executionId, triplePattern) {
    return getFetcher(`${URLs.DEBUG_TRIPLE_ELIMINATION}/${executionId}?graphPattern=${triplePattern}`);
  },
};

export default Rest;
