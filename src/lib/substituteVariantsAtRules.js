import _ from 'lodash'
import postcss from 'postcss'

const variantGenerators = {
  hover: (rule) => {
    const clonedRule = rule.clone()

    clonedRule.walkRules(rule => {
      rule.selector = `.hover\\:${rule.selector.slice(1)}:hover`
    })

    return clonedRule.nodes
  },
  focus: (rule) => {
    const clonedRule = rule.clone()

    clonedRule.walkRules(rule => {
      rule.selector = `.focus\\:${rule.selector.slice(1)}:focus`
    })

    return clonedRule.nodes
  },
}

export default function() {
  return function(css) {
    css.walkAtRules('variants', atRule => {
      const variants = postcss.list.comma(atRule.params)

      atRule.before(atRule.clone().nodes)

      _.forEach(['focus', 'hover'], (variant) => {
        if (variants.includes(variant)) {
          atRule.before(variantGenerators[variant](atRule))
        }
      })

      atRule.remove()
    })
  }
}
