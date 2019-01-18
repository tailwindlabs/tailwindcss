import _ from 'lodash'

export default function({ values, variants }) {
  return function({ addUtilities, e }) {
    const utilities = _.fromPairs(
      _.map(_.omit(values, 'default'), (value, modifier) => {
        return [
          `.${e(`border-${modifier}`)}`,
          {
            'border-color': value,
          },
        ]
      })
    )

    addUtilities(utilities, variants)
  }
}
