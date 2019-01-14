import escapeClassName from './escapeClassName'
import parser from 'postcss-selector-parser'
import tap from 'lodash/tap'
import get from 'lodash/get'

export default function buildSelectorVariant(selector, variantName, separator, onError = () => {}) {
  return parser(selectors => {
    tap(selectors.first.filter(({ type }) => type === 'class').pop(), classSelector => {
      if (classSelector === undefined) {
        onError('Variant cannot be generated because selector contains no classes.')
        return
      }

      const baseClass = get(classSelector, 'raws.value', classSelector.value)

      classSelector.setPropertyAndEscape(
        'value',
        `${variantName}${escapeClassName(separator)}${baseClass}`
      )
    })
  }).processSync(selector)
}
