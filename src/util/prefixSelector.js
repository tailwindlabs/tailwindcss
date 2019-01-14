import parser from 'postcss-selector-parser'
import get from 'lodash/get'

export default function(prefix, selector) {
  const getPrefix = typeof prefix === 'function' ? prefix : () => prefix

  return parser(selectors => {
    selectors.walkClasses(classSelector => {
      const baseClass = get(classSelector, 'raws.value', classSelector.value)

      classSelector.setPropertyAndEscape('value', `${getPrefix('.' + baseClass)}${baseClass}`)
    })
  }).processSync(selector)
}
