class APlugin {
  apply(compiler) {
    compiler.hooks.run.tap('aPlugin', () => {
      console.log('in aPlugin')
    })
  }
}

module.exports =  APlugin