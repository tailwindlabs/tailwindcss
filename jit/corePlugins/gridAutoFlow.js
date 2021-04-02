const { createSimpleStaticUtilityPlugin } = require('../pluginUtils')

module.exports = createSimpleStaticUtilityPlugin({
  '.grid-flow-row': { gridAutoFlow: 'row' },
  '.grid-flow-col': { gridAutoFlow: 'column' },
  '.grid-flow-row-dense': { gridAutoFlow: 'row dense' },
  '.grid-flow-col-dense': { gridAutoFlow: 'column dense' },
})
