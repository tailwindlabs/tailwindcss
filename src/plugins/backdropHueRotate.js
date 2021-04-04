import _ from 'lodash'
import nameClass from '../util/nameClass'

export default function () {
  return function ({ addUtilities, theme, variants }) {
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
