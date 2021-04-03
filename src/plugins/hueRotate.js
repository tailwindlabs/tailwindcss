import _ from 'lodash'
import nameClass from '../util/nameClass'

export default function () {
  return function ({ addUtilities, theme, variants }) {
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
