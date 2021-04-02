const { createSimpleStaticUtilityPlugin } = require('../pluginUtils')

module.exports = createSimpleStaticUtilityPlugin({
  '.select-none': { 'user-select': 'none' },
  '.select-text': { 'user-select': 'text' },
  '.select-all': { 'user-select': 'all' },
  '.select-auto': { 'user-select': 'auto' },
})
