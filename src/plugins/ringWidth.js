import _ from 'lodash'
import nameClass from '../util/nameClass'
import { toRgba } from '../util/withAlphaVariable'

export default function () {
  return function ({ addUtilities, theme, variants }) {
    function safeCall(callback, defaultValue) {
      try {
        return callback()
      } catch (_error) {
        return defaultValue
      }
    }

    const ringColorDefault = (([r, g, b]) => {
      return `rgba(${r}, ${g}, ${b}, ${theme('ringOpacity.DEFAULT', '0.5')})`
    })(safeCall(() => toRgba(theme('ringColor.DEFAULT')), ['147', '197', '253']))

    const utilities = _.fromPairs(
      _.map(theme('ringWidth'), (value, modifier) => {
        return [
          nameClass('ring', modifier),
          {
            '--ring-offset-shadow': `0 0 0 var(--ring-offset-width, 0) var(--ring-offset-color, #fff)`,
            '--ring-shadow': `0 0 0 calc(${value} + var(--ring-offset-width, 0px)) var(--ring-color, ${ringColorDefault})`,
            'box-shadow': [
              `var(--ring-offset-shadow)`,
              `var(--ring-shadow)`,
              `var(--box-shadow, 0 0 #0000)`,
            ].join(', '),
          },
        ]
      })
    )
    addUtilities(utilities, variants('ringWidth'))
  }
}
