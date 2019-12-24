const $ = require('../lib/helper/publish-util')

test('读取一个配置文件', () => {
  expect($.readConf('./test/test.conf.js')).toStrictEqual({
    server: '',
    deployDest: ''
  })
})
