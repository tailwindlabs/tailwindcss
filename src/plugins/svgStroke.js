import _ from 'lodash'

export default function () {
  return function ({ addUtilities, config, e }) {
    const utilities = _.fromPairs(_.map(config('svgStroke'), (value, modifier) => {
      return [`.${e(`stroke-${modifier}`)}`, {
        'stroke': value,
      }]
    }))

    addUtilities(utilities, config('modules.svgStroke'))
  }
}
