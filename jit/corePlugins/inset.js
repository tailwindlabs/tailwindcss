const { asValue, nameClass } = require('../pluginUtils')

module.exports = function ({ matchUtilities }) {
  matchUtilities({
    inset: (modifier, { theme }) => {
      let value = asValue(modifier, theme['inset'])

      if (value === undefined) {
        return []
      }

      return {
        [nameClass('inset', modifier)]: { top: value, right: value, bottom: value, left: value },
      }
    },
  })
  matchUtilities({
    'inset-x': (modifier, { theme }) => {
      let value = asValue(modifier, theme['inset'])

      if (value === undefined) {
        return []
      }

      return { [nameClass('inset-x', modifier)]: { left: value, right: value } }
    },
    'inset-y': (modifier, { theme }) => {
      let value = asValue(modifier, theme['inset'])

      if (value === undefined) {
        return []
      }

      return { [nameClass('inset-y', modifier)]: { top: value, bottom: value } }
    },
  })
  matchUtilities({
    top: (modifier, { theme }) => {
      let value = asValue(modifier, theme['inset'])

      if (value === undefined) {
        return []
      }

      return { [nameClass('top', modifier)]: { top: value } }
    },
    right: (modifier, { theme }) => {
      let value = asValue(modifier, theme['inset'])

      if (value === undefined) {
        return []
      }

      return { [nameClass('right', modifier)]: { right: value } }
    },
    bottom: (modifier, { theme }) => {
      let value = asValue(modifier, theme['inset'])

      if (value === undefined) {
        return []
      }

      return { [nameClass('bottom', modifier)]: { bottom: value } }
    },
    left: (modifier, { theme }) => {
      let value = asValue(modifier, theme['inset'])

      if (value === undefined) {
        return []
      }

      return { [nameClass('left', modifier)]: { left: value } }
    },
  })
}
