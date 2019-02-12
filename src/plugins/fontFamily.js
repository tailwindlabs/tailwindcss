import _ from 'lodash'

export default function({ values, variants }) {
  return function({ addUtilities, e }) {
    const utilities = _.fromPairs(
      _.map(values, (value, modifier) => {
        return [
          `.${e(`font-${modifier}`)}`,
          {
            'font-family': _.isArray(value) ? value.join(', ') : value,
          },
        ]
      })
    )

    addUtilities(utilities, variants)
  }
}
