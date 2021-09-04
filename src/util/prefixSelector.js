import parser from 'postcss-selector-parser'

function tap(value, cb) {
  cb(value)
  return value
}

export default function (prefix, selector) {
  const getPrefix =
    typeof prefix === 'function' ? prefix : () => (prefix === undefined ? '' : prefix)

  return parser((selectors) => {
    selectors.walkClasses((classSelector) => {
      tap(classSelector.value, (baseClass) => {
        classSelector.value = `${getPrefix('.' + baseClass)}${baseClass}`
      })
    })
  }).processSync(selector)
}
