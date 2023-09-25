const plugin = require('../../../plugin.js')

module.exports.default = plugin.withOptions(function ({ prefix = '' } = {}) {
  return function ({ addUtilities }) {
    addUtilities({
      [`.${prefix}example-1`]: {
        color: 'red',
      },
    })
  }
})
