import parser from 'postcss-selector-parser'
import get from 'lodash/get'

export default function escapeClassName(className) {
  const node = parser.className()
  node.value = className
  return get(node, 'raws.value', node.value)
}
