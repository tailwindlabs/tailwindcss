import _ from 'lodash'
import postcss from 'postcss'
import Node from 'postcss/lib/node'
import escapeClassName from '../util/escapeClassName'
import parseObjectStyles from '../util/parseObjectStyles'
import prefixSelector from '../util/prefixSelector'
import wrapWithVariants from '../util/wrapWithVariants'

function defineRule(selector, properties) {
  const decls = _.map(properties, (value, property) => {
    return postcss.decl({
      prop: `${property}`,
      value: `${value}`,
    })
  })

  return postcss.rule({ selector }).append(decls)
}

function defineUtility(selector, properties, options) {
  if (selector.startsWith('.')) {
    return defineUtility(selector.slice(1), properties, options)
  }

  const rule = defineRule(
    prefixSelector(options.prefix, `.${escapeClassName(selector)}`),
    properties
  )

  if (options.important) {
    rule.walkDecls(decl => (decl.important = true))
  }

  return rule
}

function parseStyles(styles) {
  if (!Array.isArray(styles)) {
    return parseStyles([styles])
  }

  return _.flatMap(styles, (style) => style instanceof Node ? style : parseObjectStyles(style))
}

export default function(config) {
  const pluginComponents = []
  const pluginUtilities = []

  config.plugins.forEach(plugin => {
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
            rule.walkDecls(decl => decl.important = true)
          }
        })

        pluginUtilities.push(wrapWithVariants(styles.nodes, options.variants))
      },
      addComponents: components => {
        pluginComponents.push(...parseStyles(components))
      },
    })
  })

  return [pluginComponents, pluginUtilities]
}
