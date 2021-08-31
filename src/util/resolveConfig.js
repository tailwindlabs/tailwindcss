import some from 'lodash/some'
import mergeWith from 'lodash/mergeWith'
import isFunction from 'lodash/isFunction'
import isUndefined from 'lodash/isUndefined'
import defaults from 'lodash/defaults'
import map from 'lodash/map'
import get from 'lodash/get'
import uniq from 'lodash/uniq'
import toPath from 'lodash/toPath'
import head from 'lodash/head'
import isPlainObject from 'lodash/isPlainObject'
import negateValue from './negateValue'
import corePluginList from '../corePluginList'
import configurePlugins from './configurePlugins'
import defaultConfig from '../../stubs/defaultConfig.stub'
import colors from '../../colors'

const configUtils = {
  colors,
  negative(scale) {
    return Object.keys(scale)
      .filter((key) => scale[key] !== '0')
      .reduce(
        (negativeScale, key) => ({
          ...negativeScale,
          [`-${key}`]: negateValue(scale[key]),
        }),
        {}
      )
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
      if (isUndefined(mergedValue)) {
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
  if (Array.isArray(merged) && isPlainObject(head(merged))) {
    return merged.concat(value)
  }

  // When the incoming value is an array, and the existing config is an object, prepend the existing object
  if (Array.isArray(value) && isPlainObject(head(value)) && isPlainObject(merged)) {
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
    if (!isFunction(themeValue) && !some(extensions, isFunction)) {
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

function resolveFunctionKeys(object) {
  const resolvePath = (key, defaultValue) => {
    const path = toPath(key)

    let index = 0
    let val = object

    while (val !== undefined && val !== null && index < path.length) {
      val = val[path[index++]]
      val = isFunction(val) ? val(resolvePath, configUtils) : val
    }

    return val === undefined ? defaultValue : val
  }

  return Object.keys(object).reduce((resolved, key) => {
    return {
      ...resolved,
      [key]: isFunction(object[key]) ? object[key](resolvePath, configUtils) : object[key],
    }
  }, {})
}

function extractPluginConfigs(configs) {
  let allConfigs = []

  configs.forEach((config) => {
    allConfigs = [...allConfigs, config]

    const plugins = get(config, 'plugins', [])

    if (plugins.length === 0) {
      return
    }

    plugins.forEach((plugin) => {
      if (plugin.__isOptionsFunction) {
        plugin = plugin()
      }
      allConfigs = [...allConfigs, ...extractPluginConfigs([get(plugin, 'config', {})])]
    })
  })

  return allConfigs
}

function mergeVariants(variants) {
  const mergedVariants = variants.reduce((resolved, variants) => {
    Object.entries(variants || {}).forEach(([plugin, pluginVariants]) => {
      if (isFunction(pluginVariants)) {
        resolved[plugin] = pluginVariants({
          variants(path) {
            return get(resolved, path, [])
          },
          before(toInsert, variant, existingPluginVariants = get(resolved, plugin, [])) {
            if (variant === undefined) {
              return [...toInsert, ...existingPluginVariants]
            }

            const index = existingPluginVariants.indexOf(variant)

            if (index === -1) {
              return [...existingPluginVariants, ...toInsert]
            }

            return [
              ...existingPluginVariants.slice(0, index),
              ...toInsert,
              ...existingPluginVariants.slice(index),
            ]
          },
          after(toInsert, variant, existingPluginVariants = get(resolved, plugin, [])) {
            if (variant === undefined) {
              return [...existingPluginVariants, ...toInsert]
            }

            const index = existingPluginVariants.indexOf(variant)

            if (index === -1) {
              return [...toInsert, ...existingPluginVariants]
            }

            return [
              ...existingPluginVariants.slice(0, index + 1),
              ...toInsert,
              ...existingPluginVariants.slice(index + 1),
            ]
          },
          without(toRemove, existingPluginVariants = get(resolved, plugin, [])) {
            return existingPluginVariants.filter((v) => !toRemove.includes(v))
          },
        })
      } else {
        resolved[plugin] = pluginVariants
      }
    })

    return resolved
  }, {})

  return {
    ...mergedVariants,
    extend: collectExtends(variants),
  }
}

function mergeVariantExtensions({ extend, ...variants }, variantOrder) {
  return mergeWith(variants, extend, (variantsValue, extensions) => {
    const merged = uniq([...(variantsValue || []), ...extensions].flat())

    if (extensions.flat().length === 0) {
      return merged
    }

    return merged.sort((a, z) => variantOrder.indexOf(a) - variantOrder.indexOf(z))
  })
}

function resolveVariants([firstConfig, ...variantConfigs], variantOrder) {
  // Global variants configuration like `variants: ['hover', 'focus']`
  if (Array.isArray(firstConfig)) {
    return firstConfig
  }

  return mergeVariantExtensions(
    mergeVariants([firstConfig, ...variantConfigs].reverse()),
    variantOrder
  )
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

function resolvePluginLists(pluginLists) {
  const result = [...pluginLists].reduceRight((resolved, pluginList) => {
    return [...resolved, ...pluginList]
  }, [])

  return result
}

export default function resolveConfig(configs) {
  const allConfigs = [
    ...extractPluginConfigs(configs),
    {
      prefix: '',
      important: false,
      separator: ':',
      variantOrder: defaultConfig.variantOrder,
    },
  ]
  const { variantOrder } = allConfigs.find((c) => c.variantOrder)

  return defaults(
    {
      theme: resolveFunctionKeys(
        mergeExtensions(mergeThemes(map(allConfigs, (t) => get(t, 'theme', {}))))
      ),
      variants: resolveVariants(
        allConfigs.map((c) => get(c, 'variants', {})),
        variantOrder
      ),
      corePlugins: resolveCorePlugins(allConfigs.map((c) => c.corePlugins)),
      plugins: resolvePluginLists(configs.map((c) => get(c, 'plugins', []))),
    },
    ...allConfigs
  )
}
