import postcss from 'postcss'
import cloneNodes from './cloneNodes'

export default function wrapWithVariants(rules, variants) {
  return postcss
    .atRule({
      name: 'variants',
      params: variants.join(', '),
    })
    .append(cloneNodes(Array.isArray(rules) ? rules : [rules]))
}
