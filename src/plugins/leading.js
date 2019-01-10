import _ from 'lodash'

export default function () {
  return function ({ addUtilities, config, e }) {
    const utilities = _.fromPairs(_.map(config('leading'), (value, modifier) => {
      return [`.${e(`leading-${modifier}`)}`, {
        'line-height': value,
      }]
    }))

    addUtilities(utilities, config('modules.leading'))
  }
}
