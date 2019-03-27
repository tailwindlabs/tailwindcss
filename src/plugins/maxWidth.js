import _ from 'lodash'

export default function() {
  return function({ addUtilities, config, e }) {
    const utilities = _.fromPairs(
      _.map(config('theme.maxWidth'), (value, modifier) => {
        return [
          `.${e(`${config('classesNames').maxWidth}-${modifier}`)}`,
          {
            'max-width': value,
          },
        ]
      })
    )

    addUtilities(utilities, config('variants.maxWidth'))
  }
}
