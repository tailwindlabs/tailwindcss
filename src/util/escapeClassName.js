import parser from 'postcss-selector-parser'
import get from 'lodash/get'
import escapeCommas from './escapeCommas'

export default function escapeClassName(className) {
  const node = parser.className()
  node.value = className
  return escapeCommas(get(node, 'raws.value', node.value))
}
