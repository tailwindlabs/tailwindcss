export default function(css, prefix) {
  css.walkRules(rule => {
    rule.selectors = rule.selectors.map(selector => `.${prefix}${selector.slice(1)}`)
  })
  return css
}
