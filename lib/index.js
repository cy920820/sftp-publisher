const Client = require('./client')

exports.sftp = function(conf) {
  return new Client(conf)
}
