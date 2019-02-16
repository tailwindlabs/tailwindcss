import _ from 'lodash'

export default function({ values, variants }) {
  return function({ addUtilities }) {
    const utilities = _.fromPairs(
      _.map(values, (value, modifier) => {
        return [
          `.tracking-${modifier}`,
          {
            'letter-spacing': value,
          },
        ]
      })
    )

    addUtilities(utilities, variants)
  }
}
