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
  focus: generatePseudoClassVariant('focus'),
  active: generatePseudoClassVariant('active'),
  visited: generatePseudoClassVariant('visited'),
  disabled: generatePseudoClassVariant('disabled'),
  first: generatePseudoClassVariant('first-child', 'first'),
  last: generatePseudoClassVariant('last-child', 'last'),
  odd: generatePseudoClassVariant('nth-child(odd)', 'odd'),
  even: generatePseudoClassVariant('nth-child(even)', 'even'),
})

export default function(config, { variantGenerators: pluginVariantGenerators }) {
  return function(css) {
    const variantGenerators = {
      ...defaultVariantGenerators(config),
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
}
