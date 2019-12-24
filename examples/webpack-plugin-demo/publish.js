const path = require('path')

module.exports = {
  server: 'root:15235834857.lei@39.107.243.64:22',
  workspace: path.join(__dirname, '/dist'),
  deployDest: '/data/app/test-app',
  ignore: 'dist/**/*.map',
  rules: [
    {
      test: /dist\/(.*)$/,
      dest: 'data/app/test-app/static/[$1]'
    }
  ]
}
