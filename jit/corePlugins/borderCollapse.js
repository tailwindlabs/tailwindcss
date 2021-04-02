const { createSimpleStaticUtilityPlugin } = require('../pluginUtils')

module.exports = createSimpleStaticUtilityPlugin({
  '.border-collapse': { 'border-collapse': 'collapse' },
  '.border-separate': { 'border-collapse': 'separate' },
})
