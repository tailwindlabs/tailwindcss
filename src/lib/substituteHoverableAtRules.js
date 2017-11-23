export default function() {
  return function(css) {
    css.walkAtRules('hoverable', atRule => {
      const clonedRule = atRule.clone()

      clonedRule.walkRules(rule => {
        // Might be wise to error if the rule has multiple selectors,
        // or weird compound selectors like .bg-blue>p>h1
        rule.selector = `.hover\\:${rule.selector.slice(1)}:hover`
      })

      atRule.before(atRule.clone().nodes)
      atRule.after(clonedRule.nodes)

      atRule.remove()
    })
  }
}
