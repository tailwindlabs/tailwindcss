const { createSimpleStaticUtilityPlugin } = require('../pluginUtils')

module.exports = createSimpleStaticUtilityPlugin({
  '.justify-self-auto': {
    'justify-self': 'auto',
  },
  '.justify-self-start': {
    'justify-self': 'start',
  },
  '.justify-self-end': {
    'justify-self': 'end',
  },
  '.justify-self-center': {
    'justify-self': 'center',
  },
  '.justify-self-stretch': {
    'justify-self': 'stretch',
  },
})
