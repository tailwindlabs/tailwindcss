import _ from 'lodash'
import nameClass from '../util/nameClass'

export default function () {
  return function ({ addUtilities, theme, variants }) {
    const utilities = _.fromPairs(
      _.map(theme('backdropSaturate'), (value, modifier) => {
        return [
          nameClass('backdrop-saturate', modifier),
          {
            '--tw-backdrop-saturate': Array.isArray(value)
              ? value.map((v) => `saturate(${v})`).join(' ')
              : `saturate(${value})`,
          },
        ]
      })
    )

    addUtilities(utilities, variants('backdropSaturate'))
  }
}
