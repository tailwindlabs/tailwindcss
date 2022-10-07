import parser from 'postcss-selector-parser'

export default function (prefix, selector, prependNegative = false) {
  return parser((selectors) => {
    selectors.walkClasses((classSelector) => {
      let baseClass = classSelector.value
      let shouldPlaceNegativeBeforePrefix = prependNegative && baseClass.startsWith('-')

      classSelector.value = shouldPlaceNegativeBeforePrefix
        ? `-${prefix}${baseClass.slice(1)}`
        : `${prefix}${baseClass}`
    })
  }).processSync(selector)
}
