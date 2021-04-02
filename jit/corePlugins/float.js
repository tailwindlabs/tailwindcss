const { createSimpleStaticUtilityPlugin } = require('../pluginUtils')

module.exports = createSimpleStaticUtilityPlugin({
  '.float-right': { float: 'right' },
  '.float-left': { float: 'left' },
  '.float-none': { float: 'none' },
})
