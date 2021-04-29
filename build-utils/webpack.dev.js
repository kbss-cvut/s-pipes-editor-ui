const commonPaths = require("./common-paths");

const webpack = require("webpack");

const port = process.env.PORT || 3000;

const config = {
  mode: "development",
  entry: {
    app: `${commonPaths.appEntry}/index.js`,
  },
  output: {
    filename: "[name].[hash].js",
  },
  resolve: {
    alias: {
      "react-dom": "@hot-loader/react-dom",
    },
  },
  devtool: "inline-source-map",
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: "style-loader",
          },
          {
            loader: "css-loader",
            options: {
              modules: true,
              localsConvention: "camelCase",
              sourceMap: true,
            },
          },
        ],
      },
    ],
  },
  plugins: [new webpack.HotModuleReplacementPlugin()],
  devServer: {
    host: "localhost",
    port: port,
    historyApiFallback: true,
    hot: true,
    open: true,
    proxy: {
      '/rest': {
        target: 'http://localhost:18115/og_spipes',
        // pathRewrite: {'^/api' : ''}, // In this case we don't pass `api` path
      }
    }
  },
};

module.exports = config;
