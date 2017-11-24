import _ from 'lodash'
import postcss from 'postcss'

const variantGenerators = {
  hover: (separator, container) => {
    const cloned = container.clone()

    cloned.walkRules(rule => {
      rule.selector = `.hover${separator}${rule.selector.slice(1)}:hover`
    })

    return cloned.nodes
  },
  focus: (separator, container) => {
    const cloned = container.clone()

    cloned.walkRules(rule => {
      rule.selector = `.focus${separator}${rule.selector.slice(1)}:focus`
    })

    return cloned.nodes
  },
}

export default function(config) {
  const separator = config().options.separator

  return function(css) {
    css.walkAtRules('variants', atRule => {
      const variants = postcss.list.comma(atRule.params)

      if (variants.includes('responsive')) {
        const responsiveParent = postcss.atRule({ name: 'responsive' })
        atRule.before(responsiveParent)
        responsiveParent.append(atRule)
      }

      atRule.before(atRule.clone().nodes)

      _.forEach(['focus', 'hover'], variant => {
        if (variants.includes(variant)) {
          atRule.before(variantGenerators[variant](separator, atRule))
        }
      })

      atRule.remove()
    })
  }
}
