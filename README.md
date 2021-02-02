npx webpack 默认将 src/index.js 打包到 dist/main.js

- 自定义 webpack.config.js 配置文件和 npm script
```js
// webpack.config.js
const path = require('path')

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'build'), // path 必须是绝对路径
    filename: 'main.[hash:8].js'
  },
}

// package.json
{
  "scripts": {
    "build": "webpack --config webpack.config.js",
  }
}
```
- 通过 html-webpack-plugin 插件，将打包文件注入 html 中
```js
npm install --save-dev clean-webpack-plugin

// webpack.config.js
module.exports = {
  plugins: [
    // 将打包文件注入 html 中
    new HtmlWebpackPlugin({
      template: 'index.html', // html 模板路径
      filename: 'index.html', // html 输出文件名
      // hash: true, // 在静态资源路径后面加 hash 值，如 a.js?abcdef
      // publicPath: '/cdn/path' // 静态资源路径前缀
      minify: {
        collapseWhitespace: true, // 打包成一行
      }
    })
  ]
}
```
- 加入 clean-webpack-plugin，打包前先清除文件夹的内容
```js
npm install --save-dev clean-webpack-plugin

// webpack.config.js
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
  plugins: [
    new CleanWebpackPlugin()
  ]
}
```
- 配置 watch 命令监听文件变化，自动重新打包
```js
// package.json
{
  "scripts": {
    "watch": "webpack --config webpack.config.js --watch"
  }
}
```
- 配置 webpack-dev-server 启动开发 web 服务器并支持热更新
```js
npm install --save-dev webpack-dev-server

// webpack.config.js
module.exports = {
  devServer: {
    contentBase: './build'
  }
}

// package.json
{
  "scripts": {
    "dev": "webpack serve"
  }
}
```

- 配置 style-loader css-loader 以支持 css 的加载
```js
npm install --save-dev style-loader css-loader

// webpack.config.js
module.exports = {
  module: {
    "rules": [
      {
        test: /\.css$/i,
        use: [
          // 两个 loader 的顺序不能变，loader 执行顺序由后往前
          // style-loader 用于通过 js 动态将 css 插入 head 中
          // css-loader 用于解析 css 文件
          'style-loader',
          'css-loader'
        ]
      }
    ]
  }
}
```

- 配置 mini-css-extract-plugin 用于将 css 抽出独立文件
```js
npm i -D mini-css-extract-plugin

// webpack.config.js
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/main.css' // 将提取的 css 文件放在 css 目录下
    }),
  ],
  rules: [
    {
      test: /\.css$/i,
      use: [
        // 两个 loader 的顺序不能变，loader 执行顺序由后往前
        // style-loader 用于通过 js 动态将 css 插入 head 中
        // css-loader 用于解析 css 文件
        // 'style-loader',
        MiniCssExtractPlugin.loader
        'css-loader'
      ]
    }
  ]
}
```

- 配置 less less-loader 以支持 less 加载
```js
npm install --save-dev less less-loader

// webpack.config.js
module.exports = {
  "rules": [
    {
        test: /.less$/i,
        use: [
          // 'style-loader',
          MiniCssExtractPlugin.loader,
          'css-loader',
          'less-loader'
        ]
      }
  ]
}
```

- 配置 autoprefixer 为 css 自动添加浏览器属性前缀
```js
npm i -D postcss-loader postcss autoprefixer

// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /.less$/i,
        use: [
          // 'style-loader',
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'less-loader'
        ]
      }
    ]
  }
}

// postcss.config.js
module.exports = {
  plugins: [
    require('autoprefixer')
  ]
}
```

- 配置 url-loader、file-loader、html-loader 以支持在文件内引入图片
常见的引入图片的场景：js 中 import、css 中的 url、html 中的 <img src="" />
```js
npm i -D url-loader file-loader html-loader

// webpack.config.js
module.exports = {
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
}
```

- 配置 babel 转译 js
```js
npm i -D 
babel-loader 
@babel/core 
@babel/preset-env 
@babel/plugin-transform-runtime 
@babel/plugin-proposal-class-properties 
@babel/plugin-proposal-decorators

npm i core-js@3 @babel/runtime-corejs3

// webpack.config.js
module.exports = {
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
      }
    ]
  }
}
```

- 配置 copy-webpack-plugin 用于迁移文件
```js
npm i -D copy-webpack-plugin

// webpack.config.js
module.exports = {
  plugins: [
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
```
- 配置 resolve 选项定义查找后缀和别名
```js
const path = require('path')

module.exports = {
  resolve: {
    extensions: ['.js', '.json', '.css', '.less'], // 引入文件时，如果原路径未找到，则按此顺序添加后缀去查找
    alias: {
      "@common": path.resolve(__dirname, 'common')
    }
  },
}
```
- 根据环境区分使用的 webpack 配置文件
```js
npm i -D webpack-merge

// 原文件 webpack.config.js 改为 webpack.base.js

// webpack.dev.js
const { merge } = require('webpack-merge')
const base = require('./webpack.base')

module.exports = merge(base, {
  mode: 'development',
  devServer: { // webpack-dev-server 的配置
    contentBase: './build'
  },
})

// webpack.prod.js
const { merge } = require('webpack-merge')
const base = require('./webpack.base')

module.exports = merge(base, {
  mode: 'production'
})

// package.json
{
  "scripts": {
    "dev": "webpack serve --config webpack.dev.js",
    "build": "webpack --config webpack.prod.js"
  }
}
```

- 通过 cross-env 设置环境变量，再通过 DefinePlugin 赋值到代码
```js
npm i -D cross-env

// package.json
{
  "scripts": {
    "dev": "cross-env APP_ENV=dev webpack serve --config webpack.dev.js",
    "build:dev": "cross-env APP_ENV=dev webpack --config webpack.dev.js",
    "build:test": "cross-env APP_ENV=test webpack --config webpack.prod.js",
    "build": "cross-env APP_ENV=live webpack --config webpack.prod.js"
  }
}

// webpack.base.js
module.exports = {
  plugins: [
    new webpack.DefinePlugin({
      'ENV': JSON.stringify(process.env.APP_ENV)
    }),
  ]
}

// index.js 中使用
console.log('env ->', ENV)
```

- 配置接口代理和自定义 webpack-dev-server 路由
```js
// webpack.dev.js
const { merge } = require('webpack-merge')
const base = require('./webpack.base')

module.exports = merge(base, {
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
```

- 配置懒加载
```js
// 新建 b.js
export default () => {
  console.log('dynamic load b')
}

// index.js
setTimeout(() => {
  import('./b.js').then(({default: b}) => {
    b()
  })
}, 3000)
```

- 开始gzip压缩
```js
npm i -D compression-webpack-plugin
// webpack.prod.js
const CompressionWebpackPlugin = require('compression-webpack-plugin')

module.exports = {
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
}
```

- 配置 tree-shaking
为了避免 babel 将 import/export 语法转成 commonJs 的语法，需要设置
```js
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
          modules: false // 此处设置为 false
        }
      ]
    ]
  }
}
```
不同环境的 tree-shaking 配置
```js
// === dev 环境 ===
// webpack.dev.js
module.exports = {
  optimization: {
    usedExports: true // 配置之后将会对没有被使用的 export 变量进行标记，并删除没有被用到的且无副作用的模块文件
  },
}

// package.json
{
  "sideEffects": ["*.css"] // 指定哪些文件存在副作用，这样 tree-shaking 便不会删除该文件
}


// === production 环境 ===
// 配置 mode: production 之后，并有了标记和清除未使用变量的功能

// package.jso
{
  "sideEffects": ["*.css"] // 指定哪些文件存在副作用，这样 tree-shaking 便不会删除该文件
}
```

对于部分包，可以通过 babel-plugin 将 import 语法进行修改，这样可以避免把整个包打包进来
```js
import {join as joinFn} from 'loadash'

// 改为

import joinFn from 'loadash/join'
```

- hoisting 作用域提升
将模块按照引用顺序放到一个函数作用域中，再通过重命名避免命名冲突。它的好处：
1、大量作用域包裹代码会导致体积增大，通过 hoisting 可以减小代码体积
2、创建的函数作用域小了，对内存的开销也会减小

它在 mode: production 自动开启

- 配置代码分割
```js
// webpack.base.js
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
}
```

- 配置 prefetch 或 preload

通过 prefetch 或者 preload 实现预加载。两者的区别是：prefetch 会在空闲时加载，preload 会和入口文件并行下载
```js
// index.js
function test() {
  import(/* webpackPrefetch: true */'./a').then(({default: a}) => {
    console.log(a)
  })
}
```

- 配置 hash、chunkhash、contenthash
```js
// 正常配置是 output 中配置 chunkhash，提取的 css 中配置 contenthash
module.exports = {
  output: {
    path: path.resolve(__dirname, 'build'), // path 必须是绝对路径
    filename: '[name].[chunkhash].js',
    publicPath: '',
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash].css'
    })
  ]
}
```
- 配置统计 plugin 和 loader 花费时间的 plugin
```js
// 需要注意，该插件和 CopyWebpackPlugin 不兼容
const SpeedMeasureWebpackPlugin = require('speed-measure-webpack-plugin')
const smw = new SpeedMeasureWebpackPlugin()

module.exports = smw.wrap({
  ...// webpack 的配置
})
```

- 配置打包之后的包分析插件
```js
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = {
  plugins: [
    new BundleAnalyzerPlugin()
  ]
}
```