const resolveConfigObjects = require('./lib/util/resolveConfig').default
const defaultConfig = require('./stubs/defaultConfig.stub.js')

module.exports = function resolveConfig(config) {
  return resolveConfigObjects([config, defaultConfig])
}
