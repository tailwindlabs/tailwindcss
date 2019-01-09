import _ from 'lodash'

export default function () {
  return function ({ addUtilities, config }) {
    const utilities = _.fromPairs(_.map(config('zIndex'), (value, modifier) => {
      return [`.z-${modifier}`, {
        'z-index': value,
      }]
    }))

    addUtilities(utilities, config('modules.zIndex'))
  }
}
