const _ = require('../lib/helper/util')

test('验证一个值是字符串', () => {
  expect(_.isStr('test')).toBe(true)
})

test('验证一个值是否等于 undefined', () => {
  expect(_.isUndefined(undefined)).toBe(true)
})

test('验证一个文件是否存在', () => {
  expect(_.isFileExists('./test/test.txt')).toBe(true)
})
