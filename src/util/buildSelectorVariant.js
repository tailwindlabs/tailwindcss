import parser from 'postcss-selector-parser'
import tap from 'lodash/tap'

export default (selector, variantName, separator, onError = () => {}) =>
  parser(selectors => {
    tap(selectors.first.filter(({ type }) => type === 'class').pop(), classSelector => {
      if (classSelector === undefined) {
        onError('Variant cannot be generated because selector contains no classes.')
        return
      }

      classSelector.value = `${variantName}${separator}${classSelector.value}`
    })
  }).processSync(selector)
