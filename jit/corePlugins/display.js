const { createSimpleStaticUtilityPlugin } = require('../pluginUtils')

module.exports = [
  createSimpleStaticUtilityPlugin({
    '.block': { display: 'block' },
    '.inline-block': { display: 'inline-block' },
    '.inline': { display: 'inline' },
    '.flex': { display: 'flex' },
    '.inline-flex': { display: 'inline-flex' },
    '.table': { display: 'table' },
    '.table-caption': { display: 'table-caption' },
    '.table-cell': { display: 'table-cell' },
    '.table-column': { display: 'table-column' },
    '.table-column-group': { display: 'table-column-group' },
    '.table-footer-group': { display: 'table-footer-group' },
    '.table-header-group': { display: 'table-header-group' },
    '.table-row-group': { display: 'table-row-group' },
    '.table-row': { display: 'table-row' },
    '.flow-root': { display: 'flow-root' },
    '.grid': { display: 'grid' },
    '.inline-grid': { display: 'inline-grid' },
    '.contents': { display: 'contents' },
  }),
  createSimpleStaticUtilityPlugin({
    '.hidden': { display: 'none' },
  }),
]
