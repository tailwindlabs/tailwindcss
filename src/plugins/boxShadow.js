import _ from 'lodash'
import nameClass from '../util/nameClass'

export default function () {
  return function ({ addUtilities, theme, variants }) {
    addUtilities(
      {
        '*': {
          '--tw-shadow': '0 0 #0000',
        },
      },
      { respectImportant: false }
    )

    const utilities = _.fromPairs(
      _.map(theme('boxShadow'), (value, modifier) => {
        return [
          nameClass('shadow', modifier),
          {
            '--tw-shadow': value === 'none' ? '0 0 #0000' : value,
            'box-shadow': [
              `var(--tw-ring-offset-shadow, 0 0 #0000)`,
              `var(--tw-ring-shadow, 0 0 #0000)`,
              `var(--tw-shadow)`,
            ].join(', '),
          },
        ]
      })
    )

    addUtilities(utilities, variants('boxShadow'))
  }
}
