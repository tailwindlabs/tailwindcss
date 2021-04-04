import _ from 'lodash'
import nameClass from '../util/nameClass'

export default function () {
  return function ({ addUtilities, theme, variants }) {
    const utilities = _.fromPairs(
      _.map(theme('backdropBlur'), (value, modifier) => {
        return [
          nameClass('backdrop-blur', modifier),
          {
            '--tw-backdrop-blur': Array.isArray(value)
              ? value.map((v) => `blur(${v})`).join(' ')
              : `blur(${value})`,
          },
        ]
      })
    )

    addUtilities(utilities, variants('backdopBlur'))
  }
}
