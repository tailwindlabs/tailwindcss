import _ from 'lodash'

export default function() {
  return function({ addUtilities, config, e }) {
    const utilities = _.fromPairs(
      _.map(config('theme.width'), (value, modifier) => {
        return [
          `.${e(`${config('classesNames').width}-${modifier}`)}`,
          {
            width: value,
          },
        ]
      })
    )

    addUtilities(utilities, config('variants.width'))
  }
}
