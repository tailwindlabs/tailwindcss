export default function(css, prefix) {
  const prefixIsFunc = typeof prefix === 'function'
  css.walkRules(rule => {
    rule.selectors = rule.selectors.map(
      selector => `.${prefixIsFunc ? prefix(selector) : prefix}${selector.slice(1)}`
    )
  })
  return css
}
