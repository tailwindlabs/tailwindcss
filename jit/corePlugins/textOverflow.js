const { createSimpleStaticUtilityPlugin } = require('../pluginUtils')

module.exports = [
  createSimpleStaticUtilityPlugin({
    '.truncate': {
      overflow: 'hidden',
      'text-overflow': 'ellipsis',
      'white-space': 'nowrap',
    },
  }),
  createSimpleStaticUtilityPlugin({
    '.overflow-ellipsis': { 'text-overflow': 'ellipsis' },
    '.overflow-clip': { 'text-overflow': 'clip' },
  }),
]
