import get from 'lodash/get'
import parser from 'postcss-selector-parser'

export default className => {
  const node = parser.className()
  node.value = className

  return get(node, 'raws.value', node.value)
}
