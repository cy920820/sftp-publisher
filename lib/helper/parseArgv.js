const path = require('path')
const program = require('commander')
const pkg = require('../../package.json')
const chalk = require('chalk')
const util = require('./util')
const cwd = process.cwd() // 当前运行cli 的工作路径

// display usage
program
.name('publish')
.version(pkg.version)
.usage('[options] [workspace] [deployDest]')
.option('-c, --config <path>', 'set config path. defaults to ./deploy.js')
.option('-s, --server <address>', 'server account, address. (e.g. user:pwd@address:port)')
.option('-i, --ignore <pattern>', 'ignore the matched files')

// display hepls
program.on('--help', function() {
  console.log('')
  console.log('Examples:')
  console.log('')
  console.log('  // use configuration from a file')
  console.log('  $ publish --config deploy.js')
  console.log('  // publish files in ./dist to /data/app/test-app on 192.169.0.22:80')
  console.log('  $ publish -s user:pwd@192.169.0.22:80 -i *.map ./dist /data/app/test-app')
  console.log('')
  console.log('  version: ' + pkg.version)
})

try {
  program.parse(process.argv)
} catch (err) {
  console.log(err)
}

// read configuration from local file
function readConfig() {
  let conf = {}
  let cFile = ''

  // 如果指定 config 文件
  if (program.config) {
    cFile = path.resolve(cwd, program.config)
    if (util.isFileExists(cFile)) {
      conf = require(cFile)
    } else {
      console.log(chalk.red(`Cannot find configuration file ${program.config}`))
      process.exit() // 退出程序
    }
  } else {
    // 没有指定默认去当前路径下找
    cFile = path.resolve(cwd, 'deploy.js')
    // fs.accessSync ?
    if (util.isFileExists(cFile)) {
      conf = require(cFile)
    }
  }

  // 获取 -i -s
  ;['server', 'ignore'].forEach(function(name) {
    if (!util.isUndefined(program[name])) {
      conf[name] = program[name]
    }
  })

  // get workspace
  if (program.args[0]) {
    conf.workspace = path.resolve(cwd, program.args[0])
  }

  // get deployDest
  if (program.args[1]) {
    conf.deployDest = program.args[1]
  }

  return conf
}

const config = {
  server: '',
  workspace: '',
  ignore: '',
  deployDest: '',
  rules: []
}

Object.assign(config, readConfig())

// validate required options
;['server', 'workspace', 'deployDest'].some(function(name) {
  if (!config[name]) {
    console.log(chalk.red(`${name} required, please check your configuration.`))
    process.exit()
  } else {
    console.log(chalk.yellow('Configuration read successfully!'))
  }
})

module.exports = config
