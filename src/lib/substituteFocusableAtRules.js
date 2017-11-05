import cloneNodes from '../util/cloneNodes'

export default function() {
  return function(css) {
    css.walkAtRules('focusable', atRule => {
      atRule.walkRules(rule => {
        // Might be wise to error if the rule has multiple selectors,
        // or weird compound selectors like .bg-blue>p>h1
        rule.selectors = [
          rule.selector,
          `.focus\\:${rule.selector.slice(1)}:focus`,
        ]
      })

      atRule.before(cloneNodes(atRule.nodes))

      atRule.remove()
    })
  }
}
