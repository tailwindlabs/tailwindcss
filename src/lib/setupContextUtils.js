import fs from 'fs'
import url from 'url'
import postcss from 'postcss'
import dlv from 'dlv'
import selectorParser from 'postcss-selector-parser'

import transformThemeValue from '../util/transformThemeValue'
import parseObjectStyles from '../util/parseObjectStyles'
import prefixSelector from '../util/prefixSelector'
import isPlainObject from '../util/isPlainObject'
import escapeClassName from '../util/escapeClassName'
import nameClass, { formatClass } from '../util/nameClass'
import { coerceValue } from '../util/pluginUtils'
import bigSign from '../util/bigSign'
import { variantPlugins, corePlugins } from '../corePlugins'
import * as sharedState from './sharedState'
import { env } from './sharedState'
import { toPath } from '../util/toPath'
import log from '../util/log'
import negateValue from '../util/negateValue'
import isValidArbitraryValue from '../util/isValidArbitraryValue'
import { generateRules } from './generateRules'

function prefix(context, selector) {
  let prefix = context.tailwindConfig.prefix
  return typeof prefix === 'function' ? prefix(selector) : prefix + selector
}

function parseVariantFormatString(input) {
  if (input.includes('{')) {
    if (!isBalanced(input)) throw new Error(`Your { and } are unbalanced.`)

    return input
      .split(/{(.*)}/gim)
      .flatMap((line) => parseVariantFormatString(line))
      .filter(Boolean)
  }

  return [input.trim()]
}

function isBalanced(input) {
  let count = 0

  for (let char of input) {
    if (char === '{') {
      count++
    } else if (char === '}') {
      if (--count < 0) {
        return false // unbalanced
      }
    }
  }

  return count === 0
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

function extractCandidates(node, state = { containsNonOnDemandable: false }, depth = 0) {
  let classes = []

  // Handle normal rules
  if (node.type === 'rule') {
    for (let selector of node.selectors) {
      let classCandidates = getClasses(selector)
      // At least one of the selectors contains non-"on-demandable" candidates.
      if (classCandidates.length === 0) {
        state.containsNonOnDemandable = true
      }

      for (let classCandidate of classCandidates) {
        classes.push(classCandidate)
      }
    }
  }

  // Handle at-rules (which contains nested rules)
  else if (node.type === 'atrule') {
    node.walkRules((rule) => {
      for (let classCandidate of rule.selectors.flatMap((selector) =>
        getClasses(selector, state, depth + 1)
      )) {
        classes.push(classCandidate)
      }
    })
  }

  if (depth === 0) {
    return [state.containsNonOnDemandable || classes.length === 0, classes]
  }

  return classes
}

function withIdentifiers(styles) {
  return parseStyles(styles).flatMap((node) => {
    let nodeMap = new Map()
    let [containsNonOnDemandableSelectors, candidates] = extractCandidates(node)

    // If this isn't "on-demandable", assign it a universal candidate to always include it.
    if (containsNonOnDemandableSelectors) {
      candidates.unshift('*')
    }

    // However, it could be that it also contains "on-demandable" candidates.
    // E.g.: `span, .foo {}`, in that case it should still be possible to use
    // `@apply foo` for example.
    return candidates.map((c) => {
      if (!nodeMap.has(node)) {
        nodeMap.set(node, node)
      }
      return [c, nodeMap.get(node)]
    })
  })
}

function buildPluginApi(tailwindConfig, context, { variantList, variantMap, offsets, classList }) {
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

    return context.tailwindConfig.prefix + identifier
  }

  return {
    addVariant(variantName, variantFunctions, options = {}) {
      variantFunctions = [].concat(variantFunctions).map((variantFunction) => {
        if (typeof variantFunction !== 'string') {
          // Safelist public API functions
          return ({ modifySelectors, container, separator }) => {
            return variantFunction({ modifySelectors, container, separator })
          }
        }

        variantFunction = variantFunction
          .replace(/\n+/g, '')
          .replace(/\s{1,}/g, ' ')
          .trim()

        let fns = parseVariantFormatString(variantFunction)
          .map((str) => {
            if (!str.startsWith('@')) {
              return ({ format }) => format(str)
            }

            let [, name, params] = /@(.*?) (.*)/g.exec(str)
            return ({ wrap }) => wrap(postcss.atRule({ name, params }))
          })
          .reverse()

        return (api) => {
          for (let fn of fns) {
            fn(api)
          }
        }
      })

      insertInto(variantList, variantName, options)
      variantMap.set(variantName, variantFunctions)
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
    variants: () => {
      // Preserved for backwards compatibility but not used in v3.0+
      return []
    },
    addUserCss(userCss) {
      for (let [identifier, rule] of withIdentifiers(userCss)) {
        let offset = offsets.user++

        if (!context.candidateRuleMap.has(identifier)) {
          context.candidateRuleMap.set(identifier, [])
        }

        context.candidateRuleMap.get(identifier).push([{ sort: offset, layer: 'user' }, rule])
      }
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
    /**
     * @param {string} group
     * @param {Record<string, string | string[]>} declarations
     */
    addDefaults(group, declarations) {
      const groups = {
        [`@defaults ${group}`]: declarations,
      }

      for (let [identifier, rule] of withIdentifiers(groups)) {
        let prefixedIdentifier = prefixIdentifier(identifier, {})

        if (!context.candidateRuleMap.has(prefixedIdentifier)) {
          context.candidateRuleMap.set(prefixedIdentifier, [])
        }

        context.candidateRuleMap
          .get(prefixedIdentifier)
          .push([{ sort: offsets.base++, layer: 'defaults' }, rule])
      }
    },
    addComponents(components, options) {
      let defaultOptions = {
        respectPrefix: true,
        respectImportant: false,
      }

      options = Object.assign({}, defaultOptions, Array.isArray(options) ? {} : options)

      for (let [identifier, rule] of withIdentifiers(components)) {
        let prefixedIdentifier = prefixIdentifier(identifier, options)

        classList.add(prefixedIdentifier)

        if (!context.candidateRuleMap.has(prefixedIdentifier)) {
          context.candidateRuleMap.set(prefixedIdentifier, [])
        }

        context.candidateRuleMap
          .get(prefixedIdentifier)
          .push([{ sort: offsets.components++, layer: 'components', options }, rule])
      }
    },
    addUtilities(utilities, options) {
      let defaultOptions = {
        respectPrefix: true,
        respectImportant: true,
      }

      options = Object.assign({}, defaultOptions, Array.isArray(options) ? {} : options)

      for (let [identifier, rule] of withIdentifiers(utilities)) {
        let prefixedIdentifier = prefixIdentifier(identifier, options)

        classList.add(prefixedIdentifier)

        if (!context.candidateRuleMap.has(prefixedIdentifier)) {
          context.candidateRuleMap.set(prefixedIdentifier, [])
        }

        context.candidateRuleMap
          .get(prefixedIdentifier)
          .push([{ sort: offsets.utilities++, layer: 'utilities', options }, rule])
      }
    },
    matchUtilities: function (utilities, options) {
      let defaultOptions = {
        respectPrefix: true,
        respectImportant: true,
      }

      options = { ...defaultOptions, ...options }

      let offset = offsets.utilities++

      for (let identifier in utilities) {
        let prefixedIdentifier = prefixIdentifier(identifier, options)
        let rule = utilities[identifier]

        classList.add([prefixedIdentifier, options])

        function wrapped(modifier, { isOnlyPlugin }) {
          let { type = 'any' } = options
          type = [].concat(type)
          let [value, coercedType] = coerceValue(type, modifier, options, tailwindConfig)

          if (value === undefined) {
            return []
          }

          if (!type.includes(coercedType) && !isOnlyPlugin) {
            return []
          }

          if (!isValidArbitraryValue(value)) {
            return []
          }

          let ruleSets = []
            .concat(rule(value))
            .filter(Boolean)
            .map((declaration) => ({
              [nameClass(identifier, modifier)]: declaration,
            }))

          return ruleSets
        }

        let withOffsets = [{ sort: offset, layer: 'utilities', options }, wrapped]

        if (!context.candidateRuleMap.has(prefixedIdentifier)) {
          context.candidateRuleMap.set(prefixedIdentifier, [])
        }

        context.candidateRuleMap.get(prefixedIdentifier).push(withOffsets)
      }
    },
    matchComponents: function (components, options) {
      let defaultOptions = {
        respectPrefix: true,
        respectImportant: false,
      }

      options = { ...defaultOptions, ...options }

      let offset = offsets.components++

      for (let identifier in components) {
        let prefixedIdentifier = prefixIdentifier(identifier, options)
        let rule = components[identifier]

        classList.add([prefixedIdentifier, options])

        function wrapped(modifier, { isOnlyPlugin }) {
          let { type = 'any' } = options
          type = [].concat(type)
          let [value, coercedType] = coerceValue(type, modifier, options, tailwindConfig)

          if (value === undefined) {
            return []
          }

          if (!type.includes(coercedType)) {
            if (isOnlyPlugin) {
              log.warn([
                `Unnecessary typehint \`${coercedType}\` in \`${identifier}-${modifier}\`.`,
                `You can safely update it to \`${identifier}-${modifier.replace(
                  coercedType + ':',
                  ''
                )}\`.`,
              ])
            } else {
              return []
            }
          }

          if (!isValidArbitraryValue(value)) {
            return []
          }

          let ruleSets = []
            .concat(rule(value))
            .filter(Boolean)
            .map((declaration) => ({
              [nameClass(identifier, modifier)]: declaration,
            }))

          return ruleSets
        }

        let withOffsets = [{ sort: offset, layer: 'components', options }, wrapped]

        if (!context.candidateRuleMap.has(prefixedIdentifier)) {
          context.candidateRuleMap.set(prefixedIdentifier, [])
        }

        context.candidateRuleMap.get(prefixedIdentifier).push(withOffsets)
      }
    },
  }
}

let fileModifiedMapCache = new WeakMap()
export function getFileModifiedMap(context) {
  if (!fileModifiedMapCache.has(context)) {
    fileModifiedMapCache.set(context, new Map())
  }
  return fileModifiedMapCache.get(context)
}

function trackModified(files, fileModifiedMap) {
  let changed = false

  for (let file of files) {
    if (!file) continue

    let parsed = url.parse(file)
    let pathname = parsed.hash ? parsed.href.replace(parsed.hash, '') : parsed.href
    pathname = parsed.search ? pathname.replace(parsed.search, '') : pathname
    let newModified = fs.statSync(decodeURIComponent(pathname), { throwIfNoEntry: false })?.mtimeMs
    if (!newModified) {
      // It could happen that a file is passed in that doesn't exist. E.g.:
      // postcss-cli will provide you a fake path when reading from stdin. This
      // path then looks like /path-to-your-project/stdin In that case we just
      // want to ignore it and don't track changes at all.
      continue
    }

    if (!fileModifiedMap.has(file) || newModified > fileModifiedMap.get(file)) {
      changed = true
    }

    fileModifiedMap.set(file, newModified)
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

  root.walkRules((rule) => {
    // At this point it is safe to include all the left-over css from the
    // user's css file. This is because the `@tailwind` and `@layer` directives
    // will already be handled and will be removed from the css tree.
    layerPlugins.push(function ({ addUserCss }) {
      addUserCss(rule, { respectPrefix: false })
    })
  })

  return layerPlugins
}

function resolvePlugins(context, root) {
  let corePluginList = Object.entries({ ...variantPlugins, ...corePlugins })
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

  let layerPlugins = collectLayerPlugins(root)

  // TODO: This is a workaround for backwards compatibility, since custom variants
  // were historically sorted before screen/stackable variants.
  let beforeVariants = [
    variantPlugins['pseudoElementVariants'],
    variantPlugins['pseudoClassVariants'],
  ]
  let afterVariants = [
    variantPlugins['directionVariants'],
    variantPlugins['reducedMotionVariants'],
    variantPlugins['darkVariants'],
    variantPlugins['printVariant'],
    variantPlugins['screenVariants'],
    variantPlugins['orientationVariants'],
  ]

  return [...corePluginList, ...beforeVariants, ...userPlugins, ...afterVariants, ...layerPlugins]
}

function registerPlugins(plugins, context) {
  let variantList = []
  let variantMap = new Map()
  let offsets = {
    defaults: 0n,
    base: 0n,
    components: 0n,
    utilities: 0n,
    user: 0n,
  }

  let classList = new Set()

  let pluginApi = buildPluginApi(context.tailwindConfig, context, {
    variantList,
    variantMap,
    offsets,
    classList,
  })

  for (let plugin of plugins) {
    if (Array.isArray(plugin)) {
      for (let pluginItem of plugin) {
        pluginItem(pluginApi)
      }
    } else {
      plugin?.(pluginApi)
    }
  }

  let highestOffset = ((args) => args.reduce((m, e) => (e > m ? e : m)))([
    offsets.base,
    offsets.defaults,
    offsets.components,
    offsets.utilities,
    offsets.user,
  ])
  let reservedBits = BigInt(highestOffset.toString(2).length)

  // A number one less than the top range of the highest offset area
  // so arbitrary properties are always sorted at the end.
  context.arbitraryPropertiesSort = ((1n << reservedBits) << 0n) - 1n

  context.layerOrder = {
    defaults: (1n << reservedBits) << 0n,
    base: (1n << reservedBits) << 1n,
    components: (1n << reservedBits) << 2n,
    utilities: (1n << reservedBits) << 3n,
    user: (1n << reservedBits) << 4n,
  }

  reservedBits += 5n

  let offset = 0
  context.variantOrder = new Map(
    variantList
      .map((variant, i) => {
        let variantFunctions = variantMap.get(variant).length
        let bits = (1n << BigInt(i + offset)) << reservedBits
        offset += variantFunctions - 1
        return [variant, bits]
      })
      .sort(([, a], [, z]) => bigSign(a - z))
  )

  context.minimumScreen = [...context.variantOrder.values()].shift()

  // Build variantMap
  for (let [variantName, variantFunctions] of variantMap.entries()) {
    let sort = context.variantOrder.get(variantName)
    context.variantMap.set(
      variantName,
      variantFunctions.map((variantFunction, idx) => [sort << BigInt(idx), variantFunction])
    )
  }

  let safelist = (context.tailwindConfig.safelist ?? []).filter(Boolean)
  if (safelist.length > 0) {
    let checks = []

    for (let value of safelist) {
      if (typeof value === 'string') {
        context.changedContent.push({ content: value, extension: 'html' })
        continue
      }

      if (value instanceof RegExp) {
        log.warn('root-regex', [
          'Regular expressions in `safelist` work differently in Tailwind CSS v3.0.',
          'Update your `safelist` configuration to eliminate this warning.',
          'https://tailwindcss.com/docs/content-configuration#safelisting-classes',
        ])
        continue
      }

      checks.push(value)
    }

    if (checks.length > 0) {
      let patternMatchingCount = new Map()
      let prefixLength = context.tailwindConfig.prefix.length

      for (let util of classList) {
        let utils = Array.isArray(util)
          ? (() => {
              let [utilName, options] = util
              let values = Object.keys(options?.values ?? {})
              let classes = values.map((value) => formatClass(utilName, value))

              if (options?.supportsNegativeValues) {
                // This is the normal negated version
                // e.g. `-inset-1` or `-tw-inset-1`
                classes = [...classes, ...classes.map((cls) => '-' + cls)]

                // This is the negated version *after* the prefix
                // e.g. `tw--inset-1`
                // The prefix is already attached to util name
                // So we add the negative after the prefix
                classes = [
                  ...classes,
                  ...classes.map(
                    (cls) => cls.slice(0, prefixLength) + '-' + cls.slice(prefixLength)
                  ),
                ]
              }

              return classes
            })()
          : [util]

        for (let util of utils) {
          for (let { pattern, variants = [] } of checks) {
            // RegExp with the /g flag are stateful, so let's reset the last
            // index pointer to reset the state.
            pattern.lastIndex = 0

            if (!patternMatchingCount.has(pattern)) {
              patternMatchingCount.set(pattern, 0)
            }

            if (!pattern.test(util)) continue

            patternMatchingCount.set(pattern, patternMatchingCount.get(pattern) + 1)

            context.changedContent.push({ content: util, extension: 'html' })
            for (let variant of variants) {
              context.changedContent.push({
                content: variant + context.tailwindConfig.separator + util,
                extension: 'html',
              })
            }
          }
        }
      }

      for (let [regex, count] of patternMatchingCount.entries()) {
        if (count !== 0) continue

        log.warn([
          `The safelist pattern \`${regex}\` doesn't match any Tailwind CSS classes.`,
          'Fix this pattern or remove it from your `safelist` configuration.',
          'https://tailwindcss.com/docs/content-configuration#safelisting-classes',
        ])
      }
    }
  }

  // A list of utilities that are used by certain Tailwind CSS utilities but
  // that don't exist on their own. This will result in them "not existing" and
  // sorting could be weird since you still require them in order to make the
  // host utitlies work properly. (Thanks Biology)
  let parasiteUtilities = new Set([prefix(context, 'group'), prefix(context, 'peer')])
  context.sortClassList = function sortClassList(classes) {
    let sortedClassNames = new Map()
    for (let [sort, rule] of generateRules(new Set(classes), context)) {
      if (sortedClassNames.has(rule.raws.tailwind.candidate)) continue
      sortedClassNames.set(rule.raws.tailwind.candidate, sort)
    }

    return classes
      .map((className) => {
        let order = sortedClassNames.get(className) ?? null

        if (order === null && parasiteUtilities.has(className)) {
          // This will make sure that it is at the very beginning of the
          // `components` layer which technically means 'before any
          // components'.
          order = context.layerOrder.components
        }

        return [className, order]
      })
      .sort(([, a], [, z]) => {
        if (a === z) return 0
        if (a === null) return -1
        if (z === null) return 1
        return bigSign(a - z)
      })
      .map(([className]) => className)
  }

  // Generate a list of strings for autocompletion purposes, e.g.
  // ['uppercase', 'lowercase', ...]
  context.getClassList = function getClassList() {
    let output = []

    for (let util of classList) {
      if (Array.isArray(util)) {
        let [utilName, options] = util
        let negativeClasses = []

        for (let [key, value] of Object.entries(options?.values ?? {})) {
          output.push(formatClass(utilName, key))
          if (options?.supportsNegativeValues && negateValue(value)) {
            negativeClasses.push(formatClass(utilName, `-${key}`))
          }
        }

        output.push(...negativeClasses)
      } else {
        output.push(util)
      }
    }

    return output
  }
}

export function createContext(tailwindConfig, changedContent = [], root = postcss.root()) {
  let context = {
    disposables: [],
    ruleCache: new Set(),
    classCache: new Map(),
    applyClassCache: new Map(),
    notClassCache: new Set(),
    postCssNodeCache: new Map(),
    candidateRuleMap: new Map(),
    tailwindConfig,
    changedContent: changedContent,
    variantMap: new Map(),
    stylesheetCache: null,
  }

  let resolvedPlugins = resolvePlugins(context, root)
  registerPlugins(resolvedPlugins, context)

  return context
}

let contextMap = sharedState.contextMap
let configContextMap = sharedState.configContextMap
let contextSourcesMap = sharedState.contextSourcesMap

export function getContext(
  root,
  result,
  tailwindConfig,
  userConfigPath,
  tailwindConfigHash,
  contextDependencies
) {
  let sourcePath = result.opts.from
  let isConfigFile = userConfigPath !== null

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
    let contextDependenciesChanged = trackModified(
      [...contextDependencies],
      getFileModifiedMap(existingContext)
    )
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
        for (let [tailwindConfigHash, context] of configContextMap) {
          if (context === oldContext) {
            configContextMap.delete(tailwindConfigHash)
          }
        }
        for (let disposable of oldContext.disposables.splice(0)) {
          disposable(oldContext)
        }
      }
    }
  }

  env.DEBUG && console.log('Setting up new context...')

  let context = createContext(tailwindConfig, [], root)

  trackModified([...contextDependencies], getFileModifiedMap(context))

  // ---

  // Update all context tracking state

  configContextMap.set(tailwindConfigHash, context)
  contextMap.set(sourcePath, context)

  if (!contextSourcesMap.has(context)) {
    contextSourcesMap.set(context, new Set())
  }

  contextSourcesMap.get(context).add(sourcePath)

  return [context, true]
}
