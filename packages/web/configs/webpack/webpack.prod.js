const path = require('path');
const { merge } = require('webpack-merge');
const baseConfig = require('./webpack.base');

const prodConfig = {
  mode: 'production',
  output: {
    filename: 'js/bundle.[contenthash].min.js',
    path: path.resolve(__dirname, '../../dist'),
    publicPath: '/',
  },
};

module.exports = merge(baseConfig, prodConfig);
