const { createSimpleStaticUtilityPlugin } = require('../pluginUtils')

module.exports = createSimpleStaticUtilityPlugin({
  '.resize-none': { resize: 'none' },
  '.resize-y': { resize: 'vertical' },
  '.resize-x': { resize: 'horizontal' },
  '.resize': { resize: 'both' },
})
