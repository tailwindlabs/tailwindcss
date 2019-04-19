import _ from 'lodash'

export default colors =>
  _(colors)
    .flatMap((color, name) => {
      if (!_.isObject(color)) {
        return [[name, color]]
      }

      return _.map(color, (value, key) => {
        const suffix = key === 'default' ? '' : `-${key}`

        return [`${name}${suffix}`, value]
      })
    })
    .fromPairs()
    .value()
