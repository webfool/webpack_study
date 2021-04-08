const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const webpack = require('webpack')
const SpeedMeasureWebpackPlugin = require('speed-measure-webpack-plugin')
const smw = new SpeedMeasureWebpackPlugin()
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const DllReferencePlugin = webpack.DllReferencePlugin
const DonePlugin = require('./customPlugins/DonePlugin')
const AssetPlugin = require('./customPlugins/AssetPlugin')

module.exports = smw.wrap({
// module.exports = {
  // 1.映射回最原先的文件时，只能配置行信息
  // devtool 由3部分组成，
  // 1. 定义生成的 map 信息放置的位置：inline、eval、hidden
  // 2. 是否需要删除列信息、是否映射回包含 loader sourcemap：cheap、cheap-module
  // eval 映射信息通过 sourceURL 内嵌在打包后的文件内，能映射回源文件
  // 打包文件内都是通过 sourceMappingURL 关联映射文件，它可能是路径地址，也可能是转换后的 base64

  // sourceURL 如何引入源文件

  // === 【源文件-压缩文件，包含行和列信息】 ===
  // source-map 映射信息放入 map 文件中，文件地址内嵌到打包文件中
  // inline-source-map 映射信息转 base64 内嵌在打包文件中
  // eval-source-map 映射信息转 base64 内嵌在打包文件中，且被 eval 包裹
  // hidden-source-map 映射信息放入 map 文件中，打包文件内不关联 map 文件

  // === 【源文件-压缩文件，不包含列信息】 ===
  // cheap-module-source-map，映射信息放入 map 文件中，文件地址内嵌到打包文件中
  // inline-cheap-module-source-map 映射信息转 base64 内嵌到打包文件中
  // eval-cheap-module-source-map 映射信息转 base64 内嵌到打包文件中，且被 eval 包裹
  // hidden-cheap-module-source-map 映射信息放入 map 文件，打包文件内不关联 map 文件

  // === 【打包文件-压缩文件，包含行和列信息】 ===
  // eval 

  // === 【打包文件-压缩文件，不包含列信息】 ===
  // cheap-source-map 映射信息放入 map 文件中，文件地址内嵌到打包文件中
  // inline-cheap-source-map 映射信息转 base64 内嵌到打包文件中
  // eval-cheap-source-map 映射信息转 base64 内嵌到打包文件内，用 eval 包裹
  // hidden-cheap-source-map 映射信息放入 map 文件中，打包文件不关联 map 文件

  // devtool: 'eval-cheap-module-source-map',
  entry: {
    "entry1": './src/index.js',
    // "lodash": "lodash"
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
    // filename: '[name].[chunkhash].js',
    filename: '[name].js',
    publicPath: '',
  },
  resolve: {
    modules: [path.resolve(__dirname, 'src/my_modules'), 'node_modules'], // 配置模块查找时的路径，前面的优先级高于后面，绝对路径则只在给定目录查找
    alias: { // 设置模块查找的别名
      "@common": path.resolve(__dirname, 'common')
    },
    extensions: ['.js', '.json', '.css', '.less'] // 引入文件时，如果原路径未找到，则按此顺序添加后缀去查找
  },
  module: {
    rules: [
      {
        test: /\.js/,
        use: [
          'cache-loader',
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              presets: [
                [
                  "@babel/preset-env",
                  {
                    targets: "> 0.25%, not dead",
                    useBuiltIns: 'usage',
                    corejs: 3,
                    modules: false
                  }
                ],
                "@babel/preset-react"
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
          'cache-loader',
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
          'cache-loader',
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
    // new CopyWebpackPlugin({
    //   patterns: [
    //     {
    //       from: 'doc',
    //       to: './doc'
    //     }
    //   ]
    // })
    // new CopyWebpackPlugin({
    //   patterns: [
    //     {
    //       from: 'dllDist',
    //       to: './dllDist'
    //     }
    //   ]
    // }),
    // new BundleAnalyzerPlugin(),
    new webpack.IgnorePlugin({
      contextRegExp: /moment$/, // 匹配的文件
      resourceRegExp: /^\.\/locale$/ // 匹配文件内匹配的请求资源路径
    }),
    new DllReferencePlugin({
      manifest: path.resolve(__dirname, 'dllDist', 'react.manifest.json')
    }),
    new DonePlugin(),
    new AssetPlugin()
  ]
})
// }