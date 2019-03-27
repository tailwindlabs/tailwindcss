import _ from 'lodash'

export default function() {
  return function({ addUtilities, config, e }) {
    const utilities = _.fromPairs(
      _.map(config('theme.backgroundSize'), (value, modifier) => {
        return [
          `.${e(`${config('classesNames').backgroundSize}-${modifier}`)}`,
          {
            'background-size': value,
          },
        ]
      })
    )

    addUtilities(utilities, config('variants.backgroundSize'))
  }
}
