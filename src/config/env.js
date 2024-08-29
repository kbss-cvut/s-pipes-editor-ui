/**
 * Prefix used for Vite environment variables.
 * @constant {string}
 */
const VITE_ENV_PREFIX = "S_PIPES_";

/**
 * Object containing environment variables.
 * - Includes environment variables from `import.meta.env` that start with `VITE_ENV_PREFIX`.
 * - Merges in configuration from `window.__config__`.
 * @type {Object<string, string>}
 */
const ENV = {
  ...Object.keys(import.meta.env).reduce((accumulator, key) => {
    if (key.startsWith(VITE_ENV_PREFIX)) {
      const strippedKey = key.replace(VITE_ENV_PREFIX, "");
      accumulator[strippedKey] = import.meta.env[key];
    }
    return accumulator;
  }, {}),
  ...window.__config__,
};

/**
 * Retrieves the value of an environment variable.
 * - Returns the value if it exists, otherwise returns the provided default value.
 * - Throws an error if the variable is not found and no default value is provided.
 *
 * @param {string} name - The name of the environment variable to retrieve.
 * @param {string} [defaultValue] - Optional default value to return if the environment variable is not found.
 * @returns {string} The value of the environment variable or the default value.
 * @throws {Error} If the environment variable is not found and no default value is provided.
 */
export const getEnv = (name, defaultValue) => {
  const value = ENV[name] || defaultValue;

  if (value !== undefined) {
    return value;
  }

  throw new Error(`Missing environment variable: ${name}`);
};
