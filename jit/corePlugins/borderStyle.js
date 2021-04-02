const { createSimpleStaticUtilityPlugin } = require('../pluginUtils')

module.exports = createSimpleStaticUtilityPlugin({
  '.border-solid': {
    'border-style': 'solid',
  },
  '.border-dashed': {
    'border-style': 'dashed',
  },
  '.border-dotted': {
    'border-style': 'dotted',
  },
  '.border-double': {
    'border-style': 'double',
  },
  '.border-none': {
    'border-style': 'none',
  },
})
