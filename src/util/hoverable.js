import postcss from 'postcss'
import cloneNodes from './cloneNodes'

export default function hoverable(rules) {
  return postcss.atRule({
    name: 'hoverable',
  }).append(cloneNodes(rules))
}
