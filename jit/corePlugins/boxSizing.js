const { createSimpleStaticUtilityPlugin } = require('../pluginUtils')

module.exports = createSimpleStaticUtilityPlugin({
  '.box-border': { 'box-sizing': 'border-box' },
  '.box-content': { 'box-sizing': 'content-box' },
})
