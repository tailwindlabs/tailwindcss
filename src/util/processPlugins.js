import _ from 'lodash'
import postcss from 'postcss'
import Node from 'postcss/lib/node'
import escapeClassName from '../util/escapeClassName'
import generateVariantFunction from '../util/generateVariantFunction'
import parseObjectStyles from '../util/parseObjectStyles'
import prefixSelector from '../util/prefixSelector'
import wrapWithVariants from '../util/wrapWithVariants'

function parseStyles(styles) {
  if (!Array.isArray(styles)) {
    return parseStyles([styles])
  }

  return _.flatMap(styles, style => (style instanceof Node ? style : parseObjectStyles(style)))
}

export default function(plugins, config) {
  const pluginComponents = []
  const pluginUtilities = []
  const pluginVariantGenerators = {}

  plugins.forEach(plugin => {
    plugin({
      config: (path, defaultValue) => _.get(config, path, defaultValue),
      e: escapeClassName,
      prefix: selector => {
        return prefixSelector(config.options.prefix, selector)
      },
      addUtilities: (utilities, options) => {
        const defaultOptions = { variants: [], respectPrefix: true, respectImportant: true }

        options = Array.isArray(options)
          ? Object.assign({}, defaultOptions, { variants: options })
          : _.defaults(options, defaultOptions)

        const styles = postcss.root({ nodes: parseStyles(utilities) })

        styles.walkRules(rule => {
          if (options.respectPrefix) {
            rule.selector = prefixSelector(config.options.prefix, rule.selector)
          }

          if (options.respectImportant && _.get(config, 'options.important')) {
            rule.walkDecls(decl => (decl.important = true))
          }
        })

        pluginUtilities.push(wrapWithVariants(styles.nodes, options.variants))
      },
      addComponents: (components, options) => {
        options = Object.assign({ respectPrefix: true }, options)

        const styles = postcss.root({ nodes: parseStyles(components) })

        styles.walkRules(rule => {
          if (options.respectPrefix) {
            rule.selector = prefixSelector(config.options.prefix, rule.selector)
          }
        })

        pluginComponents.push(...styles.nodes)
      },
      addVariant: (name, generator) => {
        pluginVariantGenerators[name] = generateVariantFunction(generator)
      },
    })
  })

  return {
    components: pluginComponents,
    utilities: pluginUtilities,
    variantGenerators: pluginVariantGenerators,
  }
}
