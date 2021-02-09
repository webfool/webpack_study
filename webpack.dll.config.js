const path = require('path')
const webpack = require('webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = (env, argv) => {
  const { mode  = 'production' } = argv
  return {
    mode,
    entry: {
      'react': ['react', 'react-dom']
    },
    output: {
      path: path.resolve(__dirname, 'dllDist'),
      filename: '[name].dll.js',
      library: '_dll_[name]'
    },
    plugins: [
      new CleanWebpackPlugin(),
      new webpack.DllPlugin({
        name: '_dll_[name]',
        path: path.resolve(__dirname, 'dllDist', '[name].manifest.json'),
        // format: true // 将输出的 json 文件格式化
      })
    ]
  }
}