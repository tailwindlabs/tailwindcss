import _ from 'lodash'

export default function() {
  return function({ addUtilities, e, config }) {
    const utilities = _.fromPairs(
      _.map(config('theme.listStyleType'), (value, modifier) => {
        return [
          `.${e(`list-${modifier}`)}`,
          {
            'list-style-type': value,
          },
        ]
      })
    )

    addUtilities(utilities, config('variants.listStyleType'))
  }
}
