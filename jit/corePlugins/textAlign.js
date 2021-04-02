const { createSimpleStaticUtilityPlugin } = require('../pluginUtils')

module.exports = createSimpleStaticUtilityPlugin({
  '.text-left': { 'text-align': 'left' },
  '.text-center': { 'text-align': 'center' },
  '.text-right': { 'text-align': 'right' },
  '.text-justify': { 'text-align': 'justify' },
})
