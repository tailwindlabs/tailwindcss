import _ from 'lodash'

export default function () {
  return function ({ addUtilities, config, e }) {
    const utilities = _.fromPairs(_.map(config('backgroundColors'), (value, modifier) => {
      return [`.${e(`bg-${modifier}`)}`, {
        'background-color': value,
      }]
    }))

    addUtilities(utilities, config('modules.backgroundColors'))
  }
}
