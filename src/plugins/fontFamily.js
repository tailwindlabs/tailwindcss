import _ from 'lodash'

export default function() {
  return function({ addUtilities, config, e }) {
    const utilities = _.fromPairs(
      _.map(config('theme.fontFamily'), (value, modifier) => {
        return [
          `.${e(`${config('classesNames').fontFamily}-${modifier}`)}`,
          {
            'font-family': _.isArray(value) ? value.join(', ') : value,
          },
        ]
      })
    )

    addUtilities(utilities, config('variants.fontFamily'))
  }
}
