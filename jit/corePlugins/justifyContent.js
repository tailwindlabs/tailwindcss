const { createSimpleStaticUtilityPlugin } = require('../pluginUtils')

module.exports = createSimpleStaticUtilityPlugin({
  '.justify-start': {
    'justify-content': 'flex-start',
  },
  '.justify-end': {
    'justify-content': 'flex-end',
  },
  '.justify-center': {
    'justify-content': 'center',
  },
  '.justify-between': {
    'justify-content': 'space-between',
  },
  '.justify-around': {
    'justify-content': 'space-around',
  },
  '.justify-evenly': {
    'justify-content': 'space-evenly',
  },
})
