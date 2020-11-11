import _ from 'lodash'
import nameClass from '../util/nameClass'

export default function () {
  return function ({ addUtilities, theme, variants }) {
    const defaultTimingFunction = theme('transitionTimingFunction.DEFAULT')
    const defaultDuration = theme('transitionDuration.DEFAULT')

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
