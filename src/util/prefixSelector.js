import parser from 'postcss-selector-parser'
import { tap } from './tap'

export default function (prefix, selector) {
  return parser((selectors) => {
    selectors.walkClasses((classSelector) => {
      tap(classSelector.value, (baseClass) => {
        classSelector.value = `${prefix}${baseClass}`
      })
    })
  }).processSync(selector)
}
