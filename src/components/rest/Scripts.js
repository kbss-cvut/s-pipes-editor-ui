import React from 'react';

const SCRIPT_DTO = "http://onto.fel.cvut.cz/ontologies/s-pipes/script-dto";
const QUESTION_DTO = "http://onto.fel.cvut.cz/ontologies/s-pipes/question-dto";
const ROOT_QUESTION = "http://onto.fel.cvut.cz/ontologies/s-pipes/has-root-question";
const SCRIPT_PATH = "http://onto.fel.cvut.cz/ontologies/s-pipes/has-script-path";
const MODULE_DTO = "http://onto.fel.cvut.cz/ontologies/s-pipes/module-dto";
const DEPENDENCY_DTO = "http://onto.fel.cvut.cz/ontologies/s-pipes/dependency-dto";
const ABSOLUTE_PATH = "http://onto.fel.cvut.cz/ontologies/s-pipes/has-absolute-path";
const MODULE_URI = "http://onto.fel.cvut.cz/ontologies/s-pipes/has-module-uri";
const MODULE_TYPE_URI = "http://onto.fel.cvut.cz/ontologies/s-pipes/has-module-type-uri";
const TARGET_MODULE_URI = "http://onto.fel.cvut.cz/ontologies/s-pipes/has-target-module-uri";

const postRequestOptions = {
    method: 'POST',
    headers: {
        'Accept': 'application/ld+json, application/json',
        'Content-Type': 'application/json'
    }
};

//TODO consider React api
export const Scripts = {

    getScripts: function () {
        return fetch(REST_URL + "/scripts")
            .then(res => res.json())
    },

    getScript: function (script) {
        postRequestOptions['body'] = JSON.stringify(
            {
                "@type" : SCRIPT_DTO,
                [SCRIPT_PATH] : script
            }
        )
        return fetch(REST_URL + "/views/new", postRequestOptions)
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
        return fetch(REST_URL + "/scripts/forms", postRequestOptions)
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
        return fetch(REST_URL + "/scripts/forms/answers", postRequestOptions)
    },

    deleteScriptNode: function (filepath, nodeId){
        postRequestOptions["body"] =JSON.stringify(
            {
                "@type" : MODULE_DTO,
                [ABSOLUTE_PATH] : filepath,
                [MODULE_URI] : nodeId
            }
        )
        return fetch(REST_URL + "/scripts/modules/delete", postRequestOptions)
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
        return fetch(REST_URL + "/scripts/modules/dependencies/delete", postRequestOptions)
    },

    getModulesTypes: function (filepath) {
        postRequestOptions["body"] =JSON.stringify(
            {
                "@type" : SCRIPT_DTO,
                [ABSOLUTE_PATH] : filepath
            }
        )
        return fetch(REST_URL + "/scripts/moduleTypes", postRequestOptions)
            .then(res => res.json())
            .then(
                (result) => {
                    return result;
                }
            );
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
        return fetch(REST_URL + "/scripts/modules/dependency", postRequestOptions);
    },

}