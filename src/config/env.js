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
export const API_URL = getEnv("S_PIPES_API_EDITOR_URL", "http://localhost:1235/rest");
