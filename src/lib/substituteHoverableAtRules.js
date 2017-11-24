export default function(config) {
  return function(css) {
    const separator = config().options.separator
    css.walkAtRules('hoverable', atRule => {
      const clonedRule = atRule.clone()

      clonedRule.walkRules(rule => {
        // Might be wise to error if the rule has multiple selectors,
        // or weird compound selectors like .bg-blue>p>h1
        rule.selector = `.hover${separator}${rule.selector.slice(1)}:hover`
      })

      atRule.before(atRule.clone().nodes)
      atRule.after(clonedRule.nodes)

      atRule.remove()
    })
  }
}
