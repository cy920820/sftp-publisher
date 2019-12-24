exports.md5 = (crypto, content) => {
  return crypto.createHash('md5').update(content).digest('hex')
}
