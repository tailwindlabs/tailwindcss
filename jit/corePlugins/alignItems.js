const { createSimpleStaticUtilityPlugin } = require('../pluginUtils')

module.exports = createSimpleStaticUtilityPlugin({
  '.items-start': {
    'align-items': 'flex-start',
  },
  '.items-end': {
    'align-items': 'flex-end',
  },
  '.items-center': {
    'align-items': 'center',
  },
  '.items-baseline': {
    'align-items': 'baseline',
  },
  '.items-stretch': {
    'align-items': 'stretch',
  },
})
