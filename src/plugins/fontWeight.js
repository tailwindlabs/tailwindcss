import _ from 'lodash'

export default function() {
  return function({ addUtilities, e, config, variants }) {
    const utilities = _.fromPairs(
      _.map(config('theme.fontWeight'), (value, modifier) => {
        return [
          `.${e(`font-${modifier}`)}`,
          {
            'font-weight': value,
          },
        ]
      })
    )

    addUtilities(utilities, variants('fontWeight'))
  }
}
