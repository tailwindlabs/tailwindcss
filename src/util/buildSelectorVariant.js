import parser from 'postcss-selector-parser'
import { useMemo } from './useMemo'

function tap(input, cb) {
  cb(input)
  return input
}

const buildSelectorVariant = useMemo(
  (selector, variantName, separator, onError = () => {}) => {
    return parser((selectors) => {
      tap(selectors.first.filter(({ type }) => type === 'class').pop(), (classSelector) => {
        if (classSelector === undefined) {
          onError('Variant cannot be generated because selector contains no classes.')
          return
        }

        classSelector.value = `${variantName}${separator}${classSelector.value}`
      })
    }).processSync(selector)
  },
  (selector, variantName, separator) => [selector, variantName, separator].join('||')
)

export default buildSelectorVariant
