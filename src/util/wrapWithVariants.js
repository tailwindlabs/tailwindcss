import postcss from 'postcss'
import cloneNodes from './cloneNodes'

export default function wrapWithVariants(rules, variants, bucket = 'utilities') {
  if (bucket === 'components' && variants.includes('responsive')) {
    return postcss
      .atRule({
        name: 'responsive',
        params: 'components',
      })
      .append(
        postcss
          .atRule({
            name: 'variants',
            params: variants.filter(v => v !== 'responsive').join(', '),
          })
          .append(cloneNodes(Array.isArray(rules) ? rules : [rules]))
      )
  }

  return postcss
    .atRule({
      name: 'variants',
      params: variants.join(', '),
    })
    .append(cloneNodes(Array.isArray(rules) ? rules : [rules]))
}
