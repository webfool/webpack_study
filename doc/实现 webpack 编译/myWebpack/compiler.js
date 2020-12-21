// compiler 实现：从路口开始，递归生成每一个模块的模块对象，最后生成合并成一个打包文件
// 
// 实现细节：
// - 传入配置对象给 compiler 进行初始化
// - 加载所有插件进行事件监听
// - 执行编译
//   - 从 entry 文件开始
//     - 生成一个 module 对象，格式为 {name: 'chunk块的名称', id: '相对于pwd的路径', _source: '源代码', dependencies: ['依赖的其它模块路径']}
//     - 读取源代码，并传入所有匹配 loader 进行处理
//     - 通过 ast 覆盖该文件代码中 require 路径为相对于 cwd 的路径
//     - 将 module 对象存入 modules 数组中
//   - 根据 entry 中的依赖文件的路径，递归执行上一个步骤
//   - 生成 chunks 数组，从 module 中过滤出每个 chunk 对应的 module。每个 chunk 对象的格式 {name: 'chunk块的名称', entryModule, modules: ['依赖的所有模块']}
//   - 根据 chunk 生成输入文件的内容字符串
//   - 派发 emit 事件，允许 plugin 修改输出列表
//   - 执行输出操作

const {SyncHook} = require('tapable')
const path = require('path')
const fs = require('fs')
const types = require('@babel/types')
const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default
const generator = require('@babel/generator').default
const webpackConfig = require('../webpack.config')

const baseDir = process.cwd()
class Compiler {
  constructor(options) {
    this.options = options
    this.hooks = {
      run: new SyncHook(), // 开始执行编译时触发的钩子
      emit: new SyncHook(), // 即将写入文件时触发的钩子
      done: new SyncHook(), // 写入完成时触发的钩子
    }
    this.modules = [] // 所有的模块对象
    this.chunks = [] // 所有的 chunk 对象
    this.assets = {} // 生成的所有资源数据
    this.files = [] // 所有资源文件的名称
  }

  run() {
    this.hooks.run.call() // 调用开始编译的钩子

    const {context, entry, output} = this.options

    let entryConfig = typeof entry === 'string' ? {
      main: entry
    } : entry

    let entryContext = context || baseDir

    // 生成所有 chunk
    for (let entryName in entryConfig) {
      const entryPath = path.join(entryContext, entryConfig[entryName])
      const entryModule = this.buildModule(entryName, entryPath)

      let chunk = {entryName, entryModule, modules: this.modules.filter(({name}) => name === entryName)}
      this.chunks.push(chunk)
    }

    this.chunks.forEach((chunk) => {
      let assetPath = output.filename.replace(/\[name\]/g, chunk.entryName)
      this.assets[assetPath] = getSource(chunk)
    })

    this.files = Object.keys(this.assets)

    this.hooks.emit.call() // 调用写入文件前的钩子

    Object.entries(this.assets).forEach(([assetPath, content]) => {
      const targetPath = path.join(output.path, assetPath)
      fs.writeFileSync(targetPath, content)
    })

    this.hooks.done.call()
  }

  /**
   * 通过模块路径生成模块对象
   * - 获取源代码，通过所有 loader 进行转译
   * - 通过 ast 将源代码中 require 路径改为相对于 cwd 的相对路径
   * - 递归生成所有依赖的 module 对象
   */
  buildModule(name, modulePath) {
    const id = path.relative(baseDir, modulePath)

    const module = {name, id, dependencies: []}

    // 获取源码
    const originSourceCode = fs.readFileSync(modulePath, 'utf8')
    let targetSourceCode = originSourceCode

    // 获取匹配的 loader
    let loaders = []
    const rules = this.options.module.rules

    rules.forEach(({test, use}) => {
      if (test.test(modulePath)) {
        const currentLoaders = typeof use === 'string' ? [use] : use
        loaders = [...loaders, ...currentLoaders]
      }
    })

    // 使用 loader 转译源码
    loaders.forEach(loader => {
      targetSourceCode = require(loader)(targetSourceCode)
    })

    // ast 解析，修改源码中的 require 路径
    let astTree = parser.parse(targetSourceCode)
    traverse(astTree, {
      CallExpression: ({node}) => {
        if (node.callee.name === 'require') {
          const moduleName = node.arguments[0].value

          let depModulePath = path.join(path.dirname(modulePath), moduleName)
          const extensions = this.options.resolve.extensions
          depModulePath = tryExtension(depModulePath, extensions)
          module.dependencies.push(depModulePath)

          const depModuleId = path.relative(baseDir, depModulePath)
          node.arguments = [types.stringLiteral(depModuleId)]
        }
      }
    })
    targetSourceCode = generator(astTree).code
    module._source = targetSourceCode

    module.dependencies.forEach(depModulePath => {
      this.modules.push(this.buildModule(name, depModulePath))
    })
    return module
  }
}

function getSource(chunk) {
  return `
    var modules = {
      ${
        chunk.modules.map((module) => {
          return `"${module.id}": function(module, exports, require){
            ${module._source}
          }`
          // return "module.id" + ':' + 'function(module, exports, require) {' + module._source + '}'
        }).join(',')
      }
    }

    var cacheModule = {}
    function require(moduleId) {
      if (cacheModule[moduleId]) return cacheModule[moduleId].exports

      var module = (cacheModule[moduleId] = {exports: {}})
      modules[moduleId](module, module.exports, require)
      return module.exports
    }
    (function() {
      ${chunk.entryModule._source}
    })()
  `
}

function tryExtension(modulePath, extensions) {
  let exts = ['', ...extensions]
  for (let i = 0; i < exts.length; i++) {
    const currentPath = modulePath + exts[i]
    if (fs.existsSync(currentPath)) {
      return currentPath
    }
  }
}

const compiler = new Compiler(webpackConfig)
if (webpackConfig.plugins && Array.isArray(webpackConfig.plugins)) {
  webpackConfig.plugins.forEach(plugin => plugin.apply(compiler))
}
compiler.run()