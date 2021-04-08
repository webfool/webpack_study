class AssetPlugin {
  constructor(options) {
    this.options = options
  }

  apply(compiler) {
    compiler.hooks.compilation.tap('compilation1', (compilation) => {
      console.log('=== compilation1 ===')
      compilation.hooks.chunkAsset.tap('chunkAsset1', (chunk, filename) => {
        console.log('filename ->', filename)
      })
    })
  }
}

module.exports = AssetPlugin