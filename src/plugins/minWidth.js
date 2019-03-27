import _ from 'lodash'

export default function() {
  return function({ addUtilities, config, e }) {
    const utilities = _.fromPairs(
      _.map(config('theme.minWidth'), (value, modifier) => {
        return [
          `.${e(`${config('classesNames').minWidth}-${modifier}`)}`,
          {
            'min-width': value,
          },
        ]
      })
    )

    addUtilities(utilities, config('variants.minWidth'))
  }
}
