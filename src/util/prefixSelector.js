import parser from 'postcss-selector-parser'

export default function (prefix, selector) {
  return parser((selectors) => {
    selectors.walkClasses((classSelector) => {
      let baseClass = classSelector.value

      classSelector.value = `${prefix}${baseClass}`
    })
  }).processSync(selector)
}
