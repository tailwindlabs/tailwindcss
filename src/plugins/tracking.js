import _ from 'lodash'

export default function() {
  return function({ addUtilities, config }) {
    const utilities = _.fromPairs(
      _.map(config('tracking'), (value, modifier) => {
        return [
          `.tracking-${modifier}`,
          {
            'letter-spacing': value,
          },
        ]
      })
    )

    addUtilities(utilities, config('modules.tracking'))
  }
}
