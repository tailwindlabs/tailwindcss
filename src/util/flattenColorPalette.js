import _ from 'lodash'

export default function flattenColorPalette(colors) {
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
