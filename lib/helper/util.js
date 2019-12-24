const fs = require('fs')
const utils = {}

utils.isStr = function(str) {
  return typeof str === 'string'
}

utils.isUndefined = function (data) {
  return typeof data === 'undefined'
}

utils.asyncWrap = function(promise) {
  return promise.then(res => [null, res]).catch(err => [err, null])
}

utils.isFileExists = (filePath) => {
  return fs.accessSync(filePath, fs.constants.F_OK) === undefined
}

module.exports = utils
