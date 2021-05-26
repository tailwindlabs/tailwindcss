import fs from 'fs'
import url from 'url'
import path from 'path'
import postcss from 'postcss'
import dlv from 'dlv'
import selectorParser from 'postcss-selector-parser'
import normalizePath from 'normalize-path'

import transformThemeValue from '../../util/transformThemeValue'
import parseObjectStyles from '../../util/parseObjectStyles'
import prefixSelector from '../../util/prefixSelector'
import isPlainObject from '../../util/isPlainObject'
import escapeClassName from '../../util/escapeClassName'
import nameClass from '../../util/nameClass'
import { coerceValue } from '../../util/pluginUtils'
import corePlugins from '../corePlugins'
import * as sharedState from './sharedState'
import { env } from './sharedState'

function toPath(value) {
  if (Array.isArray(value)) {
    return value
  }

  let inBrackets = false
  let parts = []
  let chunk = ''

  for (let i = 0; i < value.length; i++) {
    let char = value[i]
    if (char === '[') {
      inBrackets = true
      parts.push(chunk)
      chunk = ''
      continue
    }
    if (char === ']' && inBrackets) {
      inBrackets = false
      parts.push(chunk)
      chunk = ''
      continue
    }
    if (char === '.' && !inBrackets && chunk.length > 0) {
      parts.push(chunk)
      chunk = ''
      continue
    }
    chunk = chunk + char
  }

  if (chunk.length > 0) {
    parts.push(chunk)
  }

  return parts
}

function insertInto(list, value, { before = [] } = {}) {
  before = [].concat(before)

  if (before.length <= 0) {
    list.push(value)
    return
  }

  let idx = list.length - 1
  for (let other of before) {
    let iidx = list.indexOf(other)
    if (iidx === -1) continue
    idx = Math.min(idx, iidx)
  }

  list.splice(idx, 0, value)
}

function parseStyles(styles) {
  if (!Array.isArray(styles)) {
    return parseStyles([styles])
  }

  return styles.flatMap((style) => {
    let isNode = !Array.isArray(style) && !isPlainObject(style)
    return isNode ? style : parseObjectStyles(style)
  })
}

function getClasses(selector) {
  let parser = selectorParser((selectors) => {
    let allClasses = []
    selectors.walkClasses((classNode) => {
      allClasses.push(classNode.value)
    })
    return allClasses
  })
  return parser.transformSync(selector)
}

function extractCandidates(node) {
  let classes = node.type === 'rule' ? getClasses(node.selector) : []

  if (node.type === 'atrule') {
    node.walkRules((rule) => {
      classes = [...classes, ...getClasses(rule.selector)]
    })
  }

  return classes
}

function withIdentifiers(styles) {
  return parseStyles(styles).flatMap((node) => {
    let nodeMap = new Map()
    let candidates = extractCandidates(node)

    // If this isn't "on-demandable", assign it a universal candidate.
    if (candidates.length === 0) {
      return [['*', node]]
    }

    return candidates.map((c) => {
      if (!nodeMap.has(node)) {
        nodeMap.set(node, node)
      }
      return [c, nodeMap.get(node)]
    })
  })
}

function buildPluginApi(tailwindConfig, context, { variantList, variantMap, offsets }) {
  function getConfigValue(path, defaultValue) {
    return path ? dlv(tailwindConfig, path, defaultValue) : tailwindConfig
  }

  function applyConfiguredPrefix(selector) {
    return prefixSelector(tailwindConfig.prefix, selector)
  }

  function prefixIdentifier(identifier, options) {
    if (identifier === '*') {
      return '*'
    }

    if (!options.respectPrefix) {
      return identifier
    }

    if (typeof context.tailwindConfig.prefix === 'function') {
      return prefixSelector(context.tailwindConfig.prefix, `.${identifier}`).substr(1)
    }

    return context.tailwindConfig.prefix + identifier
  }

  return {
    addVariant(variantName, applyThisVariant, options = {}) {
      insertInto(variantList, variantName, options)
      variantMap.set(variantName, applyThisVariant)
    },
    postcss,
    prefix: applyConfiguredPrefix,
    e: escapeClassName,
    config: getConfigValue,
    theme(path, defaultValue) {
      const [pathRoot, ...subPaths] = toPath(path)
      const value = getConfigValue(['theme', pathRoot, ...subPaths], defaultValue)
      return transformThemeValue(pathRoot)(value)
    },
    corePlugins: (path) => {
      if (Array.isArray(tailwindConfig.corePlugins)) {
        return tailwindConfig.corePlugins.includes(path)
      }

      return getConfigValue(['corePlugins', path], true)
    },
    variants: (path, defaultValue) => {
      if (Array.isArray(tailwindConfig.variants)) {
        return tailwindConfig.variants
      }

      return getConfigValue(['variants', path], defaultValue)
    },
    addBase(base) {
      for (let [identifier, rule] of withIdentifiers(base)) {
        let prefixedIdentifier = prefixIdentifier(identifier, {})
        let offset = offsets.base++

        if (!context.candidateRuleMap.has(prefixedIdentifier)) {
          context.candidateRuleMap.set(prefixedIdentifier, [])
        }

        context.candidateRuleMap
          .get(prefixedIdentifier)
          .push([{ sort: offset, layer: 'base' }, rule])
      }
    },
    addComponents(components, options) {
      let defaultOptions = {
        variants: [],
        respectPrefix: true,
        respectImportant: false,
        respectVariants: true,
      }

      options = Object.assign(
        {},
        defaultOptions,
        Array.isArray(options) ? { variants: options } : options
      )

      for (let [identifier, rule] of withIdentifiers(components)) {
        let prefixedIdentifier = prefixIdentifier(identifier, options)
        let offset = offsets.components++

        if (!context.candidateRuleMap.has(prefixedIdentifier)) {
          context.candidateRuleMap.set(prefixedIdentifier, [])
        }

        context.candidateRuleMap
          .get(prefixedIdentifier)
          .push([{ sort: offset, layer: 'components', options }, rule])
      }
    },
    addUtilities(utilities, options) {
      let defaultOptions = {
        variants: [],
        respectPrefix: true,
        respectImportant: true,
        respectVariants: true,
      }

      options = Object.assign(
        {},
        defaultOptions,
        Array.isArray(options) ? { variants: options } : options
      )

      for (let [identifier, rule] of withIdentifiers(utilities)) {
        let prefixedIdentifier = prefixIdentifier(identifier, options)
        let offset = offsets.utilities++

        if (!context.candidateRuleMap.has(prefixedIdentifier)) {
          context.candidateRuleMap.set(prefixedIdentifier, [])
        }

        context.candidateRuleMap
          .get(prefixedIdentifier)
          .push([{ sort: offset, layer: 'utilities', options }, rule])
      }
    },
    matchUtilities: function (utilities, options) {
      let defaultOptions = {
        variants: [],
        respectPrefix: true,
        respectImportant: true,
        respectVariants: true,
      }

      options = { ...defaultOptions, ...options }

      let offset = offsets.utilities++

      for (let identifier in utilities) {
        let prefixedIdentifier = prefixIdentifier(identifier, options)
        let rule = utilities[identifier]

        function wrapped(modifier) {
          let { type = 'any' } = options
          type = [].concat(type)
          let [value, coercedType] = coerceValue(type, modifier, options.values, tailwindConfig)

          if (!type.includes(coercedType) || value === undefined) {
            return []
          }

          let includedRules = []
          let ruleSets = []
            .concat(
              rule(value, {
                includeRules(rules) {
                  includedRules.push(...rules)
                },
              })
            )
            .filter(Boolean)
            .map((declaration) => ({
              [nameClass(identifier, modifier)]: declaration,
            }))

          return [...includedRules, ...ruleSets]
        }

        let withOffsets = [{ sort: offset, layer: 'utilities', options }, wrapped]

        if (!context.candidateRuleMap.has(prefixedIdentifier)) {
          context.candidateRuleMap.set(prefixedIdentifier, [])
        }

        context.candidateRuleMap.get(prefixedIdentifier).push(withOffsets)
      }
    },
  }
}

function trackModified(files, context) {
  let changed = false

  for (let file of files) {
    if (!file) continue

    let parsed = url.parse(file)
    let pathname = parsed.href.replace(parsed.hash, '').replace(parsed.search, '')
    let newModified = fs.statSync(decodeURIComponent(pathname)).mtimeMs

    if (!context.fileModifiedMap.has(file) || newModified > context.fileModifiedMap.get(file)) {
      changed = true
    }

    context.fileModifiedMap.set(file, newModified)
  }

  return changed
}

function extractVariantAtRules(node) {
  node.walkAtRules((atRule) => {
    if (['responsive', 'variants'].includes(atRule.name)) {
      extractVariantAtRules(atRule)
      atRule.before(atRule.nodes)
      atRule.remove()
    }
  })
}

function collectLayerPlugins(root) {
  let layerPlugins = []

  root.each((node) => {
    if (node.type === 'atrule' && ['responsive', 'variants'].includes(node.name)) {
      node.name = 'layer'
      node.params = 'utilities'
    }
  })

  // Walk @layer rules and treat them like plugins
  root.walkAtRules('layer', (layerRule) => {
    extractVariantAtRules(layerRule)

    if (layerRule.params === 'base') {
      for (let node of layerRule.nodes) {
        layerPlugins.push(function ({ addBase }) {
          addBase(node, { respectPrefix: false })
        })
      }
      layerRule.remove()
    } else if (layerRule.params === 'components') {
      for (let node of layerRule.nodes) {
        layerPlugins.push(function ({ addComponents }) {
          addComponents(node, { respectPrefix: false })
        })
      }
      layerRule.remove()
    } else if (layerRule.params === 'utilities') {
      for (let node of layerRule.nodes) {
        layerPlugins.push(function ({ addUtilities }) {
          addUtilities(node, { respectPrefix: false })
        })
      }
      layerRule.remove()
    }
  })

  return layerPlugins
}

function resolvePlugins(context, tailwindDirectives, root) {
  let corePluginList = Object.entries(corePlugins)
    .map(([name, plugin]) => {
      if (!context.tailwindConfig.corePlugins.includes(name)) {
        return null
      }

      return plugin
    })
    .filter(Boolean)

  let userPlugins = context.tailwindConfig.plugins.map((plugin) => {
    if (plugin.__isOptionsFunction) {
      plugin = plugin()
    }

    return typeof plugin === 'function' ? plugin : plugin.handler
  })

  let layerPlugins = collectLayerPlugins(root, tailwindDirectives)

  // TODO: This is a workaround for backwards compatibility, since custom variants
  // were historically sorted before screen/stackable variants.
  let beforeVariants = [corePlugins['pseudoClassVariants']]
  let afterVariants = [
    corePlugins['directionVariants'],
    corePlugins['reducedMotionVariants'],
    corePlugins['darkVariants'],
    corePlugins['screenVariants'],
  ]

  return [...corePluginList, ...beforeVariants, ...userPlugins, ...afterVariants, ...layerPlugins]
}

function registerPlugins(plugins, context) {
  let variantList = []
  let variantMap = new Map()
  let offsets = {
    base: 0n,
    components: 0n,
    utilities: 0n,
  }

  let pluginApi = buildPluginApi(context.tailwindConfig, context, {
    variantList,
    variantMap,
    offsets,
  })

  for (let plugin of plugins) {
    if (Array.isArray(plugin)) {
      for (let pluginItem of plugin) {
        pluginItem(pluginApi)
      }
    } else {
      plugin(pluginApi)
    }
  }

  let highestOffset = ((args) => args.reduce((m, e) => (e > m ? e : m)))([
    offsets.base,
    offsets.components,
    offsets.utilities,
  ])
  let reservedBits = BigInt(highestOffset.toString(2).length)

  context.layerOrder = {
    base: (1n << reservedBits) << 0n,
    components: (1n << reservedBits) << 1n,
    utilities: (1n << reservedBits) << 2n,
  }

  reservedBits += 3n
  context.variantOrder = variantList.reduce(
    (map, variant, i) => map.set(variant, (1n << BigInt(i)) << reservedBits),
    new Map()
  )

  context.minimumScreen = [...context.variantOrder.values()].shift()

  // Build variantMap
  for (let [variantName, variantFunction] of variantMap.entries()) {
    let sort = context.variantOrder.get(variantName)
    context.variantMap.set(variantName, [sort, variantFunction])
  }
}

let contextMap = sharedState.contextMap
let configContextMap = sharedState.configContextMap
let contextSourcesMap = sharedState.contextSourcesMap

function cleanupContext(context) {
  if (context.watcher) {
    context.watcher.close()
  }
}

export function getContext(
  configOrPath,
  tailwindDirectives,
  registerDependency,
  root,
  result,
  getTailwindConfig
) {
  let sourcePath = result.opts.from
  let [tailwindConfig, userConfigPath, tailwindConfigHash, configDependencies] =
    getTailwindConfig(configOrPath)
  let isConfigFile = userConfigPath !== null

  let contextDependencies = new Set(configDependencies)

  // If there are no @tailwind rules, we don't consider this CSS file or it's dependencies
  // to be dependencies of the context. Can reuse the context even if they change.
  // We may want to think about `@layer` being part of this trigger too, but it's tough
  // because it's impossible for a layer in one file to end up in the actual @tailwind rule
  // in another file since independent sources are effectively isolated.
  if (tailwindDirectives.size > 0) {
    // Add current css file as a context dependencies.
    contextDependencies.add(sourcePath)

    // Add all css @import dependencies as context dependencies.
    for (let message of result.messages) {
      if (message.type === 'dependency') {
        contextDependencies.add(message.file)
      }
    }
  }

  for (let file of configDependencies) {
    registerDependency(file)
  }

  env.DEBUG && console.log('Source path:', sourcePath)

  let existingContext

  if (isConfigFile && contextMap.has(sourcePath)) {
    existingContext = contextMap.get(sourcePath)
  } else if (configContextMap.has(tailwindConfigHash)) {
    let context = configContextMap.get(tailwindConfigHash)
    contextSourcesMap.get(context).add(sourcePath)
    contextMap.set(sourcePath, context)

    existingContext = context
  }

  // If there's already a context in the cache and we don't need to
  // reset the context, return the cached context.
  if (existingContext) {
    let contextDependenciesChanged = trackModified([...contextDependencies], existingContext)
    if (!contextDependenciesChanged) {
      return [existingContext, false]
    }
  }

  // If this source is in the context map, get the old context.
  // Remove this source from the context sources for the old context,
  // and clean up that context if no one else is using it. This can be
  // called by many processes in rapid succession, so we check for presence
  // first because the first process to run this code will wipe it out first.
  if (contextMap.has(sourcePath)) {
    let oldContext = contextMap.get(sourcePath)
    if (contextSourcesMap.has(oldContext)) {
      contextSourcesMap.get(oldContext).delete(sourcePath)
      if (contextSourcesMap.get(oldContext).size === 0) {
        contextSourcesMap.delete(oldContext)
        cleanupContext(oldContext)
      }
    }
  }

  env.DEBUG && console.log('Setting up new context...')

  let purgeContent = Array.isArray(tailwindConfig.purge)
    ? tailwindConfig.purge
    : tailwindConfig.purge.content

  let context = {
    watcher: null,
    touchFile: null,
    configPath: userConfigPath,
    configDependencies: new Set(),
    candidateFiles: purgeContent
      .filter((item) => typeof item === 'string')
      .map((purgePath) =>
        normalizePath(
          path.resolve(
            userConfigPath === null ? process.cwd() : path.dirname(userConfigPath),
            purgePath
          )
        )
      ),
    // Carry over the existing modified map if we have one.
    fileModifiedMap: new Map(existingContext ? existingContext.fileModifiedMap : undefined),
    // ---
    ruleCache: new Set(), // Hit
    classCache: new Map(), // Hit
    applyClassCache: new Map(), // Hit
    notClassCache: new Set(), // Hit
    postCssNodeCache: new Map(), // Hit
    candidateRuleMap: new Map(), // Hit
    tailwindConfig: tailwindConfig, // Hit
    changedContent: purgeContent // Hit
      .filter((item) => typeof item.raw === 'string')
      .map(({ raw, extension }) => ({ content: raw, extension })),
    variantMap: new Map(), // Hit
    stylesheetCache: null, // Hit
  }

  if (!existingContext) {
    // If we didn't have an existing modified map then populate it now.
    trackModified([...contextDependencies], context)
  }

  // ---

  // Update all context tracking state

  configContextMap.set(tailwindConfigHash, context)
  contextMap.set(sourcePath, context)

  if (!contextSourcesMap.has(context)) {
    contextSourcesMap.set(context, new Set())
  }

  contextSourcesMap.get(context).add(sourcePath)

  registerPlugins(resolvePlugins(context, tailwindDirectives, root), context)

  return [context, true]
}
