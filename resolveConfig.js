const resolveConfigObjects = require('./lib/util/resolveConfig').default
const getAllConfigs = require('./lib/util/getAllConfigs').default

module.exports = function resolveConfig(...configs) {
  const [, ...defaultConfigs] = getAllConfigs(configs[0])
  return resolveConfigObjects([...configs, ...defaultConfigs])
}
