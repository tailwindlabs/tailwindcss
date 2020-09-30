import some from 'lodash/some'
import mergeWith from 'lodash/mergeWith'
import isFunction from 'lodash/isFunction'
import isUndefined from 'lodash/isUndefined'
import defaults from 'lodash/defaults'
import map from 'lodash/map'
import get from 'lodash/get'
import toPath from 'lodash/toPath'
import negateValue from './negateValue'
import { corePluginList } from '../corePlugins'
import configurePlugins from './configurePlugins'

const configUtils = {
  negative(scale) {
    return Object.keys(scale)
      .filter(key => scale[key] !== '0')
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
      .filter(key => typeof screens[key] === 'string')
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

function mergeThemes(themes) {
  const theme = (({ extend: _, ...t }) => t)(
    themes.reduce((merged, t) => {
      return defaults(merged, t)
    }, {})
  )

  return {
    ...theme,

    // In order to resolve n config objects, we combine all of their `extend` properties
    // into arrays instead of objects so they aren't overridden.
    extend: themes.reduce((merged, { extend }) => {
      return mergeWith(merged, extend, (mergedValue, extendValue) => {
        if (isUndefined(mergedValue)) {
          return [extendValue]
        }

        if (Array.isArray(mergedValue)) {
          return [extendValue, ...mergedValue]
        }

        return [extendValue, mergedValue]
      })
    }, {}),
  }
}

function mergeExtensions({ extend, ...theme }) {
  return mergeWith(theme, extend, (themeValue, extensions) => {
    // The `extend` property is an array, so we need to check if it contains any functions
    if (!isFunction(themeValue) && !some(extensions, isFunction)) {
      return {
        ...themeValue,
        ...Object.assign({}, ...extensions),
      }
    }

    return (resolveThemePath, utils) => ({
      ...value(themeValue, resolveThemePath, utils),
      ...Object.assign({}, ...extensions.map(e => value(e, resolveThemePath, utils))),
    })
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

  configs.forEach(config => {
    allConfigs = [...allConfigs, config]

    const plugins = get(config, 'plugins', [])

    if (plugins.length === 0) {
      return
    }

    plugins.forEach(plugin => {
      if (plugin.__isOptionsFunction) {
        plugin = plugin()
      }
      allConfigs = [...allConfigs, ...extractPluginConfigs([get(plugin, 'config', {})])]
    })
  })

  return allConfigs
}

function resolveVariants([firstConfig, ...variantConfigs]) {
  if (Array.isArray(firstConfig)) {
    return firstConfig
  }

  return [firstConfig, ...variantConfigs].reverse().reduce((resolved, variants) => {
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
            return existingPluginVariants.filter(v => !toRemove.includes(v))
          },
        })
      } else {
        resolved[plugin] = pluginVariants
      }
    })

    return resolved
  }, {})
}

function resolveCorePlugins(corePluginConfigs) {
  const result = [...corePluginConfigs].reverse().reduce((resolved, corePluginConfig) => {
    return configurePlugins(corePluginConfig, resolved)
  }, Object.keys(corePluginList))

  return result
}

export default function resolveConfig(configs) {
  const allConfigs = extractPluginConfigs(configs)

  return defaults(
    {
      theme: resolveFunctionKeys(
        mergeExtensions(mergeThemes(map(allConfigs, t => get(t, 'theme', {}))))
      ),
      variants: resolveVariants(allConfigs.map(c => c.variants)),
      corePlugins: resolveCorePlugins(allConfigs.map(c => c.corePlugins)),
    },
    ...allConfigs
  )
}
