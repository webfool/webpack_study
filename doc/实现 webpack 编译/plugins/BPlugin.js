class BPlugin {
  apply(compiler) {
    compiler.hooks.run.tap('aPlugin', () => {
      console.log('in aPlugin')
    })
  }
}

module.exports =  BPlugin