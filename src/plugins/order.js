import _ from 'lodash'

export default function({ values, variants }) {
  return function({ addUtilities, e }) {
    addUtilities(
      _.fromPairs(
        _.map(values, (value, modifier) => {
          const className = modifier === 'default' ? 'order' : `order-${modifier}`
          return [
            `.${e(className)}`,
            {
              'order': value,
            },
          ]
        })
      ),
      variants
    )
  }
}
