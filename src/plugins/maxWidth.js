import _ from 'lodash'

export default function () {
  return function ({ addUtilities, config, e }) {
    const utilities = _.fromPairs(_.map(config('maxWidth'), (value, modifier) => {
      return [`.${e(`max-w-${modifier}`)}`, {
        'max-width': value,
      }]
    }))

    addUtilities(utilities, config('modules.maxWidth'))
  }
}
