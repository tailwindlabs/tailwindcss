import _ from 'lodash'
import nameClass from '../util/nameClass'
import { asValue } from '../util/pluginUtils'

export default function () {
  return function ({ config, matchUtilities, addUtilities, theme, variants }) {
    if (config('mode') === 'jit') {
      matchUtilities({
        saturate: (modifier, { theme }) => {
          let value = asValue(modifier, theme.saturate)

          if (value === undefined) {
            return []
          }

          return {
            [nameClass('saturate', modifier)]: { '--tw-saturate': `saturate(${value})` },
          }
        },
      })
    } else {
      const utilities = _.fromPairs(
        _.map(theme('saturate'), (value, modifier) => {
          return [
            nameClass('saturate', modifier),
            {
              '--tw-saturate': Array.isArray(value)
                ? value.map((v) => `saturate(${v})`).join(' ')
                : `saturate(${value})`,
            },
          ]
        })
      )

      addUtilities(utilities, variants('saturate'))
    }
  }
}
