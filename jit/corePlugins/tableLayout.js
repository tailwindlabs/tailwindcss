const { createSimpleStaticUtilityPlugin } = require('../pluginUtils')

module.exports = createSimpleStaticUtilityPlugin({
  '.table-auto': { 'table-layout': 'auto' },
  '.table-fixed': { 'table-layout': 'fixed' },
})
