import parser from 'postcss-selector-parser'

export default function (prefix, selector, prependNegative = false) {
  return parser((selectors) => {
    selectors.walkClasses((classSelector) => {
      const baseClass = classSelector.value
      const shouldPlaceNegativeBeforePrefix = prependNegative && baseClass.startsWith('-')

      classSelector.value = shouldPlaceNegativeBeforePrefix
        ? `-${prefix}${baseClass.slice(1)}`
        : `${prefix}${baseClass}`
    })
  }).processSync(selector)
}
