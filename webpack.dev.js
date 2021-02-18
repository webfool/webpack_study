const { merge } = require('webpack-merge')
const base = require('./webpack.base')
const TerserPlugin = require('terser-webpack-plugin')

module.exports = merge(base, {
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  optimization: {
    usedExports: true,
  },
  devServer: { // webpack-dev-server 的配置
    contentBase: './build',
    proxy: { // 配置接口代理
      "/api/account": {
        target: 'http://localhost:4000',
        pathRewrite: {
          '/api': ''
        }
      }
    },
    before(app){ // 自定义 webpack-dev-server 中的路由
      app.get('/user', (req, res) => {
        res.json({
          name: 'hw'
        })
      })
    }
  },
})