const { createSimpleStaticUtilityPlugin } = require('../pluginUtils')

module.exports = createSimpleStaticUtilityPlugin({
  '.uppercase': { 'text-transform': 'uppercase' },
  '.lowercase': { 'text-transform': 'lowercase' },
  '.capitalize': { 'text-transform': 'capitalize' },
  '.normal-case': { 'text-transform': 'none' },
})
