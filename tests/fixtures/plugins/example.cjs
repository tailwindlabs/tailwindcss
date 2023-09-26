const plugin = require('../../../plugin.js')

module.exports = plugin.withOptions(function ({ prefix = '' } = {}) {
  return function ({ addUtilities }) {
    addUtilities({
      [`.${prefix}example-1`]: {
        color: 'red',
      },
    })
  }
})
