const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  mode: 'development',
  // devtool: 'inline-source-map',
  devServer: { // webpack-dev-server 的配置
    contentBase: './build'
  },
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'build'), // path 必须是绝对路径
    filename: 'main.[hash:8].js',
    publicPath: '',
  },
  resolve: {
    extensions: ['.js', '.json', '.css', '.less'], // 引入文件时，如果原路径未找到，则按此顺序添加后缀去查找
    alias: {
      "@common": path.resolve(__dirname, 'common')
    }
  },
  module: {
    rules: [
      {
        test: /\.js/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                [
                  "@babel/preset-env",
                  {
                    targets: "> 0.25%, not dead",
                    useBuiltIns: 'usage',
                    corejs: 3
                  }
                ]
              ],
              plugins: [
                ["@babel/plugin-proposal-decorators", {legacy: true}], // 支持类的装饰器语法
                ["@babel/plugin-proposal-class-properties", { loose : true }], // 支持类属性语法
                ['@babel/plugin-transform-runtime', {corejs: 3}]
              ]
            }
          }
        ],
        exclude: /node_module/,
      },
      {
        test: /\.css$/i,
        use: [
          // 两个 loader 的顺序不能变，loader 执行顺序由后往前
          // style-loader 用于通过 js 动态将 css 插入 head 中
          // css-loader 用于解析 css 文件
          'style-loader',
          'css-loader',
          'postcss-loader'
        ]
      },
      {
        test: /.less$/i,
        use: [
          // 'style-loader',
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'less-loader'
        ]
      },
      {
        test: /\.(jpg|png|bmp|svg|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 6 * 1024, // 文件大小在这个以下，则转成 base64，否则通过 file-loader 转成 url 地址
              outputPath: 'img/'
            }
          }
        ]
      },
      {
        test: /\.html/i, // 在 html 页面中，通过 url-loader 处理路径
        use: 'html-loader'
      }
    ]
  },
  plugins: [
    // 打包前先清除文件夹内容
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: 'css/main.css'
    }),
    // 将打包文件注入 html 中
    new HtmlWebpackPlugin({
      template: 'index.html', // html 模板路径
      filename: 'index.html', // html 输出文件名
      // hash: true, // 在静态资源路径后面加 hash 值，如 a.js?abcdef
      // publicPath: '/cdn/path' // 静态资源路径前缀
      minify: {
        collapseWhitespace: true, // 打包成一行
      }
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'doc',
          to: './doc'
        }
      ]
    })
  ]
}