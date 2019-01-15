import _ from 'lodash'

export default function() {
  return function({ addUtilities, config, e }) {
    const utilities = _.fromPairs(
      _.map(_.omit(config('borderColors'), 'default'), (value, modifier) => {
        return [
          `.${e(`border-${modifier}`)}`,
          {
            'border-color': value,
          },
        ]
      })
    )

    addUtilities(utilities, config('modules.borderColors'))
  }
}
