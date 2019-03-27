import _ from 'lodash'

export default function() {
  return function({ addUtilities, config, e }) {
    const fontWeight = config('classesNames').fontWeight

    const utilities = _.fromPairs(
      _.map(config('theme.fontWeight'), (value, modifier) => {
        return [
          `.${e(`${fontWeight}-${modifier}`)}`,
          {
            'font-weight': value,
          },
        ]
      })
    )

    addUtilities(utilities, config('variants.fontWeight'))
  }
}
