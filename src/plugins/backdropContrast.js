import _ from 'lodash'
import nameClass from '../util/nameClass'

export default function () {
  return function ({ addUtilities, theme, variants }) {
    const utilities = _.fromPairs(
      _.map(theme('backdropContrast'), (value, modifier) => {
        return [
          nameClass('backdrop-contrast', modifier),
          {
            '--tw-backdrop-contrast': Array.isArray(value)
              ? value.map((v) => `contrast(${v})`).join(' ')
              : `contrast(${value})`,
          },
        ]
      })
    )

    addUtilities(utilities, variants('backdropContrast'))
  }
}
