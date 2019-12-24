const path = require('path')
const async = require('async')
const glob = require('glob')
const util = require('./util')
const publishUtil = {}

// 读取自定义配置
publishUtil.readConf = function(filename) {
  let config = {}
  const confPath = path.resolve(process.cwd(), filename)
  const isFileExists = util.isFileExists(confPath)
  if (isFileExists) {
    config = require(confPath)
  }

  return config
}

publishUtil.globFile = function(patterns, options, callback) {
  async.map(
    patterns,
    function(pattern, next) {
      glob(pattern, options, next)
    },
    function(err, data) {
      if (err) {
        callback(err)
      } else {
        const files = data.reduce(function(prev, cur) {
          return prev.concat(cur)
        })
        callback(null, files)
      }
    }
  )
}

module.exports = publishUtil
