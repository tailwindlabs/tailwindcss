import _ from 'lodash'
import postcss from 'postcss'
import generateVariantFunction from '../util/generateVariantFunction'

function generatePseudoClassVariant(pseudoClass) {
  return generateVariantFunction(({ modifySelectors, separator }) => {
    return modifySelectors(({ className }) => {
      return `.${pseudoClass}${separator}${className}:${pseudoClass}`
    })
  })
}

const defaultVariantGenerators = {
  'group-hover': generateVariantFunction(({ modifySelectors, separator }) => {
    return modifySelectors(({ className }) => {
      return `.group:hover .group-hover${separator}${className}`
    })
  }),
  hover: generatePseudoClassVariant('hover'),
  'focus-within': generatePseudoClassVariant('focus-within'),
  focus: generatePseudoClassVariant('focus'),
  active: generatePseudoClassVariant('active'),
}

export default function(config, { variantGenerators: pluginVariantGenerators }) {
  return function(css) {
    const variantGenerators = {
      ...defaultVariantGenerators,
      ...pluginVariantGenerators,
    }

    css.walkAtRules('variants', atRule => {
      const variants = postcss.list.comma(atRule.params).filter(variant => variant !== '')

      if (variants.includes('responsive')) {
        const responsiveParent = postcss.atRule({ name: 'responsive' })
        atRule.before(responsiveParent)
        responsiveParent.append(atRule)
      }

      atRule.before(atRule.clone().nodes)

      _.forEach(_.without(variants, 'responsive'), variant => {
        variantGenerators[variant](atRule, config)
      })

      atRule.remove()
    })
  }
}
