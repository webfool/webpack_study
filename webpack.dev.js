const { merge } = require('webpack-merge')
const base = require('./webpack.base')

module.exports = merge(base, {
  mode: 'development',
  devServer: { // webpack-dev-server 的配置
    contentBase: './build'
  },
})