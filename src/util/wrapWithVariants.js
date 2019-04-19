import _ from 'lodash'
import postcss from 'postcss'
import cloneNodes from './cloneNodes'

export default (rules, variants) =>
  postcss
    .atRule({
      name: 'variants',
      params: variants.join(', '),
    })
    .append(cloneNodes(_.isArray(rules) ? rules : [rules]))
