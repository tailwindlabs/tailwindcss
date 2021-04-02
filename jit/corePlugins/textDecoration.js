const { createSimpleStaticUtilityPlugin } = require('../pluginUtils')

module.exports = createSimpleStaticUtilityPlugin({
  '.underline': { 'text-decoration': 'underline' },
  '.line-through': { 'text-decoration': 'line-through' },
  '.no-underline': { 'text-decoration': 'none' },
})
