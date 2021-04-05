import parser from 'postcss-selector-parser'
import get from 'lodash/get'

function escapeCommas(className) {
  return className.replace(/\\,/g, '\\2c ')
}

export default function escapeClassName(className) {
  const node = parser.className()
  node.value = className
  return escapeCommas(get(node, 'raws.value', node.value))
}
