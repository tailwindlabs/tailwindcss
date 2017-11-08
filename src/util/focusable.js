import postcss from 'postcss'
import cloneNodes from './cloneNodes'

export default function focusable(rules) {
  return postcss
    .atRule({
      name: 'focusable',
    })
    .append(cloneNodes(rules))
}
