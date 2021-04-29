import _ from 'lodash'
import nameClass from '../util/nameClass'
import { asValue } from '../util/pluginUtils'

export default function () {
  return function ({ config, matchUtilities, addUtilities, theme, variants }) {
    if (config('mode') === 'jit') {
      matchUtilities({
        'divide-opacity': (modifier, { theme }) => {
          let value = asValue(modifier, theme.divideOpacity)

          if (value === undefined) {
            return []
          }

          return {
            [`${nameClass('divide-opacity', modifier)} > :not([hidden]) ~ :not([hidden])`]: {
              '--tw-divide-opacity': value,
            },
          }
        },
      })
    } else {
      const utilities = _.fromPairs(
        _.map(theme('divideOpacity'), (value, modifier) => {
          return [
            `${nameClass('divide-opacity', modifier)} > :not([hidden]) ~ :not([hidden])`,
            {
              '--tw-divide-opacity': value,
            },
          ]
        })
      )

      addUtilities(utilities, variants('divideOpacity'))
    }
  }
}
