import _ from 'lodash'
import nameClass from '../util/nameClass'
import { asValue } from '../util/pluginUtils'

export default function () {
  return function ({ config, matchUtilities, addUtilities, theme, variants }) {
    if (config('mode') === 'jit') {
      matchUtilities({
        'backdrop-opacity': (modifier, { theme }) => {
          let value = asValue(modifier, theme.backdropOpacity)

          if (value === undefined) {
            return []
          }

          return {
            [nameClass('backdrop-opacity', modifier)]: {
              '--tw-backdrop-opacity': `opacity(${value})`,
            },
          }
        },
      })
    } else {
      const utilities = _.fromPairs(
        _.map(theme('backdropOpacity'), (value, modifier) => {
          return [
            nameClass('backdrop-opacity', modifier),
            {
              '--tw-backdrop-opacity': Array.isArray(value)
                ? value.map((v) => `opacity(${v})`).join(' ')
                : `opacity(${value})`,
            },
          ]
        })
      )

      addUtilities(utilities, variants('backdropOpacity'))
    }
  }
}
