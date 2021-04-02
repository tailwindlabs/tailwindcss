const { createSimpleStaticUtilityPlugin } = require('../pluginUtils')

module.exports = createSimpleStaticUtilityPlugin({
  '.static': { position: 'static' },
  '.fixed': { position: 'fixed' },
  '.absolute': { position: 'absolute' },
  '.relative': { position: 'relative' },
  '.sticky': {
    position: 'sticky',
  },
})
