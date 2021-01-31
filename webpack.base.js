const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const webpack = require('webpack')

module.exports = {
  // devtool: 'inline-source-map',
  entry: {
    "entry1": './src/index.js',
    "lodash": "lodash"
    // "entry2": './src/index2.js',
    // "entry3": './src/index3.js',
    // "entry4": './src/index4.js'
  },
  optimization: {
    splitChunks: {
      // async 只会对 import() 异步进行分割；
      // initial 和 all 都会分割异步和同步，initial 认为即使异步和同步分割出相同的代码块，它们不关联，minChunks 不对异步进行计数
      // all 认为异步和同步是关联的，minChunks 会对它们一起计数
      // all 一般是最优解
      chunks: 'all',
      minChunks: 2,
      minSize: 1,
      maxInitialRequests: 3, // 入口模块中，允许分割模块的最大数量，自身算一次。超出数量时，取文件大的进行分割
      maxAsyncRequests: 2, // import() 分割出来的代码中，允许再分割的最大数量，自身算一次。超出数量时，取文件大的进行分割
      name(module, chunks, cacheGroupKey) {
        const moduleFileName = module.identifier().split('/').reduceRight(item => item);
        const allChunksNames = chunks.map((item) => item.name).join('~');
        return `${cacheGroupKey}-${allChunksNames}-${moduleFileName}`;
      },
      cacheGroups: { // 配置缓存组
        // test: 用来匹配模块
        // priority：内置的缓存组中为 -20；自定义的的缓存组中，如果没有配置，则默认为0
        // reuseExistingChunk：如果当前模块已经提取过了，那么复用已经生成的
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          priority: 10,
          reuseExistingChunk: true
        },
        common: {
          priority: 0,
          reuseExistingChunk: true
        }
      }
    }
  },
  output: {
    path: path.resolve(__dirname, 'build'), // path 必须是绝对路径
    // filename: 'main.[hash:8].js',
    // filename: '[name]--[hash]--[chunkhash]--[contenthash].js',
    filename: '[name].[chunkhash].js',
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
                    corejs: 3,
                    modules: false
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
    new webpack.DefinePlugin({
      'ENV': JSON.stringify(process.env.APP_ENV)
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash].css'
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