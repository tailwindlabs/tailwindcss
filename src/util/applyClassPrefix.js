export default function(css, prefix) {
  const getPrefix = typeof prefix === 'function' ? prefix : () => prefix

  css.walkRules(rule => {
    rule.selectors = rule.selectors.map(selector => `.${getPrefix(selector)}${selector.slice(1)}`)
  })
  return css
}
