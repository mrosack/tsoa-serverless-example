var path = require('path');
var webpack = require('webpack');
var nodeExternals = require('webpack-node-externals');
var _ = require('lodash');
const slsw = require('serverless-webpack');

module.exports = {
  entry: _.assign({
    addlIncludes: './addlIncludes.ts'
  }, slsw.lib.entries),
  target: 'node',
  mode: 'development',
  devtool: 'source-map',
  module: {
    rules: [
      { test: /\.ts(x?)$/, loader: 'ts-loader' }
    ],
  },
  resolve: {
    extensions: ['.ts', '.js', '.tsx', '.jsx', '.json']
  },
  output: {
    libraryTarget: 'commonjs',
    path: path.join(__dirname, '.webpack'),
    filename: '[name].js',
    devtoolModuleFilenameTemplate: '[absolute-resource-path]'
  },
  externals: [nodeExternals()],
  plugins: [
    new webpack.IgnorePlugin(/\.(css|less)$/),
    new webpack.BannerPlugin({ banner: 'require("reflect-metadata");', raw: true, entryOnly: false }),
    new webpack.BannerPlugin({ banner: 'require("source-map-support").install();', raw: true, entryOnly: false })
  ],
  optimization: {
    minimize: false
  },
  performance: {
    hints: false
  }
};
