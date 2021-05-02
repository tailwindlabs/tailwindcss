import _ from 'lodash'
import nameClass from '../util/nameClass'
import { asValue } from '../util/pluginUtils'

export default function () {
  return function ({ config, matchUtilities, addUtilities, theme, variants }) {
    if (config('mode') === 'jit') {
      matchUtilities({
        'backdrop-contrast': (modifier, { theme }) => {
          let value = asValue(modifier, theme.backdropContrast)

          if (value === undefined) {
            return []
          }

          return {
            [nameClass('backdrop-contrast', modifier)]: {
              '--tw-backdrop-contrast': `contrast(${value})`,
            },
          }
        },
      })
    } else {
      const utilities = _.fromPairs(
        _.map(theme('backdropContrast'), (value, modifier) => {
          return [
            nameClass('backdrop-contrast', modifier),
            {
              '--tw-backdrop-contrast': Array.isArray(value)
                ? value.map((v) => `contrast(${v})`).join(' ')
                : `contrast(${value})`,
            },
          ]
        })
      )

      addUtilities(utilities, variants('backdropContrast'))
    }
  }
}
