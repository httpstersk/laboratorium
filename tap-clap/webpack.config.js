const path = require('path');
const webpack = require('webpack');
const HTMLWebpackPlugin = require('html-webpack-plugin');

const pkg = require('./package');

const ROOT_PATH = path.resolve(__dirname);
const APP_PATH = path.resolve(ROOT_PATH, 'src');
const DIST_PATH = path.resolve(ROOT_PATH, 'dist');
const HTML_PATH = path.resolve(ROOT_PATH, 'src', 'index.html');

module.exports = {
  entry: APP_PATH,
  output: {
    path: DIST_PATH,
    filename: 'bundle.js'
  },

  devtool: 'eval-source-map',

  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel',
      query: {
        presets: ['es2015']
      }
    }, {
      test: /\.css$/,
      loaders: ['style', 'css']
    }, {
      test: /\.(png|woff|woff2|eot|ttf|svg)$/,
      loader: require.resolve("file-loader")
    }]
  },

  devServer: {
    historyApiFallback: true,
    hot: true,
    inline: true,
    progress: true
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HTMLWebpackPlugin({
      title: pkg.name,
      template: HTML_PATH
    })
  ]
};
