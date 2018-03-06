import parser from 'postcss-selector-parser'

export default function(prefix, selector) {
  const getPrefix = typeof prefix === 'function' ? prefix : () => prefix

  return parser(selectors => {
    selectors.walkClasses(classSelector => {
      classSelector.value = `${getPrefix('.' + classSelector.value)}${classSelector.value}`
    })
  }).processSync(selector)
}
