const { createSimpleStaticUtilityPlugin } = require('../pluginUtils')

module.exports = createSimpleStaticUtilityPlugin({
  '.grid-cols-1': { gridTemplateColumns: 'repeat(1, minmax(0, 1fr))' },
  '.grid-cols-2': { gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' },
  '.grid-cols-3': { gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' },
  '.grid-cols-4': { gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' },
  '.grid-cols-5': { gridTemplateColumns: 'repeat(5, minmax(0, 1fr))' },
  '.grid-cols-6': { gridTemplateColumns: 'repeat(6, minmax(0, 1fr))' },
  '.grid-cols-7': { gridTemplateColumns: 'repeat(7, minmax(0, 1fr))' },
  '.grid-cols-8': { gridTemplateColumns: 'repeat(8, minmax(0, 1fr))' },
  '.grid-cols-9': { gridTemplateColumns: 'repeat(9, minmax(0, 1fr))' },
  '.grid-cols-10': { gridTemplateColumns: 'repeat(10, minmax(0, 1fr))' },
  '.grid-cols-11': { gridTemplateColumns: 'repeat(11, minmax(0, 1fr))' },
  '.grid-cols-12': { gridTemplateColumns: 'repeat(12, minmax(0, 1fr))' },
  '.grid-cols-none': { gridTemplateColumns: 'none' } 
})
