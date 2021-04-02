const { nameClass } = require('../pluginUtils')

module.exports = function ({ matchUtilities }) {
  matchUtilities({
    list: (modifier, { theme }) => {
      if (modifier === '' || theme.listStyleType[modifier] === undefined) {
        return []
      }

      return { [nameClass('list', modifier)]: { 'list-style-type': theme.listStyleType[modifier] } }
    },
  })
}
