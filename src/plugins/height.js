import _ from 'lodash'

export default function () {
  return function ({ addUtilities, config, e }) {
    const utilities = _.fromPairs(_.map(config('height'), (value, modifier) => {
      return [`.${e(`h-${modifier}`)}`, {
        'height': value,
      }]
    }))

    addUtilities(utilities, config('modules.height'))
  }
}
