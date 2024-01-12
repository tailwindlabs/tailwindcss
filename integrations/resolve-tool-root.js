let path = require('path')

module.exports = function resolveToolRoot() {
  let { testPath } = expect.getState()

  return path.resolve(
    __dirname,
    testPath
      .replace(__dirname + path.sep, '')
      .split(path.sep)
      .shift()
  )
}
