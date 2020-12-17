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

module.exports {
  resolve: {
    extensions: ['.js', '.json', '.css', '.less'], // 引入文件时，如果原路径未找到，则按此顺序添加后缀去查找
    alias: {
      "@common": path.resolve(__dirname, 'common')
    }
  },
}
```