import _ from 'lodash'

export default function () {
  return function ({ addUtilities, config, e }) {
    const utilities = _.fromPairs(_.map(config('textSizes'), (value, modifier) => {
      return [`.${e(`text-${modifier}`)}`, {
        'font-size': value,
      }]
    }))

    addUtilities(utilities, config('modules.textSizes'))
  }
}
