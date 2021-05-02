import _ from 'lodash'
import nameClass from '../util/nameClass'
import { asValue } from '../util/pluginUtils'

export default function () {
  return function ({ config, matchUtilities, addUtilities, theme, variants }) {
    if (config('mode') === 'jit') {
      matchUtilities({
        invert: (modifier, { theme }) => {
          let value = asValue(modifier, theme.invert)

          if (value === undefined) {
            return []
          }

          return {
            [nameClass('invert', modifier)]: { '--tw-invert': `invert(${value})` },
          }
        },
      })
    } else {
      const utilities = _.fromPairs(
        _.map(theme('invert'), (value, modifier) => {
          return [
            nameClass('invert', modifier),
            {
              '--tw-invert': Array.isArray(value)
                ? value.map((v) => `invert(${v})`).join(' ')
                : `invert(${value})`,
            },
          ]
        })
      )

      addUtilities(utilities, variants('invert'))
    }
  }
}
