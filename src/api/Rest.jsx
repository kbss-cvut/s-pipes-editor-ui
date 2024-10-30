// Import URL constants
import URLs from "./apiUrls.js"; // Adjust the path as necessary
import * as Vocabulary from "../vocabularies/Vocabulary.js";
import { getFetcher, postFetcher } from "./fetchers";

export const Rest = {
  getScripts: function () {
    return getFetcher(URLs.SCRIPTS).catch((error) => {
      return error;
    });
  },

  getExecutions: function () {
    return getFetcher(URLs.EXECUTION_HISTORY);
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
    return postFetcher(URLs.SCRIPTS_ONTOLOGIES, data);
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
    return postFetcher(URLs.SCRIPTS_OWN_ONTOLOGY, data);
  },

  getScriptOwnOntology: function (script) {
    const data = {
      "@type": Vocabulary.SCRIPT_DTO,
      [Vocabulary.ABSOLUTE_PATH]: script,
    };
    return postFetcher(URLs.SCRIPTS_OWN_ONTOLOGY, data);
  },

  getScriptForm: function (moduleTypeUri, moduleUri, scriptPath) {
    const data = {
      "@type": Vocabulary.QUESTION_DTO,
      [Vocabulary.MODULE_TYPE_URI]: moduleTypeUri,
      [Vocabulary.MODULE_URI]: moduleUri,
      [Vocabulary.SCRIPT_PATH]: scriptPath,
    };
    return postFetcher(URLs.SCRIPTS_FORMS, data);
  },

  getFunctionForm: function (scriptPath, functionUri) {
    const data = {
      "@type": Vocabulary.EXECUTION_FUNCTION_DTO,
      [Vocabulary.SCRIPT_PATH]: scriptPath,
      [Vocabulary.FUNCTION]: functionUri,
    };
    return postFetcher(URLs.FUNCTION_FORM, data);
  },

  createScript: function (ontologyURI, scriptName, scriptPath) {
    const data = {
      "@type": Vocabulary.SCRIPT_CREATE_DTO,
      [Vocabulary.ONTOLOGY_URI]: ontologyURI,
      [Vocabulary.SCRIPT_NAME]: scriptName,
      [Vocabulary.SCRIPT_PATH]: scriptPath,
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
    return postFetcher(URLs.MODULE_TYPES, data);
  },

  getModulesFunctions: function (filepath) {
    const data = {
      "@type": Vocabulary.SCRIPT_DTO,
      [Vocabulary.ABSOLUTE_PATH]: filepath,
    };
    return postFetcher(URLs.FUNCTION_SCRIPT, data);
  },

  executeFunction: function (functionUri, params) {
    const data = {
      "@type": Vocabulary.EXECUTION_FUNCTION_DTO,
      [Vocabulary.FUNCTION]: functionUri,
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
};
