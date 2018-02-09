import _ from 'lodash'
import postcss from 'postcss'
import buildClassVariant from '../util/buildClassVariant'

const variantGenerators = {
  hover: (container, config) => {
    const cloned = container.clone()

    cloned.walkRules(rule => {
      rule.selector = `${buildClassVariant(rule.selector, 'hover', config.options.separator)}:hover`
    })

    container.before(cloned.nodes)
  },
  active: (container, config) => {
    const cloned = container.clone()

    cloned.walkRules(rule => {
      rule.selector = `${buildClassVariant(
        rule.selector,
        'active',
        config.options.separator
      )}:active`
    })

    container.before(cloned.nodes)
  },
  focus: (container, config) => {
    const cloned = container.clone()

    cloned.walkRules(rule => {
      rule.selector = `${buildClassVariant(rule.selector, 'focus', config.options.separator)}:focus`
    })

    container.before(cloned.nodes)
  },
  'group-hover': (container, config) => {
    const cloned = container.clone()

    cloned.walkRules(rule => {
      // prettier-ignore
      rule.selector = `.group:hover ${buildClassVariant(rule.selector, 'group-hover', config.options.separator)}`
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

      _.forEach(['focus', 'active', 'hover', 'group-hover'], variant => {
        if (variants.includes(variant)) {
          variantGenerators[variant](atRule, unwrappedConfig)
        }
      })

      atRule.remove()
    })
  }
}
