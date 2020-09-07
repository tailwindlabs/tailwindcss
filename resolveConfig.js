const resolveConfigObjects = require('./lib/util/resolveConfig').default
const getAllConfigs = require('./lib/util/getAllConfigs').default

module.exports = function resolveConfig(...configs) {
  // Make sure the correct config object is mutated to include flagged config plugins.
  // This sucks, refactor soon.
  const firstConfigWithPlugins = configs.find(c => Array.isArray(c.plugins)) || configs[0]
  const [, ...defaultConfigs] = getAllConfigs(firstConfigWithPlugins)

  return resolveConfigObjects([...configs, ...defaultConfigs])
}
