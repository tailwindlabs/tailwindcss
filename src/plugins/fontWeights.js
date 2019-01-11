import _ from 'lodash'

export default function() {
  return function({ addUtilities, config, e }) {
    const utilities = _.fromPairs(
      _.map(config('fontWeights'), (value, modifier) => {
        return [
          `.${e(`font-${modifier}`)}`,
          {
            'font-weight': value,
          },
        ]
      })
    )

    addUtilities(utilities, config('modules.fontWeights'))
  }
}
