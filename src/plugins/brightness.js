import _ from 'lodash'
import nameClass from '../util/nameClass'
import { asValue } from '../util/pluginUtils'

export default function () {
  return function ({ config, matchUtilities, addUtilities, theme, variants }) {
    if (config('mode') === 'jit') {
      matchUtilities({
        brightness: (modifier, { theme }) => {
          let value = asValue(modifier, theme.brightness)

          if (value === undefined) {
            return []
          }

          return {
            [nameClass('brightness', modifier)]: { '--tw-brightness': `brightness(${value})` },
          }
        },
      })
    } else {
      const utilities = _.fromPairs(
        _.map(theme('brightness'), (value, modifier) => {
          return [
            nameClass('brightness', modifier),
            {
              '--tw-brightness': Array.isArray(value)
                ? value.map((v) => `brightness(${v})`).join(' ')
                : `brightness(${value})`,
            },
          ]
        })
      )

      addUtilities(utilities, variants('brightness'))
    }
  }
}
