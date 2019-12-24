/**
 * 初始化 scp 服务
 */
const Scp2Client = require('scp2').Client
const ExecPublish = require('./publish')
const util = require('./helper/util')

class Client extends ExecPublish {
  constructor(conf) {
    super(conf)
    this.initClient(this.getServerInfo(this.conf.server))
  }

  // 初始 sftp 服务
  initClient(serverInfo) {
    this.client = new Scp2Client()
    this.client.defaults(serverInfo)
  }

  // 关闭 sftp 服务
  exit() {
    this.client.close()
  }

  // 部署
  scp(file, callback) {
    if (!util.isUndefined(file.content)) {
      const options = {
        source: file.filepath,
        destination: file.dest,
        content: file.content,
        attrs: file.stats || {}
      }
      this.client.write(options, callback)
    } else {
      this.client.upload(file.filepath, file.dest, callback)
    }
  }
}

module.exports = Client
