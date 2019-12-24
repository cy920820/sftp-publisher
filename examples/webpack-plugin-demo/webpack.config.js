const publishPlugin = require('../../plugins/publish-webpack-plugin')

module.exports = {
  plugins: [
    new publishPlugin()
  ]
}
