let path = require('path')

module.exports = function resolveToolRoot() {
  let { testPath } = expect.getState()
  let separator = '/' // TODO: Does this resolve correctly on windows, or should we use `path.sep` instead.

  return path.resolve(
    __dirname,
    testPath
      .replace(__dirname + separator, '')
      .split(separator)
      .shift()
  )
}
