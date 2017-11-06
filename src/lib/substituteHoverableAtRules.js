import cloneNodes from '../util/cloneNodes'

export default function() {
  return function(css) {
    css.walkAtRules('hoverable', atRule => {
      atRule.walkRules(rule => {
        // Might be wise to error if the rule has multiple selectors,
        // or weird compound selectors like .bg-blue>p>h1
        rule.selectors = [rule.selector, `.hover\\:${rule.selector.slice(1)}:hover`]
      })

      atRule.before(cloneNodes(atRule.nodes))

      atRule.remove()
    })
  }
}
