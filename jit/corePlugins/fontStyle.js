const { createSimpleStaticUtilityPlugin } = require('../pluginUtils')

module.exports = createSimpleStaticUtilityPlugin({
  '.italic': { 'font-style': 'italic' },
  '.not-italic': { 'font-style': 'normal' },
})
