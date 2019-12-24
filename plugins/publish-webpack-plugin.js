const client = require('../lib')
const WebpackPlugin = require('./webpackPlugin.js')

class PublishPlugin extends WebpackPlugin {
  constructor(conf) {
    super(conf)
    this.client = client.sftp(conf)
  }
}

module.exports = PublishPlugin
