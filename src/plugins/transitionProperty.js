import _ from 'lodash'
import nameClass from '../util/nameClass'

export default function () {
  return function ({ config, matchUtilities, addUtilities, theme, variants }) {
    const defaultTimingFunction = theme('transitionTimingFunction.DEFAULT')
    const defaultDuration = theme('transitionDuration.DEFAULT')

    if (config('mode') === 'jit') {
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
    } else {
      const utilities = _.fromPairs(
        _.map(theme('transitionProperty'), (value, modifier) => {
          return [
            nameClass('transition', modifier),
            {
              'transition-property': value,
              ...(value === 'none'
                ? {}
                : {
                    'transition-timing-function': defaultTimingFunction,
                    'transition-duration': defaultDuration,
                  }),
            },
          ]
        })
      )

      addUtilities(utilities, variants('transitionProperty'))
    }
  }
}
