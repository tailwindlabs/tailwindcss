import _ from 'lodash'
import nameClass from '../util/nameClass'

export default function () {
  return function ({ addUtilities, theme, variants }) {
    const utilities = _.fromPairs(
      _.map(theme('dropShadow'), (value, modifier) => {
        return [
          nameClass('drop-shadow', modifier),
          {
            '--tw-drop-shadow': Array.isArray(value)
              ? value.map((v) => `drop-shadow(${v})`).join(' ')
              : `drop-shadow(${value})`,
            '@defaults filter': {},
            filter: 'var(--tw-filter)',
          },
        ]
      })
    )

    addUtilities(utilities, variants('dropShadow'))
  }
}
