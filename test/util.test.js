const _ = require('../lib/helper/util')

test('验证一个值是字符串', () => {
  expect(_.isStr('test')).toBe(true)
})
