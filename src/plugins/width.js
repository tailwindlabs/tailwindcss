import _ from 'lodash'

export default function () {
  return function ({ addUtilities, config, e }) {
    const utilities = _.fromPairs(_.map(config('width'), (value, modifier) => {
      return [`.${e(`w-${modifier}`)}`, {
        'width': value,
      }]
    }))

    addUtilities(utilities, config('modules.width'))
  }
}
