import postcss from 'postcss'
import cloneNodes from './cloneNodes'

export default function wrapWithVariants(rules, variants) {
  let foundVariantAtRule = false

  postcss.root({ nodes: rules }).walkAtRules('variants', () => {
    foundVariantAtRule = true
  })

  if (foundVariantAtRule) {
    return cloneNodes(rules)
  }

  return postcss
    .atRule({
      name: 'variants',
      params: variants.join(', '),
    })
    .append(cloneNodes(Array.isArray(rules) ? rules : [rules]))
}
