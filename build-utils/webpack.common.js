const commonPaths = require('./common-paths');

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FlowWebpackPlugin = require('flow-webpack-plugin')

const config = {
  entry: {
    vendor: ['semantic-ui-react']
  },
  output: {
    path: commonPaths.outputPath,
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      }
    ]
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        styles: {
          name: 'styles',
          test: /\.css$/,
          chunks: 'all',
          enforce: true
        },
        vendor: {
          chunks: 'initial',
          test: 'vendor',
          name: 'vendor',
          enforce: true
        }
      }
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: `public/index.html`,
      favicon: `public/favicon.ico`
    }),
    new webpack.DefinePlugin({
      'REST_URL': JSON.stringify('http://localhost:3000/api/s_pipes_editor_war_exploded/rest')
    }),
    new FlowWebpackPlugin(),
  ]
};

module.exports = config;
