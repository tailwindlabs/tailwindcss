import dlv from 'dlv'
import postcss from 'postcss'
import Node from 'postcss/lib/node'
import escapeClassName from './escapeClassName'
import generateVariantFunction from './generateVariantFunction'
import parseObjectStyles from './parseObjectStyles'
import prefixSelector from './prefixSelector'
import wrapWithVariants from './wrapWithVariants'
import cloneNodes from './cloneNodes'
import transformThemeValue from './transformThemeValue'
import nameClass from './nameClass'
import isKeyframeRule from './isKeyframeRule'
import { toPath } from './toPath'
import { defaults } from './defaults'

function parseStyles(styles) {
  if (!Array.isArray(styles)) {
    return parseStyles([styles])
  }

  return styles.flatMap((style) => (style instanceof Node ? style : parseObjectStyles(style)))
}

function wrapWithLayer(rules, layer) {
  return postcss
    .atRule({ name: 'layer', params: layer })
    .append(cloneNodes(Array.isArray(rules) ? rules : [rules]))
}

export default function (plugins, config) {
  const pluginBaseStyles = []
  const pluginComponents = []
  const pluginUtilities = []
  const pluginVariantGenerators = {}

  const applyConfiguredPrefix = (selector) => {
    return prefixSelector(config.prefix, selector)
  }

  function addUtilities(utilities, options) {
    const defaultOptions = {
      variants: [],
      respectPrefix: true,
      respectImportant: true,
    }

    options = Array.isArray(options)
      ? Object.assign({}, defaultOptions, { variants: options })
      : defaults(options, defaultOptions)

    const styles = postcss.root({ nodes: parseStyles(utilities) })

    styles.walkRules((rule) => {
      if (options.respectPrefix && !isKeyframeRule(rule)) {
        rule.selector = applyConfiguredPrefix(rule.selector)
      }

      if (options.respectImportant && config.important) {
        rule.__tailwind = {
          ...rule.__tailwind,
          important: config.important,
        }
      }
    })

    pluginUtilities.push(
      wrapWithLayer(wrapWithVariants(styles.nodes, options.variants), 'utilities')
    )
  }

  const getConfigValue = (path, defaultValue) => (path ? dlv(config, path, defaultValue) : config)

  plugins.forEach((plugin) => {
    if (plugin.__isOptionsFunction) {
      plugin = plugin()
    }

    const handler = typeof plugin === 'function' ? plugin : plugin?.handler ?? (() => {})

    handler({
      postcss,
      config: getConfigValue,
      theme: (path, defaultValue) => {
        let [pathRoot, ...subPaths] = toPath(path)
        let value = getConfigValue(['theme', pathRoot, ...subPaths], defaultValue)

        return transformThemeValue(pathRoot)(value)
      },
      corePlugins: (path) => {
        if (Array.isArray(config.corePlugins)) {
          return config.corePlugins.includes(path)
        }

        return getConfigValue(`corePlugins.${path}`, true)
      },
      variants: (path, defaultValue) => {
        if (Array.isArray(config.variants)) {
          return config.variants
        }

        return getConfigValue(`variants.${path}`, defaultValue)
      },
      e: escapeClassName,
      prefix: applyConfiguredPrefix,
      addUtilities,
      matchUtilities: (matches, { values, variants, respectPrefix, respectImportant }) => {
        let modifierValues = Object.entries(values || {})

        let result = Object.entries(matches).flatMap(([name, utilityFunction]) => {
          return modifierValues
            .map(([modifier, value]) => {
              let declarations = utilityFunction(value, {
                includeRules(rules, options) {
                  addUtilities(rules, options)
                },
              })

              if (!declarations) {
                return null
              }

              return {
                [nameClass(name, modifier)]: declarations,
              }
            })
            .filter(Boolean)
        })

        addUtilities(result, { variants, respectPrefix, respectImportant })
      },
      addComponents: (components, options) => {
        const defaultOptions = { variants: [], respectPrefix: true }

        options = Array.isArray(options)
          ? Object.assign({}, defaultOptions, { variants: options })
          : defaults(options, defaultOptions)

        const styles = postcss.root({ nodes: parseStyles(components) })

        styles.walkRules((rule) => {
          if (options.respectPrefix && !isKeyframeRule(rule)) {
            rule.selector = applyConfiguredPrefix(rule.selector)
          }
        })

        pluginComponents.push(
          wrapWithLayer(wrapWithVariants(styles.nodes, options.variants), 'components')
        )
      },
      addBase: (baseStyles) => {
        pluginBaseStyles.push(wrapWithLayer(parseStyles(baseStyles), 'base'))
      },
      addVariant: (name, generator, options = {}) => {
        pluginVariantGenerators[name] = generateVariantFunction(generator, options)
      },
    })
  })

  return {
    base: pluginBaseStyles,
    components: pluginComponents,
    utilities: pluginUtilities,
    variantGenerators: pluginVariantGenerators,
  }
}
