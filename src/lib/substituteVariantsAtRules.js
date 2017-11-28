import _ from 'lodash'
import postcss from 'postcss'

const variantGenerators = {
  hover: (container, config) => {
    const cloned = container.clone()

    cloned.walkRules(rule => {
      rule.selector = `.hover${config.options.separator}${rule.selector.slice(1)}:hover`
    })

    container.before(cloned.nodes)
  },
  focus: (container, config) => {
    const cloned = container.clone()

    cloned.walkRules(rule => {
      rule.selector = `.focus${config.options.separator}${rule.selector.slice(1)}:focus`
    })

    container.before(cloned.nodes)
  },
}

export default function(config) {
  return function(css) {
    const unwrappedConfig = config()

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
          variantGenerators[variant](atRule, unwrappedConfig)
        }
      })

      atRule.remove()
    })
  }
}
