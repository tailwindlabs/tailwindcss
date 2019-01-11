import _ from 'lodash'

export default function() {
  return function({ addUtilities, config, e }) {
    const utilities = _.fromPairs(
      _.map(config('textColors'), (value, modifier) => {
        return [
          `.${e(`text-${modifier}`)}`,
          {
            color: value,
          },
        ]
      })
    )

    addUtilities(utilities, config('modules.textColors'))
  }
}
