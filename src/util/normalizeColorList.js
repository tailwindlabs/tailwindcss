import _ from 'lodash'
import defineClass from './defineClass'
import findColor from './findColor'

export default function (colors, colorPool) {
  if (_.isArray(colors)) {
    colors = _(colors).flatMap(color => {
      if (_.isString(color)) {
        return [[color, color]]
      }
      return _.toPairs(color)
    }).fromPairs().value()
  }

  return _.mapValues(colors, (color) => {
    return findColor(colorPool, color)
  })
}
