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

    addUtilities(
      {
        '*': {
          '--tw-ring-inset': 'var(--tw-empty,/*!*/ /*!*/)',
          '--tw-ring-offset-width': theme('ringOffsetWidth.DEFAULT', '0px'),
          '--tw-ring-offset-color': theme('ringOffsetColor.DEFAULT', '#fff'),
          '--tw-ring-color': ringColorDefault,
          '--tw-ring-offset-shadow': '0 0 #0000',
          '--tw-ring-shadow': '0 0 #0000',
        },
      },
      { respectImportant: false }
    )

    const utilities = _.fromPairs(
      _.map(theme('ringWidth'), (value, modifier) => {
        return [
          nameClass('ring', modifier),
          {
            '--tw-ring-offset-shadow': `var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color)`,
            '--tw-ring-shadow': `var(--tw-ring-inset) 0 0 0 calc(${value} + var(--tw-ring-offset-width)) var(--tw-ring-color)`,
            'box-shadow': [
              `var(--tw-ring-offset-shadow)`,
              `var(--tw-ring-shadow)`,
              `var(--tw-shadow, 0 0 #0000)`,
            ].join(', '),
          },
        ]
      })
    )
    addUtilities(
      [
        utilities,
        {
          '.ring-inset': {
            '--tw-ring-inset': 'inset',
          },
        },
      ],
      variants('ringWidth')
    )
  }
}
