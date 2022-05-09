import parser from 'postcss-selector-parser'
import escapeCommas from './escapeCommas'

export default function escapeClassName(className) {
  const node = parser.className()
  node.value = className
  return escapeCommas(node?.raws?.value ?? node.value)
}
