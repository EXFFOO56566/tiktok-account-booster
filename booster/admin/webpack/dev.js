const paths = require('./path');
const merge = require('webpack-merge');
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CircularDependencyPlugin = require('circular-dependency-plugin');

const commonConfig = require('./base');

module.exports = merge(commonConfig, {
  mode: 'development',
  entry: [
    require.resolve('react-app-polyfill/ie11'),
    'webpack-hot-middleware/client?reload=true',
    path.join(process.cwd(), 'src/index.jsx'), // Start with js/app.js
  ],

  // Don't use hashes in dev mode for better performance
  output: {
    filename: '[name].js',
    chunkFilename: '[name].chunk.js',
    path: paths.appBuildPath,
    publicPath: '/'
  },
  devServer: {
    hot: true,
    historyApiFallback: true,
    proxy: {
      '/v1/admin': {
        target: process.env.PROXY_API,
        secure: false,
        changeOrigin: true,
        headers: {
          Connection: 'keep-alive'
        }
      },
      '/v1/api': {
        target: process.env.PROXY_API,
        secure: false,
        changeOrigin: true,
        headers: {
          Connection: 'keep-alive'
        }
      },
    }
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(), // Tell webpack we want hot reloading
    new HtmlWebpackPlugin({
      template: paths.appHtml,
      filename: 'index.html',
      title: "Admin",
      chunksSortMode: "auto",
      favicon: paths.appFavicon
    }),
    new webpack.DefinePlugin({
      'process.env': {
        'BASE': JSON.stringify('/'),
        'NODE_URL': JSON.stringify('/'),
      }
    }),
    new CircularDependencyPlugin({
      exclude: /a\.js|node_modules/, // exclude node_modules
      failOnError: false, // show a warning when there is a circular dependency
    }),
  ],
  // Emit a source map for easier debugging
  // See https://webpack.js.org/configuration/devtool/#devtool
  devtool: 'eval-source-map',
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
});
