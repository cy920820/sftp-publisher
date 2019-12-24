const path = require('path')
const minimatch = require('minimatch')
const chalk = require('chalk')
const util = require('./helper/util')
const publishUtil = require('./helper/publish-util')
const defaultFilename = 'publish.js'

class ExecPublish {
  constructor(conf) {
    if (!conf) conf = publishUtil.readConf(defaultFilename)

    this.conf = conf
    const ignore = conf.ignore // ignore pattern
    const rules = conf.rules // deploy rules
    this.ignore = util.isStr(ignore) ? [ignore] : ignore || []
    this.workspace = conf.workspace // 本地上传根路径
    this.deployDest = conf.deployDest // 远程部署路径
    this.server = conf.server
    this.rules = []

    if (rules && rules.length) {
      rules.forEach(rule => {
        this.rules.push({
          test: rule.test,
          dest: path.join(this.deployDest, rule.dest)
        })
      })
    }
  }

  // 获取远端机服务信息
  getServerInfo(conf) {
    const server = /^([^:]+):([^:]+)@(.*?)(?::(\d+))?$/.exec(conf)
    const serverInfo = {
      username: server[1],
      password: server[2],
      host: server[3],
      port: server[4] || '22'
    }

    return serverInfo
  }

  // error handler
  error(err) {
    this.exit()
    if (err) throw err
  }

  // 发布
  publish(files, callback) {
    if (!files.length) return callback(null)

    const file = files.shift()

    this.scp(file, err => {
      file.to = file.to || file.dest
      let desc = ''

      if (err) {
        // 输出错误信息
        desc = chalk.yellow(`${file.filename} ${chalk.white('====>')} ${file.to}`)
        console.log(chalk.red('upload failure :'), desc)
        callback(err)
      } else {
        desc = chalk.cyan(`${file.filename} ${chalk.white('====>')} ${file.to}`)
        console.log(chalk.green('upload success :'), desc)

        if (files.length) {
          this.publish(files, callback)
        } else {
          callback(null)
        }
      }
    })
  }

  // custom dest
  customDest(file, rule) {
    const pattern = rule.test
    const matching = file.filepath.match(pattern)

    if (matching) {
      file.dest = rule.dest.replace(/\[\$(\d+)\]/g, (results, idx) => {
        return matching[idx]
      })
    }
  }

  // format files object
  formatFiles(files) {
    const workspace = this.workspace
    const deployDest = this.deployDest
    const rules = this.rules

    return files.map(file => {
      let filename

      // 格式化文件名
      if (util.isStr(file)) { // 本地磁盘的文件
        filename = file.replace(workspace, '')
        file = {}
      } else { // webpack 缓存内存中的文件
        filename = file.filename
      }

      // 本地workspace绝对路径
      const filepath = path.join(workspace, filename)

      // 远端机路径
      const dest = path.join(deployDest, filename)

      file.filename = filename // 文件名
      file.filepath = filepath // 待上传文件本地路径
      file.dest = dest // 发布远端机名称

      // 应用自定义规则，修改远程文件名称
      rules.forEach((rule) => {
        this.customDest(file, rule)
      })

      return file
    })
  }

  // publish start
  publishStart(fileData) {
    const startTime = Date.now() // 记录开始时间
    this.publish(this.formatFiles(fileData), err => {
      this.publishEnd(err, fileData, startTime)
      if (err) this.error(err)
    })
  }

  // publish end
  publishEnd(err, files, startTime) {
    const endTime = Date.now()
    if (!files.length) console.log(chalk.yellow('No files were uploaded!'))
    console.log(chalk.green(`Files: ${files.length} Times: ${(endTime - startTime) / 1000}s`))
    this.error(err)
  }

  // filter ignore files & start publish
  start(files) {
    if (files) {
      files = files.filter(file => {
        return !this.ignore.some(pattern => {
          return minimatch(file.filename, pattern)
        })
      })
      this.publishStart(files)
    } else {
      publishUtil.globFile(['**'], { // ['**']
        cwd: this.workspace,
        ignore: this.ignore,
        realpath: true,
        nodir: true
      }, (err, files) => {
        if (err) {
          this.error(err)
        } else {
          this.publishStart(files)
        }
      })
    }
  }

  init (files) {
    // 根据 ignore pattern 过滤文件 - 异步
    this.start(files)
  }
}

module.exports = ExecPublish
