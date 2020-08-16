import valueParser from 'postcss-value-parser'

export default function usesCustomProperties(value) {
  let foundCustomProperty = false

  valueParser(value).walk(node => {
    if (node.type === 'function' && node.value === 'var') {
      foundCustomProperty = true
    }
    return !foundCustomProperty
  })

  return foundCustomProperty
}
