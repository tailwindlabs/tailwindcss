const { asValue, nameClass } = require('../pluginUtils')

module.exports = function ({ matchUtilities }) {
  matchUtilities({
    m: (modifier, { theme }) => {
      let value = asValue(modifier, theme['margin'])

      if (value === undefined) {
        return []
      }

      return { [nameClass('m', modifier)]: { margin: value } }
    },
  })
  matchUtilities({
    mx: (modifier, { theme }) => {
      let value = asValue(modifier, theme['margin'])

      if (value === undefined) {
        return []
      }

      return { [nameClass('mx', modifier)]: { 'margin-left': value, 'margin-right': value } }
    },
    my: (modifier, { theme }) => {
      let value = asValue(modifier, theme['margin'])

      if (value === undefined) {
        return []
      }

      return { [nameClass('my', modifier)]: { 'margin-top': value, 'margin-bottom': value } }
    },
  })
  matchUtilities({
    mt: (modifier, { theme }) => {
      let value = asValue(modifier, theme['margin'])

      if (value === undefined) {
        return []
      }

      return { [nameClass('mt', modifier)]: { 'margin-top': value } }
    },
    mr: (modifier, { theme }) => {
      let value = asValue(modifier, theme['margin'])

      if (value === undefined) {
        return []
      }

      return { [nameClass('mr', modifier)]: { 'margin-right': value } }
    },
    mb: (modifier, { theme }) => {
      let value = asValue(modifier, theme['margin'])

      if (value === undefined) {
        return []
      }

      return { [nameClass('mb', modifier)]: { 'margin-bottom': value } }
    },
    ml: (modifier, { theme }) => {
      let value = asValue(modifier, theme['margin'])

      if (value === undefined) {
        return []
      }

      return { [nameClass('ml', modifier)]: { 'margin-left': value } }
    },
  })
}
