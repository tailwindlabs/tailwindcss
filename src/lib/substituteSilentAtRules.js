export default function() {
  return function(css) {
    css.walkAtRules('silent', atRule => {
      atRule.remove()
    })
  }
}
