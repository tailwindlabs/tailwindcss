const { nameClass } = require('../pluginUtils')

module.exports = function ({ matchUtilities, jit: { theme } }) {
  let defaultTimingFunction = theme.transitionTimingFunction.DEFAULT
  let defaultDuration = theme.transitionDuration.DEFAULT

  matchUtilities({
    transition: (modifier, { theme }) => {
      let value = theme.transitionProperty[modifier]

      if (value === undefined) {
        return []
      }

      return {
        [nameClass('transition', modifier)]: {
          'transition-property': value,
          ...(value === 'none'
            ? {}
            : {
                'transition-timing-function': defaultTimingFunction,
                'transition-duration': defaultDuration,
              }),
        },
      }
    },
  })
}
