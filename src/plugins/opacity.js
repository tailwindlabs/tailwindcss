import _ from 'lodash'

export default function() {
  return function({ addUtilities, config, e }) {
    const utilities = _.fromPairs(
      _.map(config('theme.opacity'), (value, modifier) => {
        return [
          `.${e(`${config('classesNames').opacity}-${modifier}`)}`,
          {
            opacity: value,
          },
        ]
      })
    )

    addUtilities(utilities, config('variants.opacity'))
  }
}
