import _ from 'lodash'
import nameClass from '../util/nameClass'

export default function () {
  return function ({ addUtilities, theme, variants }) {
    const utilities = _.fromPairs(
      _.map(theme('backdropSepia'), (value, modifier) => {
        return [
          nameClass('backdrop-sepia', modifier),
          {
            '--tw-backdrop-sepia': Array.isArray(value)
              ? value.map((v) => `sepia(${v})`).join(' ')
              : `sepia(${value})`,
          },
        ]
      })
    )

    addUtilities(utilities, variants('backdropSepia'))
  }
}
