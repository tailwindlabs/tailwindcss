import negateValue from './negateValue'
import corePluginList from '../corePluginList'
import configurePlugins from './configurePlugins'
import colors from '../public/colors'
import { defaults } from './defaults'
import { toPath } from './toPath'
import { normalizeConfig } from './normalizeConfig'
import isPlainObject from './isPlainObject'
import { cloneDeep } from './cloneDeep'
import { parseColorFormat } from './pluginUtils'
import { withAlphaValue } from './withAlphaVariable'
import toColorValue from './toColorValue'

function isFunction(input) {
  return typeof input === 'function'
}

function mergeWith(target, ...sources) {
  let customizer = sources.pop()

  for (let source of sources) {
    for (let k in source) {
      let merged = customizer(target[k], source[k])

      if (merged === undefined) {
        if (isPlainObject(target[k]) && isPlainObject(source[k])) {
          target[k] = mergeWith({}, target[k], source[k], customizer)
        } else {
          target[k] = source[k]
        }
      } else {
        target[k] = merged
      }
    }
  }

  return target
}

const configUtils = {
  colors,
  negative(scale) {
    // TODO: Log that this function isn't really needed anymore?
    return Object.keys(scale)
      .filter((key) => scale[key] !== '0')
      .reduce((negativeScale, key) => {
        let negativeValue = negateValue(scale[key])

        if (negativeValue !== undefined) {
          negativeScale[`-${key}`] = negativeValue
        }

        return negativeScale
      }, {})
  },
  breakpoints(screens) {
    return Object.keys(screens)
      .filter((key) => typeof screens[key] === 'string')
      .reduce(
        (breakpoints, key) => ({
          ...breakpoints,
          [`screen-${key}`]: screens[key],
        }),
        {}
      )
  },
}

function value(valueToResolve, ...args) {
  return isFunction(valueToResolve) ? valueToResolve(...args) : valueToResolve
}

function collectExtends(items) {
  return items.reduce((merged, { extend }) => {
    return mergeWith(merged, extend, (mergedValue, extendValue) => {
      if (mergedValue === undefined) {
        return [extendValue]
      }

      if (Array.isArray(mergedValue)) {
        return [extendValue, ...mergedValue]
      }

      return [extendValue, mergedValue]
    })
  }, {})
}

function mergeThemes(themes) {
  return {
    ...themes.reduce((merged, theme) => defaults(merged, theme), {}),

    // In order to resolve n config objects, we combine all of their `extend` properties
    // into arrays instead of objects so they aren't overridden.
    extend: collectExtends(themes),
  }
}

function mergeExtensionCustomizer(merged, value) {
  // When we have an array of objects, we do want to merge it
  if (Array.isArray(merged) && isPlainObject(merged[0])) {
    return merged.concat(value)
  }

  // When the incoming value is an array, and the existing config is an object, prepend the existing object
  if (Array.isArray(value) && isPlainObject(value[0]) && isPlainObject(merged)) {
    return [merged, ...value]
  }

  // Override arrays (for example for font-families, box-shadows, ...)
  if (Array.isArray(value)) {
    return value
  }

  // Execute default behaviour
  return undefined
}

function mergeExtensions({ extend, ...theme }) {
  return mergeWith(theme, extend, (themeValue, extensions) => {
    // The `extend` property is an array, so we need to check if it contains any functions
    if (!isFunction(themeValue) && !extensions.some(isFunction)) {
      return mergeWith({}, themeValue, ...extensions, mergeExtensionCustomizer)
    }

    return (resolveThemePath, utils) =>
      mergeWith(
        {},
        ...[themeValue, ...extensions].map((e) => value(e, resolveThemePath, utils)),
        mergeExtensionCustomizer
      )
  })
}

/**
 *
 * @param {string} key
 * @return {Iterable<string[] & {alpha: string | undefined}>}
 */
function* toPaths(key) {
  let path = toPath(key)

  if (path.length === 0) {
    return
  }

  yield path

  if (Array.isArray(key)) {
    return
  }

  let pattern = /^(.*?)\s*\/\s*([^/]+)$/
  let matches = key.match(pattern)

  if (matches !== null) {
    let [, prefix, alpha] = matches

    let newPath = toPath(prefix)
    newPath.alpha = alpha

    yield newPath
  }
}

function resolveFunctionKeys(object) {
  // theme('colors.red.500 / 0.5') -> ['colors', 'red', '500 / 0', '5]

  const resolvePath = (key, defaultValue) => {
    for (const path of toPaths(key)) {
      let index = 0
      let val = object

      while (val !== undefined && val !== null && index < path.length) {
        val = val[path[index++]]

        let shouldResolveAsFn =
          isFunction(val) && (path.alpha === undefined || index <= path.length - 1)

        val = shouldResolveAsFn ? val(resolvePath, configUtils) : val
      }

      if (val !== undefined) {
        if (path.alpha !== undefined) {
          let normalized = parseColorFormat(val)

          return withAlphaValue(normalized, path.alpha, toColorValue(normalized))
        }

        if (isPlainObject(val)) {
          return cloneDeep(val)
        }

        return val
      }
    }

    return defaultValue
  }

  Object.assign(resolvePath, {
    theme: resolvePath,
    ...configUtils,
  })

  return Object.keys(object).reduce((resolved, key) => {
    resolved[key] = isFunction(object[key]) ? object[key](resolvePath, configUtils) : object[key]

    return resolved
  }, {})
}

function resolvePlugins(configs) {
  let pluginGroups = []
  let allConfigs = []

  for (let config of configs) {
    allConfigs.push(config)

    let plugins = []

    for (let plugin of config?.plugins ?? []) {
      // TODO: If we want to support ESM plugins then a handful of things will have to become async
      if (typeof plugin === 'string') {
        // If the plugin is specified as a string then it's just the package name
        plugin = require(plugin)
        plugin = plugin.default ?? plugin
      } else if (Array.isArray(plugin)) {
        // If the plugin is specified as an array then it's a package name and optional options object
        // [name] or [name, options]
        let [pkg, options = undefined] = plugin
        plugin = require(pkg)
        plugin = plugin.default ?? plugin
        plugin = plugin(options)
      }

      if (plugin.__isOptionsFunction) {
        plugin = plugin()
      }

      // We're explicitly skipping registering child plugins
      // This will change in v4
      let [, childConfigs] = resolvePlugins([plugin?.config ?? {}])

      plugins.push(plugin)
      allConfigs.push(...childConfigs)
    }

    pluginGroups.push(plugins)
  }

  // Reverse the order of the plugin groups
  // This matches the old `reduceRight` behavior of the old `resolvePluginLists`
  // Why? No idea.
  let plugins = pluginGroups.reverse().flat()

  return [plugins, allConfigs]
}

function resolveCorePlugins(corePluginConfigs) {
  const result = [...corePluginConfigs].reduceRight((resolved, corePluginConfig) => {
    if (isFunction(corePluginConfig)) {
      return corePluginConfig({ corePlugins: resolved })
    }
    return configurePlugins(corePluginConfig, resolved)
  }, corePluginList)

  return result
}

export default function resolveConfig(configs) {
  let [plugins, pluginConfigs] = resolvePlugins(configs)

  let allConfigs = [
    ...pluginConfigs,
    {
      prefix: '',
      important: false,
      separator: ':',
    },
  ]

  return normalizeConfig(
    defaults(
      {
        theme: resolveFunctionKeys(
          mergeExtensions(mergeThemes(allConfigs.map((t) => t?.theme ?? {})))
        ),
        corePlugins: resolveCorePlugins(allConfigs.map((c) => c.corePlugins)),
        plugins,
      },
      ...allConfigs
    )
  )
}
