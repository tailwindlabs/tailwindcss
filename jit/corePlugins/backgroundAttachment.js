const { createSimpleStaticUtilityPlugin } = require('../pluginUtils')

module.exports = createSimpleStaticUtilityPlugin({
  '.bg-fixed': { 'background-attachment': 'fixed' },
  '.bg-local': { 'background-attachment': 'local' },
  '.bg-scroll': { 'background-attachment': 'scroll' },
})
