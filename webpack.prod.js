const { merge } = require('webpack-merge')
const base = require('./webpack.base')
const CompressionWebpackPlugin = require('compression-webpack-plugin')

module.exports = merge(base, {
  mode: 'production',
  plugins: [
    new CompressionWebpackPlugin({ // 开启 gzip 压缩
      test: new RegExp('\\.(js|css)$'),
      exclude: /doc\/*/,
      threshold: 1, // 压缩大于 1b 的文件
      algorithm: 'gzip',
      minRatio: 0.8, // 当 压缩后/压缩前 的比 <= 0.8 时，就会触发压缩
      filename: '[path][base].gz',
      deleteOriginalAssets: false // 压缩之后不删除源文件
    })
  ]
})