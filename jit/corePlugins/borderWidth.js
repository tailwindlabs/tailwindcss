const { asLength, nameClass } = require('../pluginUtils')

module.exports = function ({ matchUtilities }) {
  matchUtilities({
    border: (modifier, { theme }) => {
      let value = asLength(modifier, theme['borderWidth'])

      if (value === undefined) {
        return []
      }

      return { [nameClass('border', modifier)]: { 'border-width': value } }
    },
  })
  matchUtilities({
    'border-t': (modifier, { theme }) => {
      let value = asLength(modifier, theme['borderWidth'])

      if (value === undefined) {
        return []
      }

      return { [nameClass('border-t', modifier)]: { 'border-top-width': value } }
    },
    'border-r': (modifier, { theme }) => {
      let value = asLength(modifier, theme['borderWidth'])

      if (value === undefined) {
        return []
      }

      return { [nameClass('border-r', modifier)]: { 'border-right-width': value } }
    },
    'border-b': (modifier, { theme }) => {
      let value = asLength(modifier, theme['borderWidth'])

      if (value === undefined) {
        return []
      }

      return { [nameClass('border-b', modifier)]: { 'border-bottom-width': value } }
    },
    'border-l': (modifier, { theme }) => {
      let value = asLength(modifier, theme['borderWidth'])

      if (value === undefined) {
        return []
      }

      return { [nameClass('border-l', modifier)]: { 'border-left-width': value } }
    },
  })
}
