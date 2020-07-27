import _ from 'lodash'
import postcss from 'postcss'
import selectorParser from 'postcss-selector-parser'
import generateVariantFunction from '../util/generateVariantFunction'
import prefixSelector from '../util/prefixSelector'

function generatePseudoClassVariant(pseudoClass, selectorPrefix = pseudoClass) {
  return generateVariantFunction(({ modifySelectors, separator }) => {
    return modifySelectors(({ selector }) => {
      return selectorParser(selectors => {
        selectors.walkClasses(sel => {
          sel.value = `${selectorPrefix}${separator}${sel.value}`
          sel.parent.insertAfter(sel, selectorParser.pseudo({ value: `:${pseudoClass}` }))
        })
      }).processSync(selector)
    })
  })
}

function ensureIncludesDefault(variants) {
  return variants.includes('default') ? variants : ['default', ...variants]
}

const defaultVariantGenerators = config => ({
  default: generateVariantFunction(() => {}),
  'motion-safe': generateVariantFunction(({ container, separator, modifySelectors }) => {
    const modified = modifySelectors(({ selector }) => {
      return selectorParser(selectors => {
        selectors.walkClasses(sel => {
          sel.value = `motion-safe${separator}${sel.value}`
        })
      }).processSync(selector)
    })
    const mediaQuery = postcss.atRule({
      name: 'media',
      params: '(prefers-reduced-motion: no-preference)',
    })
    mediaQuery.append(modified)
    container.append(mediaQuery)
  }),
  'motion-reduced': generateVariantFunction(({ container, separator, modifySelectors }) => {
    const modified = modifySelectors(({ selector }) => {
      return selectorParser(selectors => {
        selectors.walkClasses(sel => {
          sel.value = `motion-reduced${separator}${sel.value}`
        })
      }).processSync(selector)
    })
    const mediaQuery = postcss.atRule({ name: 'media', params: '(prefers-reduced-motion: reduce)' })
    mediaQuery.append(modified)
    container.append(mediaQuery)
  }),
  'group-hover': generateVariantFunction(({ modifySelectors, separator }) => {
    return modifySelectors(({ selector }) => {
      return selectorParser(selectors => {
        selectors.walkClasses(sel => {
          sel.value = `group-hover${separator}${sel.value}`
          sel.parent.insertBefore(
            sel,
            selectorParser().astSync(prefixSelector(config.prefix, '.group:hover '))
          )
        })
      }).processSync(selector)
    })
  }),
  'group-focus': generateVariantFunction(({ modifySelectors, separator }) => {
    return modifySelectors(({ selector }) => {
      return selectorParser(selectors => {
        selectors.walkClasses(sel => {
          sel.value = `group-focus${separator}${sel.value}`
          sel.parent.insertBefore(
            sel,
            selectorParser().astSync(prefixSelector(config.prefix, '.group:focus '))
          )
        })
      }).processSync(selector)
    })
  }),
  hover: generatePseudoClassVariant('hover'),
  'focus-within': generatePseudoClassVariant('focus-within'),
  'focus-visible': generatePseudoClassVariant('focus-visible'),
  focus: generatePseudoClassVariant('focus'),
  active: generatePseudoClassVariant('active'),
  visited: generatePseudoClassVariant('visited'),
  disabled: generatePseudoClassVariant('disabled'),
  checked: generatePseudoClassVariant('checked'),
  first: generatePseudoClassVariant('first-child', 'first'),
  last: generatePseudoClassVariant('last-child', 'last'),
  odd: generatePseudoClassVariant('nth-child(odd)', 'odd'),
  even: generatePseudoClassVariant('nth-child(even)', 'even'),
})

function prependStackableVariants(atRule, variants) {
  const stackableVariants = ['motion-safe', 'motion-reduced']

  if (!_.some(variants, v => stackableVariants.includes(v))) {
    return variants
  }

  if (_.every(variants, v => stackableVariants.includes(v))) {
    return variants
  }

  const variantsParent = postcss.atRule({
    name: 'variants',
    params: variants.filter(v => stackableVariants.includes(v)).join(', '),
  })
  atRule.before(variantsParent)
  variantsParent.append(atRule)
  variants = _.without(variants, ...stackableVariants)

  return variants
}

export default function(config, { variantGenerators: pluginVariantGenerators }) {
  return function(css) {
    const variantGenerators = {
      ...defaultVariantGenerators(config),
      ...pluginVariantGenerators,
    }

    let variantsFound = false

    do {
      variantsFound = false
      css.walkAtRules('variants', atRule => {
        variantsFound = true

        let variants = postcss.list.comma(atRule.params).filter(variant => variant !== '')

        if (variants.includes('responsive')) {
          const responsiveParent = postcss.atRule({ name: 'responsive' })
          atRule.before(responsiveParent)
          responsiveParent.append(atRule)
        }

        const remainingVariants = prependStackableVariants(atRule, variants)

        _.forEach(_.without(ensureIncludesDefault(remainingVariants), 'responsive'), variant => {
          if (!variantGenerators[variant]) {
            throw new Error(
              `Your config mentions the "${variant}" variant, but "${variant}" doesn't appear to be a variant. Did you forget or misconfigure a plugin that supplies that variant?`
            )
          }
          variantGenerators[variant](atRule, config)
        })

        atRule.remove()
      })
    } while (variantsFound)
  }
}
