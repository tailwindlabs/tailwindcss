import postcss from 'postcss'
import * as corePlugins from '../plugins'
import buildMediaQuery from '../util/buildMediaQuery'
import prefixSelector from '../util/prefixSelector'
import {
  updateLastClasses,
  updateAllClasses,
  transformAllSelectors,
  transformAllClasses,
  transformLastClasses,
} from '../util/pluginUtils'

export default {
  pseudoClassVariants: function ({ config, addVariant }) {
    let pseudoVariants = [
      ['first', 'first-child'],
      ['last', 'last-child'],
      ['odd', 'nth-child(odd)'],
      ['even', 'nth-child(even)'],
      'visited',
      'checked',
      'empty',
      'focus-within',
      'hover',
      'focus',
      'focus-visible',
      'active',
      'disabled',
    ]

    for (let variant of pseudoVariants) {
      let [variantName, state] = Array.isArray(variant) ? variant : [variant, variant]

      addVariant(
        variantName,
        transformAllClasses((className, { withPseudo }) => {
          return withPseudo(`${variantName}${config('separator')}${className}`, state)
        })
      )
    }

    for (let variant of pseudoVariants) {
      let [variantName, state] = Array.isArray(variant) ? variant : [variant, variant]
      let groupVariantName = `group-${variantName}`

      addVariant(
        groupVariantName,
        transformAllSelectors((selector) => {
          let variantSelector = updateAllClasses(selector, (className) => {
            return `${groupVariantName}${config('separator')}${className}`
          })

          if (variantSelector === selector) {
            return null
          }

          let groupSelector = prefixSelector(
            config('prefix'),
            `.group${config('separator')}${state}`
          )

          return `${groupSelector} ${variantSelector}`
        })
      )
    }
  },
  directionVariants: function ({ config, addVariant }) {
    addVariant(
      'ltr',
      transformAllSelectors(
        (selector) =>
          `[dir="ltr"] ${updateAllClasses(
            selector,
            (className) => `ltr${config('separator')}${className}`
          )}`
      )
    )

    addVariant(
      'rtl',
      transformAllSelectors(
        (selector) =>
          `[dir="rtl"] ${updateAllClasses(
            selector,
            (className) => `rtl${config('separator')}${className}`
          )}`
      )
    )
  },
  reducedMotionVariants: function ({ config, addVariant }) {
    addVariant(
      'motion-safe',
      transformLastClasses(
        (className) => {
          return `motion-safe${config('separator')}${className}`
        },
        () =>
          postcss.atRule({
            name: 'media',
            params: '(prefers-reduced-motion: no-preference)',
          })
      )
    )

    addVariant(
      'motion-reduce',
      transformLastClasses(
        (className) => {
          return `motion-reduce${config('separator')}${className}`
        },
        () =>
          postcss.atRule({
            name: 'media',
            params: '(prefers-reduced-motion: reduce)',
          })
      )
    )
  },
  darkVariants: function ({ config, addVariant }) {
    if (config('darkMode') === 'class') {
      addVariant(
        'dark',
        transformAllSelectors((selector) => {
          let variantSelector = updateLastClasses(selector, (className) => {
            return `dark${config('separator')}${className}`
          })

          if (variantSelector === selector) {
            return null
          }

          let darkSelector = prefixSelector(config('prefix'), `.dark`)

          return `${darkSelector} ${variantSelector}`
        })
      )
    } else if (config('darkMode') === 'media') {
      addVariant(
        'dark',
        transformLastClasses(
          (className) => {
            return `dark${config('separator')}${className}`
          },
          () =>
            postcss.atRule({
              name: 'media',
              params: '(prefers-color-scheme: dark)',
            })
        )
      )
    }
  },
  screenVariants: function ({ config, theme, addVariant }) {
    for (let screen in theme('screens')) {
      let size = theme('screens')[screen]
      let query = buildMediaQuery(size)

      addVariant(
        screen,
        transformLastClasses(
          (className) => {
            return `${screen}${config('separator')}${className}`
          },
          () => postcss.atRule({ name: 'media', params: query })
        )
      )
    }
  },

  ...Object.fromEntries(
    Object.entries(corePlugins).map(([pluginName, plugin]) => {
      return [pluginName, plugin()]
    })
  ),
}
