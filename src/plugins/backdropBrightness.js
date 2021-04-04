import _ from 'lodash'
import nameClass from '../util/nameClass'

export default function () {
  return function ({ addUtilities, theme, variants }) {
    const utilities = _.fromPairs(
      _.map(theme('backdropBrightness'), (value, modifier) => {
        return [
          nameClass('backdrop-brightness', modifier),
          {
            '--tw-backdrop-brightness': Array.isArray(value)
              ? value.map((v) => `brightness(${v})`).join(' ')
              : `brightness(${value})`,
          },
        ]
      })
    )

    addUtilities(utilities, variants('backdropBrightness'))
  }
}
