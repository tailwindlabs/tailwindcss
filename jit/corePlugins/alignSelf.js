const { createSimpleStaticUtilityPlugin } = require('../pluginUtils')

module.exports = createSimpleStaticUtilityPlugin({
  '.self-auto': {
    'align-self': 'auto',
  },
  '.self-start': {
    'align-self': 'flex-start',
  },
  '.self-end': {
    'align-self': 'flex-end',
  },
  '.self-center': {
    'align-self': 'center',
  },
  '.self-stretch': {
    'align-self': 'stretch',
  },
})
