import _ from 'lodash'

export default function () {
  return function ({ addUtilities, config, e }) {
    const utilities = _.fromPairs(_.map(config('maxHeight'), (value, modifier) => {
      return [`.${e(`max-h-${modifier}`)}`, {
        'max-height': value,
      }]
    }))

    addUtilities(utilities, config('modules.maxHeight'))
  }
}
