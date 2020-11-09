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
            '--ring-width': value,
            '--ring-color-default': ringColorDefault,
            'box-shadow': [
              `0 0 0 var(--ring-offset-width, 0) var(--ring-offset-color, #fff)`,
              `0 0 0 calc(var(--ring-width) + var(--ring-offset-width, 0px)) var(--ring-color, var(--ring-color-default))`,
              `var(--box-shadow, 0 0 #0000)`,
            ].join(', '),
          },
        ]
      })
    )
    addUtilities(utilities, variants('ringWidth'))
  }
}
