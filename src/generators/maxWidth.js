import _ from 'lodash'
import defineClass from '../util/defineClass'

function defineMaxWidths(widths) {
  return _.map(widths, (size, modifer) => {
    return defineClass(`max-w-${modifer}`, {
      'max-width': `${size}`,
    })
  })
}

export default function(config) {
  return _.flatten([defineMaxWidths(config.maxWidth)])
}
