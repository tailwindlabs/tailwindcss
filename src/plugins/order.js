import _ from 'lodash'

export default function({ values, variants }) {
  return function({ addUtilities }) {
    const utilities = _.fromPairs(
      _.map(values, (value, modifier) => {
        return [
          `.order-${modifier}`,
          {
            'order': value,
          },
        ]
      })
    )

    addUtilities(utilities, variants)
  }
}
