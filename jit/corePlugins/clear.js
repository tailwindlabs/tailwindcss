const { createSimpleStaticUtilityPlugin } = require('../pluginUtils')

module.exports = createSimpleStaticUtilityPlugin({
  '.clear-left': { clear: 'left' },
  '.clear-right': { clear: 'right' },
  '.clear-both': { clear: 'both' },
  '.clear-none': { clear: 'none' },
})
