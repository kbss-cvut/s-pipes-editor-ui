import React from 'react';

//TODO - refactor to separate
export const SCRIPT_DTO = "http://onto.fel.cvut.cz/ontologies/s-pipes/script-dto";
export const QUESTION_DTO = "http://onto.fel.cvut.cz/ontologies/s-pipes/question-dto";
export const ROOT_QUESTION = "http://onto.fel.cvut.cz/ontologies/s-pipes/has-root-question";
export const SCRIPT_PATH = "http://onto.fel.cvut.cz/ontologies/s-pipes/has-script-path";
export const MODULE_DTO = "http://onto.fel.cvut.cz/ontologies/s-pipes/module-dto";
export const DEPENDENCY_DTO = "http://onto.fel.cvut.cz/ontologies/s-pipes/dependency-dto";
export const ABSOLUTE_PATH = "http://onto.fel.cvut.cz/ontologies/s-pipes/has-absolute-path";
export const MODULE_URI = "http://onto.fel.cvut.cz/ontologies/s-pipes/has-module-uri";
export const MODULE_LOG = "http://onto.fel.cvut.cz/ontologies/s-pipes/module-log-dto";
export const MODULE_TYPE_URI = "http://onto.fel.cvut.cz/ontologies/s-pipes/has-module-type-uri";
export const TARGET_MODULE_URI = "http://onto.fel.cvut.cz/ontologies/s-pipes/has-target-module-uri";
export const TRANSFORMATION_ID = "http://onto.fel.cvut.cz/ontologies/s-pipes/has-transformation-id";
export const DISPLAY_NAME = "http://onto.fel.cvut.cz/ontologies/s-pipes/has-display-name";
export const START_DATE_UNIX = "http://onto.fel.cvut.cz/ontologies/s-pipes/has-pipeline-execution-start-date-unix";
export const FINISH_DATE_UNIX = "http://onto.fel.cvut.cz/ontologies/s-pipes/has-pipeline-execution-finish-date-unix";
export const EXECUTION_DURATION = "http://onto.fel.cvut.cz/ontologies/s-pipes/has-pipeline-execution-duration";
export const TRANSFORMATION = "http://onto.fel.cvut.cz/ontologies/dataset-descriptor/transformation"
export const FUNCTION = "http://onto.fel.cvut.cz/ontologies/s-pipes/has-function-uri"
export const FUNCTION_NAME = "http://onto.fel.cvut.cz/ontologies/s-pipes/has-function-local-name"

const postRequestOptions = {
    method: 'POST',
    headers: {
        'Accept': 'application/ld+json, application/json',
        'Content-Type': 'application/json'
    }
};

//TODO consider React api
export const Rest = {

    getScripts: function () {
        return fetch("/rest/scripts")
            .then(res => res.json())
    },

    getExecutions: function () {
        return fetch("/rest/execution/history")
            .then(res => res.json())
    },

    getScript: function (script, transformation) {
        postRequestOptions['body'] = JSON.stringify(
            {
                "@type" : SCRIPT_DTO,
                [SCRIPT_PATH] : script,
                [TRANSFORMATION_ID] : transformation
            }
        )
        return fetch("/rest/views/new", postRequestOptions)
            .then(res => res.json())
            .then(
                (result) => {
                    return result;
                }
            );
    },

    getScriptForm: function (moduleTypeUri, moduleUri, scriptPath) {
        postRequestOptions['body'] = JSON.stringify(
            {
                "@type" : QUESTION_DTO,
                [MODULE_TYPE_URI] : moduleTypeUri,
                [MODULE_URI] : moduleUri,
                [SCRIPT_PATH] : scriptPath
            }
        )
        return fetch("/rest/scripts/forms", postRequestOptions)
            .then(res => res.json())
            .then(
                (result) => {
                    return result;
                }
            );
    },

    getLogForm: function (logPath) {
        postRequestOptions['body'] = JSON.stringify(
            {
                "@type" : MODULE_LOG,
                [ABSOLUTE_PATH] : logPath
            }
        )
        return fetch("/rest/scripts/load-log", postRequestOptions)
            .then(res => res.json())
            .then(
                (result) => {
                    return result;
                }
            );
    },

    updateScriptForm: function (moduleTypeUri, rootQuestion, scriptPath) {
        postRequestOptions['body'] = JSON.stringify(
            {
                "@type" : QUESTION_DTO,
                [MODULE_TYPE_URI] : moduleTypeUri,
                [ROOT_QUESTION] : rootQuestion,
                [SCRIPT_PATH] : scriptPath
            }
        )
        console.log("update script json: " + postRequestOptions)
        return fetch("/rest/scripts/forms/answers", postRequestOptions)
    },

    deleteScriptNode: function (filepath, nodeId){
        postRequestOptions["body"] =JSON.stringify(
            {
                "@type" : MODULE_DTO,
                [ABSOLUTE_PATH] : filepath,
                [MODULE_URI] : nodeId
            }
        )
        return fetch("/rest/scripts/modules/delete", postRequestOptions)
    },

    deleteScriptEdge: function (filepath, fromNodeId, toNodeId){
        postRequestOptions["body"] =JSON.stringify(
            {
                "@type" : DEPENDENCY_DTO,
                [ABSOLUTE_PATH] : filepath,
                [MODULE_URI] : fromNodeId,
                [TARGET_MODULE_URI] : toNodeId,
            }
        )
        return fetch("/rest/scripts/modules/dependencies/delete", postRequestOptions)
    },

    getModulesTypes: function (filepath) {
        postRequestOptions["body"] =JSON.stringify(
            {
                "@type" : SCRIPT_DTO,
                [ABSOLUTE_PATH] : filepath
            }
        )
        return fetch("/rest/scripts/moduleTypes", postRequestOptions)
            .then(res => res.json())
            .then(
                (result) => {
                    return result;
                }
            );
    },

    getModulesFunctions: function (filepath) {
        postRequestOptions["body"] =JSON.stringify(
            {
                "@type" : SCRIPT_DTO,
                [ABSOLUTE_PATH] : filepath
            }
        )
        return fetch("/rest/function/script", postRequestOptions)
            .then(res => res.json())
            .then(
                (result) => {
                    return result;
                }
            );
    },

    executeFunction: function (functionUri, params) {
        postRequestOptions["body"] =JSON.stringify(
            {
                "@type" : "http://onto.fel.cvut.cz/ontologies/s-pipes/execution-function-dto",
                ["http://onto.fel.cvut.cz/ontologies/s-pipes/has-function-uri"] : functionUri,
                ["http://onto.fel.cvut.cz/ontologies/s-pipes-view/has-parameter"] : params
            }
        )
        return fetch("/rest/function/execute", postRequestOptions);
    },

    addModuleDependency: function (scriptPath, moduleUri, targetModuleUri) {
        postRequestOptions["body"] =JSON.stringify(
            {
                "@type" : DEPENDENCY_DTO,
                [ABSOLUTE_PATH] : scriptPath,
                [MODULE_URI] : moduleUri,
                [TARGET_MODULE_URI] : targetModuleUri,
            }
        )
        return fetch("/rest/scripts/modules/dependency", postRequestOptions);
    },

    validateScript: function (filepath) {
        postRequestOptions["body"] =JSON.stringify(
            {
                "@type" : SCRIPT_DTO,
                [ABSOLUTE_PATH] : filepath
            }
        )
        return fetch("/rest/scripts/validate", postRequestOptions)
            .then(res => res.json())
            .then(
                (result) => {
                    return result;
                }
            );
    },

}