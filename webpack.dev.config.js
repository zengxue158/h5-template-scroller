const pkg = require('./package.json')
const baseWebpackConfig = require('./webpack.base.config.js')

const path = require('path')
const resolve = path.resolve

const webpack = require('webpack')
const merge = require('webpack-merge')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebPackPlugin = require('html-webpack-plugin')

module.exports = merge(baseWebpackConfig, {
  mode: 'development',
  output: {
    path: resolve(__dirname, 'dist'),
    filename: 'static/js/[name].js'
  },
  devtool: 'inline-source-map',
  devServer: {
    disableHostCheck: true,
    stats: {
      assets: false,
      colors: true,
      version: false,
      hash: false,
      timings: false,
      chunks: false,
      chunkModules: false
    },
    noInfo: true,
    hotOnly: true,
    proxy: {
      // 代理
      // '/api': {
      //   target: 'https://test.3g.163.com/ug'
      // }
    }
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: './static/css/[name].css'
    }),
    new HtmlWebPackPlugin({
      template: './src/index.html',
      filename: './index.html'
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.DefinePlugin({
      'process.env.BASE_URL': JSON.stringify('/'),
      'process.env.ANT_PROJECT_ID': JSON.stringify(pkg.projectId)
    })
  ]
})