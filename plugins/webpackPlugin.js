const crypto = require('crypto')
const { md5 } = require('./util')

const caches = {}
class WebpackPlugin {
  apply(compiler) {
    compiler.plugin('done', stats => {
      const files = []
      const assets = stats.compilation.assets

      Object.keys(assets).forEach(function(filename) {
        const file = assets[filename]
        const source = file.source()
        const hash = md5(crypto, source)
        const size = file.size()
        const cache = caches[filename] // filename: '*.ext'
        if (cache !== hash) {
          files.push({
            filename: filename,
            content: Buffer.from(source, 'utf-8'),
            size: size,
            stats: {}
          })
          caches[filename] = hash
        }
      })

      if (files.length) {
        this.client.init(files)
      }
    })
  }
}

module.exports = WebpackPlugin
