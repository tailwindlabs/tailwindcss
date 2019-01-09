import _ from 'lodash'

export default function () {
  return function ({ addUtilities, config, e }) {
    const utilities = _.fromPairs(_.map(config('opacity'), (value, modifier) => {
      return [`.${e(`opacity-${modifier}`)}`, {
        'opacity': value,
      }]
    }))

    addUtilities(utilities, config('modules.opacity'))
  }
}
