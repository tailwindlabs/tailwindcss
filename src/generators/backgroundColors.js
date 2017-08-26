import _ from 'lodash'
import defineClass from '../util/defineClass'
import findColor from '../util/findColor'

export default function({colors, backgroundColors}) {
  if (_.isArray(backgroundColors)) {
    backgroundColors = _(backgroundColors)
      .flatMap(color => {
        if (_.isString(color)) {
          return [[color, color]]
        }
        return _.toPairs(color)
      })
      .fromPairs()
  }

  return _(backgroundColors)
    .toPairs()
    .map(([className, colorName]) => {
      return defineClass(`bg-${className}`, {
        backgroundColor: findColor(colors, colorName),
      })
    })
    .value()
}
