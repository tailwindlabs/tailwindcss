const { createSimpleStaticUtilityPlugin } = require('../pluginUtils')

module.exports = createSimpleStaticUtilityPlugin({
  '.pointer-events-none': { 'pointer-events': 'none' },
  '.pointer-events-auto': { 'pointer-events': 'auto' },
})
