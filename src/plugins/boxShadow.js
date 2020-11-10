import _ from 'lodash'
import nameClass from '../util/nameClass'

export default function () {
  return function ({ addUtilities, theme, variants }) {
    const utilities = _.fromPairs(
      _.map(theme('boxShadow'), (value, modifier) => {
        return [
          nameClass('shadow', modifier),
          {
            '--box-shadow': value === 'none' ? '0 0 #0000' : value,
            'box-shadow': [
              `var(--ring-offset-shadow, 0 0 #0000)`,
              `var(--ring-shadow, 0 0 #0000)`,
              `var(--box-shadow)`,
            ].join(', '),
          },
        ]
      })
    )

    addUtilities(utilities, variants('boxShadow'))
  }
}
