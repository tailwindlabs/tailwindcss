const resolveConfigObjects = require('./lib/util/resolveConfig').default
const getAllConfigs = require('./lib/util/getAllConfigs').default

module.exports = function resolveConfig(...configs) {
  if (configs.length === 1 && Array.isArray(configs[0])) {
    return resolveConfigObjects([...configs[0]].reverse())
  }
  const [, ...defaultConfigs] = getAllConfigs(configs[0])
  return resolveConfigObjects([...configs, ...defaultConfigs])
}
