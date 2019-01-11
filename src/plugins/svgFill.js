import _ from 'lodash'

export default function() {
  return function({ addUtilities, config, e }) {
    const utilities = _.fromPairs(
      _.map(config('svgFill'), (value, modifier) => {
        return [
          `.${e(`fill-${modifier}`)}`,
          {
            fill: value,
          },
        ]
      })
    )

    addUtilities(utilities, config('modules.svgFill'))
  }
}
