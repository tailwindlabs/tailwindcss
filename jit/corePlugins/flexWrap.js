const { createSimpleStaticUtilityPlugin } = require('../pluginUtils')

module.exports = createSimpleStaticUtilityPlugin({
  '.flex-wrap': {
    'flex-wrap': 'wrap',
  },
  '.flex-wrap-reverse': {
    'flex-wrap': 'wrap-reverse',
  },
  '.flex-nowrap': {
    'flex-wrap': 'nowrap',
  },
})
