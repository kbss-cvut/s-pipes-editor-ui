import postcssPresetEnv from "postcss-preset-env";
import cssnano from "cssnano";

export default {
  plugins: [
    postcssPresetEnv({
      browsers: [">0.25%", "not ie 11", "not op_mini all"],
    }),
    cssnano(),
  ],
};
