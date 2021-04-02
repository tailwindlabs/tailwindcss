const { asLength, nameClass } = require('../pluginUtils')

module.exports = function ({ matchUtilities, jit: { theme } }) {
  matchUtilities({
    gap: (modifier, { theme }) => {
      let value = asLength(modifier, theme['gap'])

      if (value === undefined) {
        return []
      }

      return { [nameClass('gap', modifier)]: { gap: value } }
    },
  })
  matchUtilities({
    'gap-x': (modifier, { theme }) => {
      let value = asLength(modifier, theme['gap'])

      if (value === undefined) {
        return []
      }

      return { [nameClass('gap-x', modifier)]: { 'column-gap': value } }
    },
    'gap-y': (modifier, { theme }) => {
      let value = asLength(modifier, theme['gap'])

      if (value === undefined) {
        return []
      }

      return { [nameClass('gap-y', modifier)]: { 'row-gap': value } }
    },
  })
}
