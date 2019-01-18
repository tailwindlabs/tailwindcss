import _ from 'lodash'

export default function({ values, variants }) {
  return function({ addUtilities }) {
    const utilities = _.fromPairs(
      _.map(values, (value, modifier) => {
        return [
          `.z-${modifier}`,
          {
            'z-index': value,
          },
        ]
      })
    )

    addUtilities(utilities, variants)
  }
}
