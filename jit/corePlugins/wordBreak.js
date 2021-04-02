const { createSimpleStaticUtilityPlugin } = require('../pluginUtils')

module.exports = createSimpleStaticUtilityPlugin({
  '.break-normal': {
    'overflow-wrap': 'normal',
    'word-break': 'normal',
  },
  '.break-words': {
    'overflow-wrap': 'break-word',
  },
  '.break-all': { 'word-break': 'break-all' },
})
