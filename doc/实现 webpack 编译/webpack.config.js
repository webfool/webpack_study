const path = require('path')
const APlugin = require('./plugins/APlugin')
const BPlugin = require('./plugins/BPlugin')

module.exports = {
  entry: {
    'bundle': './doc/实现 webpack 编译/src/index.js'
  },
  output: {
    path: path.resolve(__dirname, 'build'), // path 必须是绝对路径
    filename: '[name].js',
  },
  resolve: {
    extensions: ['.js', '.json', '.css', '.less'], // 引入文件时，如果原路径未找到，则按此顺序添加后缀去查找
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['../loaders/ALoader', '../loaders/BLoader']
      }
    ]
  },
  plugins: [
    new APlugin(),
    new BPlugin()
  ]
}