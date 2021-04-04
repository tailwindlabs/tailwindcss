import _ from 'lodash'
import nameClass from '../util/nameClass'

export default function () {
  return function ({ addUtilities, theme, variants }) {
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
