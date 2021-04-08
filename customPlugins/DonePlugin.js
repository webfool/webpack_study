class DonePlugin {
  constructor(options) {
    this.options = options
  }

  apply(compiler) {
    // compiler.hooks.done.tap('doneplugin', (stats) => {
    //   console.log('===== done =====')
    // })

    // === 测试 tapAsync ===
    // compiler.hooks.done.tapAsync('donePlugin1', (stats, callback) => {
    //   console.log('donePlugin1 ->')
    //   setTimeout(callback, 2000)
    // })

    // compiler.hooks.done.tapAsync('donePlugin2', (stats, callback) => {
    //   console.log('donePlugin2 ->')
    //   setTimeout(callback, 2000)
    // })

    // === 测试 tapPromise ===
    compiler.hooks.done.tapPromise('donePlugin-promise1', function(stats) {
      return new Promise((resolve, reject) => {
        // console.log('donePlugin-promise1 ->', stats.toJson())
        console.log('donePlugin-promise1 ->')
        setTimeout(resolve, 1000)
      })
    })

    compiler.hooks.done.tapPromise('donePlugin-promise2', function(stats) {
      return new Promise((resolve, reject) => {
        // console.log('donePlugin-promise2 ->', stats.toJson())
        console.log('donePlugin-promise2 ->')
        setTimeout(resolve, 2000)
      })
    })
  }
}

module.exports = DonePlugin