import _ from 'lodash'
import postcss from 'postcss'
import buildClassVariant from '../util/buildClassVariant'

function buildPseudoClassVariant(selector, pseudoClass, separator) {
  return `${buildClassVariant(selector, pseudoClass, separator)}:${pseudoClass}`
}

function generatePseudoClassVariant(pseudoClass) {
  return (container, config) => {
    const cloned = container.clone()

    cloned.walkRules(rule => {
      rule.selector = buildPseudoClassVariant(rule.selector, pseudoClass, config.options.separator)
    })

    container.before(cloned.nodes)
  }
}

const variantGenerators = {
  'group-hover': (container, { options: { separator } }) => {
    const cloned = container.clone()

    cloned.walkRules(rule => {
      rule.selector = `.group:hover ${buildClassVariant(rule.selector, 'group-hover', separator)}`
    })

    container.before(cloned.nodes)
  },
  hover: generatePseudoClassVariant('hover'),
  focus: generatePseudoClassVariant('focus'),
  active: generatePseudoClassVariant('active'),
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

      _.forEach(['group-hover', 'hover', 'focus', 'active'], variant => {
        if (variants.includes(variant)) {
          variantGenerators[variant](atRule, unwrappedConfig)
        }
      })

      atRule.remove()
    })
  }
}
