import exp from "constants";

const getEnv = (name, defaultValue) => {
  let ENV;
  if (window.__config__ && Object.keys(window.__config__).length > 0) {
    ENV = {
      ...window.__config__,
    };
  } else ENV = import.meta.env;

  const value = ENV[name] || defaultValue;
  if (value !== undefined) {
    return value;
  }
  throw new Error(`Missing environment variable: ${name}`);
};

export const APP_TITLE = getEnv("S_PIPES_EDITOR_APP_TITLE", "SPipes Editor");
export const API_URL = getEnv("S_PIPES_EDITOR_API_URL", "http://localhost:1235/rest");
export const DEFAULT_SCRIPT_PREFIX = getEnv(
  "S_PIPES_EDITOR_DEFAULT_SCRIPT_PREFIX",
  "http://onto.fel.cvut.cz/ontologies/s-pipes/",
);
export const DB_SERVER_URL = getEnv("S_PIPES_DB_SERVER_URL", "http://localhost:1235/services/db-server/");
