import _ from 'lodash'
import postcss from 'postcss'
import generateVariantFunction from '../util/generateVariantFunction'
import e from '../util/escapeClassName'

const generatePseudoClassVariant = pseudoClass =>
  generateVariantFunction(({ modifySelectors, separator }) =>
    modifySelectors(
      ({ className }) => `.${e(`${pseudoClass}${separator}${className}`)}:${pseudoClass}`
    )
  )

const ensureIncludesDefault = variants =>
  variants.includes('default') ? variants : ['default', ...variants]

const defaultVariantGenerators = {
  default: generateVariantFunction(() => {}),
  'group-hover': generateVariantFunction(({ modifySelectors, separator }) =>
    modifySelectors(({ className }) => `.group:hover .${e(`group-hover${separator}${className}`)}`)
  ),
  hover: generatePseudoClassVariant('hover'),
  'focus-within': generatePseudoClassVariant('focus-within'),
  focus: generatePseudoClassVariant('focus'),
  active: generatePseudoClassVariant('active'),
}

export default (config, { variantGenerators: pluginVariantGenerators }) => css => {
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

    _.forEach(_.without(ensureIncludesDefault(variants), 'responsive'), variant => {
      variantGenerators[variant](atRule, config)
    })

    atRule.remove()
  })
}
