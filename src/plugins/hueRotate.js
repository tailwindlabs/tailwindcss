import _ from 'lodash'
import nameClass from '../util/nameClass'
import { asValue } from '../util/pluginUtils'

export default function () {
  return function ({ config, matchUtilities, addUtilities, theme, variants }) {
    if (config('mode') === 'jit') {
      matchUtilities({
        'hue-rotate': (modifier, { theme }) => {
          let value = asValue(modifier, theme.hueRotate)

          if (value === undefined) {
            return []
          }

          return {
            [nameClass('hue-rotate', modifier)]: { '--tw-hue-rotate': `hue-rotate(${value})` },
          }
        },
      })
    } else {
      const utilities = _.fromPairs(
        _.map(theme('hueRotate'), (value, modifier) => {
          return [
            nameClass('hue-rotate', modifier),
            {
              '--tw-hue-rotate': Array.isArray(value)
                ? value.map((v) => `hue-rotate(${v})`).join(' ')
                : `hue-rotate(${value})`,
            },
          ]
        })
      )

      addUtilities(utilities, variants('hueRotate'))
    }
  }
}
