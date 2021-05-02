import _ from 'lodash'
import { withAlphaValue } from '../util/withAlphaVariable'
import nameClass from '../util/nameClass'
import { asLength } from '../util/pluginUtils'

export default function () {
  return function ({ config, matchUtilities, addBase, addUtilities, theme, variants }) {
    const ringOpacityDefault = theme('ringOpacity.DEFAULT', '0.5')
    const ringColorDefault = withAlphaValue(
      theme('ringColor.DEFAULT'),
      ringOpacityDefault,
      `rgba(147, 197, 253, ${ringOpacityDefault})`
    )

    if (config('mode') === 'jit') {
      let ringReset = {
        '*': {
          '--tw-ring-inset': 'var(--tw-empty,/*!*/ /*!*/)',
          '--tw-ring-offset-width': theme('ringOffsetWidth.DEFAULT', '0px'),
          '--tw-ring-offset-color': theme('ringOffsetColor.DEFAULT', '#fff'),
          '--tw-ring-color': ringColorDefault,
          '--tw-ring-offset-shadow': '0 0 #0000',
          '--tw-ring-shadow': '0 0 #0000',
        },
      }

      addBase(ringReset)

      matchUtilities({
        ring: (modifier, { theme }) => {
          let value = asLength(modifier, theme['ringWidth'])

          if (value === undefined) {
            return []
          }

          return [
            {
              [nameClass('ring', modifier)]: {
                '--tw-ring-offset-shadow': `var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color)`,
                '--tw-ring-shadow': `var(--tw-ring-inset) 0 0 0 calc(${value} + var(--tw-ring-offset-width)) var(--tw-ring-color)`,
                'box-shadow': [
                  `var(--tw-ring-offset-shadow)`,
                  `var(--tw-ring-shadow)`,
                  `var(--tw-shadow, 0 0 #0000)`,
                ].join(', '),
              },
            },
          ]
        },
      })

      addUtilities({
        '.ring-inset': {
          '--tw-ring-inset': 'inset',
        },
      })
    } else {
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
}
