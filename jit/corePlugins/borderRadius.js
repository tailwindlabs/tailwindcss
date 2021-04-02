const { asLength, nameClass } = require('../pluginUtils')

module.exports = function ({ matchUtilities }) {
  matchUtilities({
    rounded: (modifier, { theme }) => {
      let value = asLength(modifier, theme['borderRadius'])

      if (value === undefined) {
        return []
      }

      return { [nameClass('rounded', modifier)]: { 'border-radius': value } }
    },
  })
  matchUtilities({
    'rounded-t': (modifier, { theme }) => {
      let value = asLength(modifier, theme['borderRadius'])

      if (value === undefined) {
        return []
      }

      return {
        [nameClass('rounded-t', modifier)]: {
          'border-top-left-radius': value,
          'border-top-right-radius': value,
        },
      }
    },
    'rounded-r': (modifier, { theme }) => {
      let value = asLength(modifier, theme['borderRadius'])

      if (value === undefined) {
        return []
      }

      return {
        [nameClass('rounded-r', modifier)]: {
          'border-top-right-radius': value,
          'border-bottom-right-radius': value,
        },
      }
    },
    'rounded-b': (modifier, { theme }) => {
      let value = asLength(modifier, theme['borderRadius'])

      if (value === undefined) {
        return []
      }

      return {
        [nameClass('rounded-b', modifier)]: {
          'border-bottom-right-radius': value,
          'border-bottom-left-radius': value,
        },
      }
    },
    'rounded-l': (modifier, { theme }) => {
      let value = asLength(modifier, theme['borderRadius'])

      if (value === undefined) {
        return []
      }

      return {
        [nameClass('rounded-l', modifier)]: {
          'border-top-left-radius': value,
          'border-bottom-left-radius': value,
        },
      }
    },
  })
  matchUtilities({
    'rounded-tl': (modifier, { theme }) => {
      let value = asLength(modifier, theme['borderRadius'])

      if (value === undefined) {
        return []
      }

      return { [nameClass('rounded-tl', modifier)]: { 'border-top-left-radius': value } }
    },
    'rounded-tr': (modifier, { theme }) => {
      let value = asLength(modifier, theme['borderRadius'])

      if (value === undefined) {
        return []
      }

      return { [nameClass('rounded-tr', modifier)]: { 'border-top-right-radius': value } }
    },
    'rounded-br': (modifier, { theme }) => {
      let value = asLength(modifier, theme['borderRadius'])

      if (value === undefined) {
        return []
      }

      return { [nameClass('rounded-br', modifier)]: { 'border-bottom-right-radius': value } }
    },
    'rounded-bl': (modifier, { theme }) => {
      let value = asLength(modifier, theme['borderRadius'])

      if (value === undefined) {
        return []
      }

      return { [nameClass('rounded-bl', modifier)]: { 'border-bottom-left-radius': value } }
    },
  })
}
