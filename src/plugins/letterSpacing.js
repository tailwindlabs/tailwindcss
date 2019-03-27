import _ from 'lodash'

export default function() {
  return function({ addUtilities, config, e }) {
    const utilities = _.fromPairs(
      _.map(config('theme.letterSpacing'), (value, modifier) => {
        return [
          `.${e(`${config('classesNames').letterSpacing}-${modifier}`)}`,
          {
            'letter-spacing': value,
          },
        ]
      })
    )

    addUtilities(utilities, config('variants.letterSpacing'))
  }
}
