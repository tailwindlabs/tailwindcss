import _ from 'lodash'
import postcss from 'postcss'
import cloneNodes from './cloneNodes'

export default rules =>
  postcss
    .atRule({
      name: 'responsive',
    })
    .append(cloneNodes(_.isArray(rules) ? rules : [rules]))
