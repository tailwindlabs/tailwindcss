const { createSimpleStaticUtilityPlugin } = require('../pluginUtils')

module.exports = createSimpleStaticUtilityPlugin({
  '.object-contain': { 'object-fit': 'contain' },
  '.object-cover': { 'object-fit': 'cover' },
  '.object-fill': { 'object-fit': 'fill' },
  '.object-none': { 'object-fit': 'none' },
  '.object-scale-down': { 'object-fit': 'scale-down' },
})
