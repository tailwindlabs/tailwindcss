import negateValue from './negateValue'
import corePluginList from '../corePluginList'
import configurePlugins from './configurePlugins'
import defaultConfig from '../../stubs/defaultConfig.stub'
import colors from '../public/colors'
import log from './log'
import { defaults } from './defaults'
import { toPath } from './toPath'

function isFunction(input) {
  return typeof input === 'function'
}

function isObject(input) {
  return typeof input === 'object' && input !== null
}

function mergeWith(target, ...sources) {
  let customizer = sources.pop()

  for (let source of sources) {
    for (let k in source) {
      let merged = customizer(target[k], source[k])

      if (merged === undefined) {
        if (isObject(target[k]) && isObject(source[k])) {
          target[k] = mergeWith(target[k], source[k], customizer)
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
    return Object.keys(scale)
      .filter((key) => scale[key] !== '0')
      .reduce((negativeScale, key) => {
        negativeScale[`-${key}`] = negateValue(scale[key])
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
  if (Array.isArray(merged) && isObject(merged[0])) {
    return merged.concat(value)
  }

  // When the incoming value is an array, and the existing config is an object, prepend the existing object
  if (Array.isArray(value) && isObject(value[0]) && isObject(merged)) {
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

  resolvePath.theme = resolvePath

  for (let key in configUtils) {
    resolvePath[key] = configUtils[key]
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

    const plugins = config?.plugins ?? []

    if (plugins.length === 0) {
      return
    }

    plugins.forEach((plugin) => {
      if (plugin.__isOptionsFunction) {
        plugin = plugin()
      }
      allConfigs = [...allConfigs, ...extractPluginConfigs([plugin?.config ?? {}])]
    })
  })

  return allConfigs
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
  let allConfigs = [
    ...extractPluginConfigs(configs),
    {
      prefix: '',
      important: false,
      separator: ':',
      variantOrder: defaultConfig.variantOrder,
    },
  ]

  return normalizeConfig(
    defaults(
      {
        theme: resolveFunctionKeys(
          mergeExtensions(mergeThemes(allConfigs.map((t) => t?.theme ?? {})))
        ),
        corePlugins: resolveCorePlugins(allConfigs.map((c) => c.corePlugins)),
        plugins: resolvePluginLists(configs.map((c) => c?.plugins ?? [])),
      },
      ...allConfigs
    )
  )
}

let warnedAbout = new Set()
function normalizeConfig(config) {
  if (!warnedAbout.has('purge-deprecation') && config.hasOwnProperty('purge')) {
    log.warn([
      'The `purge` option in your tailwind.config.js file has been deprecated.',
      'Please rename this to `content` instead.',
    ])
    warnedAbout.add('purge-deprecation')
  }

  config.content = {
    content: (() => {
      let { content, purge } = config

      if (Array.isArray(purge)) return purge
      if (Array.isArray(purge?.content)) return purge.content
      if (Array.isArray(content)) return content
      if (Array.isArray(content?.content)) return content.content

      return []
    })(),
    safelist: (() => {
      let { content, purge } = config

      let [safelistKey, safelistPaths] = (() => {
        if (Array.isArray(content?.safelist)) return ['content.safelist', content.safelist]
        if (Array.isArray(purge?.safelist)) return ['purge.safelist', purge.safelist]
        if (Array.isArray(purge?.options?.safelist))
          return ['purge.options.safelist', purge.options.safelist]
        return [null, []]
      })()

      return safelistPaths.map((content) => {
        if (typeof content === 'string') {
          return { raw: content, extension: 'html' }
        }

        if (content instanceof RegExp) {
          throw new Error(
            `Values inside '${safelistKey}' can only be of type 'string', found 'regex'.`
          )
        }

        throw new Error(
          `Values inside '${safelistKey}' can only be of type 'string', found '${typeof content}'.`
        )
      })
    })(),
    extract: config.content?.extract || config.purge?.extract || {},
    options: config.content?.options || config.purge?.options || {},
    transform: config.content?.transform || config.purge?.transform || {},
  }

  return config
}
