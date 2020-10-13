import _ from 'lodash'

export default function flattenColorPalette(colors) {
  const result = _(colors)
    .flatMap((color, name) => {
      if (_.isFunction(color) || !_.isObject(color)) {
        return [[name, color]]
      }

      return _.map(flattenColorPalette(color), (value, key) => {
        const suffix = key === 'default' ? '' : `-${key}`
        return [`${name}${suffix}`, value]
      })
    })
    .fromPairs()
    .value()

  return result
}
