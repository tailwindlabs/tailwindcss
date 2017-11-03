import _ from 'lodash'
import postcss from 'postcss'
import cloneNodes from '../util/cloneNodes'

export default function(config) {
  return function (css) {
    const options = config()

    css.walkAtRules('hoverable', atRule => {

      atRule.walkRules(rule => {
        // Might be wise to error if the rule has multiple selectors,
        // or weird compound selectors like .bg-blue>p>h1
        rule.selectors =  [
          rule.selector,
          `.hover\\:${rule.selector.slice(1)}:hover`
        ]
      })

      atRule.before(cloneNodes(atRule.nodes))

      atRule.remove()
    })
  }
}
