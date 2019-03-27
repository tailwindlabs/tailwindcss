import _ from 'lodash'

export default function() {
  return function({ addUtilities, config, e }) {
    const utilities = _.fromPairs(
      _.map(config('theme.height'), (value, modifier) => {
        return [
          `.${e(`${config('classesNames').height}-${modifier}`)}`,
          {
            height: value,
          },
        ]
      })
    )

    addUtilities(utilities, config('variants.height'))
  }
}
