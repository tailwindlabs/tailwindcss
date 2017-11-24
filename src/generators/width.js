import _ from 'lodash'
import defineClass from '../util/defineClass'

function defineWidths(widths) {
  return _.map(widths, (size, modifer) => {
    return defineClass(`w-${modifer}`, {
      width: `${size}`,
    })
  })
}

export default function(config) {
  return _.flatten([defineWidths(config.width)])
}
