const { createSimpleStaticUtilityPlugin } = require('../pluginUtils')

module.exports = createSimpleStaticUtilityPlugin({
  '.place-items-auto': {
    'place-items': 'auto',
  },
  '.place-items-start': {
    'place-items': 'start',
  },
  '.place-items-end': {
    'place-items': 'end',
  },
  '.place-items-center': {
    'place-items': 'center',
  },
  '.place-items-stretch': {
    'place-items': 'stretch',
  },
})
