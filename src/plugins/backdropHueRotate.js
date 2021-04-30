import _ from 'lodash'
import nameClass from '../util/nameClass'
import { asValue } from '../util/pluginUtils'

export default function () {
  return function ({ config, matchUtilities, addUtilities, theme, variants }) {
    if (config('mode') === 'jit') {
      matchUtilities({
        'backdrop-hue-rotate': (modifier, { theme }) => {
          let value = asValue(modifier, theme.backdropHueRotate)

          if (value === undefined) {
            return []
          }

          return {
            [nameClass('backdrop-hue-rotate', modifier)]: {
              '--tw-backdrop-hue-rotate': `hue-rotate(${value})`,
            },
          }
        },
      })
    } else {
      const utilities = _.fromPairs(
        _.map(theme('backdropHueRotate'), (value, modifier) => {
          return [
            nameClass('backdrop-hue-rotate', modifier),
            {
              '--tw-backdrop-hue-rotate': Array.isArray(value)
                ? value.map((v) => `hue-rotate(${v})`).join(' ')
                : `hue-rotate(${value})`,
            },
          ]
        })
      )

      addUtilities(utilities, variants('backdropHueRotate'))
    }
  }
}
