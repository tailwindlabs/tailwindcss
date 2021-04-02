const { createSimpleStaticUtilityPlugin } = require('../pluginUtils')

module.exports = createSimpleStaticUtilityPlugin({
  '.overflow-auto': { overflow: 'auto' },
  '.overflow-hidden': { overflow: 'hidden' },
  '.overflow-visible': { overflow: 'visible' },
  '.overflow-scroll': { overflow: 'scroll' },
  '.overflow-x-auto': { 'overflow-x': 'auto' },
  '.overflow-y-auto': { 'overflow-y': 'auto' },
  '.overflow-x-hidden': { 'overflow-x': 'hidden' },
  '.overflow-y-hidden': { 'overflow-y': 'hidden' },
  '.overflow-x-visible': { 'overflow-x': 'visible' },
  '.overflow-y-visible': { 'overflow-y': 'visible' },
  '.overflow-x-scroll': { 'overflow-x': 'scroll' },
  '.overflow-y-scroll': { 'overflow-y': 'scroll' },
})
