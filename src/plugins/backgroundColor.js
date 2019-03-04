import _ from 'lodash'

function buildColorPalette(colors) {
  const result = _(colors)
    .flatMap((color, name) => {
      return _.isObject(color)
        ? _.map(color, (value, key) => [`${name}-${key}`, value])
        : [[name, color]]
    })
    .fromPairs()
    .value()

  return result
}

export default function() {
  return function({ addUtilities, e, config }) {
    const utilities = _.fromPairs(
      _.map(buildColorPalette(config('theme.backgroundColor')), (value, modifier) => {
        return [
          `.${e(`bg-${modifier}`)}`,
          {
            'background-color': value,
          },
        ]
      })
    )

    addUtilities(utilities, config('variants.backgroundColor'))
  }
}
