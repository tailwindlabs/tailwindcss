import _ from 'lodash'
import defineClasses from '../util/defineClasses'

export default function({ backgroundColors }) {
  return _.compact(
    _.flatMap(backgroundColors, (startColor, startClassName) => {
      return _.flatMap(backgroundColors, (endColor, endClassName) => {
        if (startClassName === endClassName) {
          return false
        }

        return defineClasses({
          [`bg-gradient-y-${startClassName}-to-${endClassName}`]: {
            'background-color': `linear-gradient(${startColor}, ${endColor})`,
          },
          [`bg-gradient-x-${startClassName}-to-${endClassName}`]: {
            'background-color': `linear-gradient(to right, ${startColor}, ${endColor})`,
          },
        })
      })
    })
  )
}
