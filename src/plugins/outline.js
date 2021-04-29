import _ from 'lodash'
import nameClass from '../util/nameClass'
import { asValue } from '../util/pluginUtils'

export default function () {
  return function ({ config, matchUtilities, addUtilities, theme, variants }) {
    if (config('mode') === 'jit') {
      matchUtilities({
        outline: (modifier, { theme }) => {
          let value = asValue(modifier, theme.outline)

          if (value === undefined) {
            return []
          }

          let [outline, outlineOffset = '0'] = Array.isArray(value) ? value : [value]

          return {
            [nameClass('outline', modifier)]: {
              outline,
              'outline-offset': outlineOffset,
            },
          }
        },
      })
    } else {
      const utilities = _.fromPairs(
        _.map(theme('outline'), (value, modifier) => {
          const [outline, outlineOffset = '0'] = Array.isArray(value) ? value : [value]

          return [
            nameClass('outline', modifier),
            {
              outline,
              outlineOffset,
            },
          ]
        })
      )

      addUtilities(utilities, variants('outline'))
    }
  }
}
