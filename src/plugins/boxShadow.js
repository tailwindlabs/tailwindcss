import _ from 'lodash'
import transformThemeValue from '../util/transformThemeValue'
import nameClass from '../util/nameClass'

let transformValue = transformThemeValue('boxShadow')
let shadowReset = {
  '*': {
    '--tw-shadow': '0 0 #0000',
  },
}

export default function () {
  return function ({ config, matchUtilities, addBase, addUtilities, theme, variants }) {
    if (config('mode') === 'jit') {
      addBase(shadowReset)
      matchUtilities({
        shadow: (modifier, { theme }) => {
          let value = transformValue(theme.boxShadow[modifier])

          if (value === undefined) {
            return []
          }

          return [
            {
              [nameClass('shadow', modifier)]: {
                '--tw-shadow': value === 'none' ? '0 0 #0000' : value,
                'box-shadow': [
                  `var(--tw-ring-offset-shadow, 0 0 #0000)`,
                  `var(--tw-ring-shadow, 0 0 #0000)`,
                  `var(--tw-shadow)`,
                ].join(', '),
              },
            },
          ]
        },
      })
    } else {
      addUtilities(
        {
          '*': {
            '--tw-shadow': '0 0 #0000',
          },
        },
        { respectImportant: false }
      )

      const utilities = _.fromPairs(
        _.map(theme('boxShadow'), (value, modifier) => {
          return [
            nameClass('shadow', modifier),
            {
              '--tw-shadow': value === 'none' ? '0 0 #0000' : value,
              'box-shadow': [
                `var(--tw-ring-offset-shadow, 0 0 #0000)`,
                `var(--tw-ring-shadow, 0 0 #0000)`,
                `var(--tw-shadow)`,
              ].join(', '),
            },
          ]
        })
      )

      addUtilities(utilities, variants('boxShadow'))
    }
  }
}
