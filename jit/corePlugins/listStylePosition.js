const { createSimpleStaticUtilityPlugin } = require('../pluginUtils')

module.exports = createSimpleStaticUtilityPlugin({
  '.list-inside': { 'list-style-position': 'inside' },
  '.list-outside': { 'list-style-position': 'outside' },
})
