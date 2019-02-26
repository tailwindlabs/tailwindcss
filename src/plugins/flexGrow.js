import _ from 'lodash'

export default function({ values, variants }) {
  return function({ addUtilities, e }) {
    addUtilities(
      _.fromPairs(
        _.map(values, (value, modifier) => {
          const className = modifier === 'default' ? 'flex-grow' : `flex-grow-${modifier}`
          return [
            `.${e(className)}`,
            {
              'flex-grow': value,
            },
          ]
        })
      ),
      variants
    )
  }
}
