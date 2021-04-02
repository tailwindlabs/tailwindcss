const { createSimpleStaticUtilityPlugin } = require('../pluginUtils')

module.exports = createSimpleStaticUtilityPlugin({
  '.visible': { visibility: 'visible' },
  '.invisible': { visibility: 'hidden' },
})
