const { createSimpleStaticUtilityPlugin } = require('../pluginUtils')

module.exports = createSimpleStaticUtilityPlugin({
  '.justify-items-start': {
    'justify-items': 'start',
  },
  '.justify-items-end': {
    'justify-items': 'end',
  },
  '.justify-items-center': {
    'justify-items': 'center',
  },
  '.justify-items-stretch': {
    'justify-items': 'stretch',
  },
})
