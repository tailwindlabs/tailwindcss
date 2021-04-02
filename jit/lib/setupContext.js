const fs = require('fs')
const url = require('url')
const os = require('os')
const path = require('path')
const crypto = require('crypto')
const chokidar = require('chokidar')
const postcss = require('postcss')
const hash = require('object-hash')
const dlv = require('dlv')
const selectorParser = require('postcss-selector-parser')
const LRU = require('quick-lru')
const normalizePath = require('normalize-path')

const transformThemeValue = require('../../lib/util/transformThemeValue').default
const parseObjectStyles = require('../../lib/util/parseObjectStyles').default
const getModuleDependencies = require('../../lib/lib/getModuleDependencies').default
const prefixSelector = require('../../lib/util/prefixSelector').default

const resolveConfig = require('../../resolveConfig')

const sharedState = require('./sharedState')
const corePlugins = require('../corePlugins')
const { isPlainObject, escapeClassName } = require('./utils')

let contextMap = sharedState.contextMap
let configContextMap = sharedState.configContextMap
let contextSourcesMap = sharedState.contextSourcesMap
let env = sharedState.env

// Earmarks a directory for our touch files.
// If the directory already exists we delete any existing touch files,
// invalidating any caches associated with them.
const touchDir =
  env.TAILWIND_TOUCH_DIR || path.join(os.homedir() || os.tmpdir(), '.tailwindcss', 'touch')

if (!sharedState.env.TAILWIND_DISABLE_TOUCH) {
  if (fs.existsSync(touchDir)) {
    for (let file of fs.readdirSync(touchDir)) {
      try {
        fs.unlinkSync(path.join(touchDir, file))
      } catch (_err) {}
    }
  } else {
    fs.mkdirSync(touchDir, { recursive: true })
  }
}

// This is used to trigger rebuilds. Just updating the timestamp
// is significantly faster than actually writing to the file (10x).

function touch(filename) {
  let time = new Date()

  try {
    fs.utimesSync(filename, time, time)
  } catch (err) {
    fs.closeSync(fs.openSync(filename, 'w'))
  }
}

function isObject(value) {
  return typeof value === 'object' && value !== null
}

function isEmpty(obj) {
  return Object.keys(obj).length === 0
}

function isString(value) {
  return typeof value === 'string' || value instanceof String
}

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

function resolveConfigPath(pathOrConfig) {
  // require('tailwindcss')({ theme: ..., variants: ... })
  if (isObject(pathOrConfig) && pathOrConfig.config === undefined && !isEmpty(pathOrConfig)) {
    return null
  }

  // require('tailwindcss')({ config: 'custom-config.js' })
  if (
    isObject(pathOrConfig) &&
    pathOrConfig.config !== undefined &&
    isString(pathOrConfig.config)
  ) {
    return path.resolve(pathOrConfig.config)
  }

  // require('tailwindcss')({ config: { theme: ..., variants: ... } })
  if (
    isObject(pathOrConfig) &&
    pathOrConfig.config !== undefined &&
    isObject(pathOrConfig.config)
  ) {
    return null
  }

  // require('tailwindcss')('custom-config.js')
  if (isString(pathOrConfig)) {
    return path.resolve(pathOrConfig)
  }

  // require('tailwindcss')
  for (const configFile of ['./tailwind.config.js', './tailwind.config.cjs']) {
    try {
      const configPath = path.resolve(configFile)
      fs.accessSync(configPath)
      return configPath
    } catch (err) {}
  }

  return null
}

let configPathCache = new LRU({ maxSize: 100 })

// Get the config object based on a path
function getTailwindConfig(configOrPath) {
  let userConfigPath = resolveConfigPath(configOrPath)

  if (sharedState.env.TAILWIND_DISABLE_TOUCH) {
    if (userConfigPath !== null) {
      let [prevConfig, prevConfigHash, prevDeps, prevModified] =
        configPathCache.get(userConfigPath) || []

      let newDeps = getModuleDependencies(userConfigPath).map((dep) => dep.file)

      let modified = false
      let newModified = new Map()
      for (let file of newDeps) {
        let time = fs.statSync(file).mtimeMs
        newModified.set(file, time)
        if (!prevModified || !prevModified.has(file) || time > prevModified.get(file)) {
          modified = true
        }
      }

      // It hasn't changed (based on timestamps)
      if (!modified) {
        return [prevConfig, userConfigPath, prevConfigHash, prevDeps]
      }

      // It has changed (based on timestamps), or first run
      for (let file of newDeps) {
        delete require.cache[file]
      }
      let newConfig = resolveConfig(require(userConfigPath))
      let newHash = hash(newConfig)
      configPathCache.set(userConfigPath, [newConfig, newHash, newDeps, newModified])
      return [newConfig, userConfigPath, newHash, newDeps]
    }

    // It's a plain object, not a path
    let newConfig = resolveConfig(
      configOrPath.config === undefined ? configOrPath : configOrPath.config
    )

    return [newConfig, null, hash(newConfig), []]
  }

  if (userConfigPath !== null) {
    let [prevConfig, prevModified = -Infinity, prevConfigHash] =
      configPathCache.get(userConfigPath) || []
    let modified = fs.statSync(userConfigPath).mtimeMs

    // It hasn't changed (based on timestamp)
    if (modified <= prevModified) {
      return [prevConfig, userConfigPath, prevConfigHash]
    }

    // It has changed (based on timestamp), or first run
    delete require.cache[userConfigPath]
    let newConfig = resolveConfig(require(userConfigPath))
    let newHash = hash(newConfig)
    configPathCache.set(userConfigPath, [newConfig, modified, newHash])
    return [newConfig, userConfigPath, newHash]
  }

  // It's a plain object, not a path
  let newConfig = resolveConfig(
    configOrPath.config === undefined ? configOrPath : configOrPath.config
  )

  return [newConfig, null, hash(newConfig)]
}

let fileModifiedMap = new Map()

function trackModified(files) {
  let changed = false

  for (let file of files) {
    let pathname = url.parse(file).pathname
    let newModified = fs.statSync(decodeURIComponent(pathname)).mtimeMs

    if (!fileModifiedMap.has(file) || newModified > fileModifiedMap.get(file)) {
      changed = true
    }

    fileModifiedMap.set(file, newModified)
  }

  return changed
}

function generateTouchFileName() {
  let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
  let randomChars = ''
  let randomCharsLength = 12
  let bytes = null

  try {
    bytes = crypto.randomBytes(randomCharsLength)
  } catch (_error) {
    bytes = crypto.pseudoRandomBytes(randomCharsLength)
  }

  for (let i = 0; i < randomCharsLength; i++) {
    randomChars += chars[bytes[i] % chars.length]
  }

  return path.join(touchDir, `touch-${process.pid}-${randomChars}`)
}

function rebootWatcher(context) {
  if (env.TAILWIND_DISABLE_TOUCH) {
    return
  }

  if (context.touchFile === null) {
    context.touchFile = generateTouchFileName()
    touch(context.touchFile)
  }

  if (env.TAILWIND_MODE === 'build') {
    return
  }

  if (
    env.TAILWIND_MODE === 'watch' ||
    (env.TAILWIND_MODE === undefined && env.NODE_ENV === 'development')
  ) {
    Promise.resolve(context.watcher ? context.watcher.close() : null).then(() => {
      context.watcher = chokidar.watch([...context.candidateFiles, ...context.configDependencies], {
        ignoreInitial: true,
      })

      context.watcher.on('add', (file) => {
        context.changedFiles.add(path.resolve('.', file))
        touch(context.touchFile)
      })

      context.watcher.on('change', (file) => {
        // If it was a config dependency, touch the config file to trigger a new context.
        // This is not really that clean of a solution but it's the fastest, because we
        // can do a very quick check on each build to see if the config has changed instead
        // of having to get all of the module dependencies and check every timestamp each
        // time.
        if (context.configDependencies.has(file)) {
          for (let dependency of context.configDependencies) {
            delete require.cache[require.resolve(dependency)]
          }
          touch(context.configPath)
        } else {
          context.changedFiles.add(path.resolve('.', file))
          touch(context.touchFile)
        }
      })

      context.watcher.on('unlink', (file) => {
        // Touch the config file if any of the dependencies are deleted.
        if (context.configDependencies.has(file)) {
          for (let dependency of context.configDependencies) {
            delete require.cache[require.resolve(dependency)]
          }
          touch(context.configPath)
        }
      })
    })
  }
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
    matchBase: function (base) {
      let offset = offsets.base++

      for (let identifier in base) {
        let prefixedIdentifier = prefixIdentifier(identifier, options)
        let value = [].concat(base[identifier])

        let withOffsets = value.map((rule) => [{ sort: offset, layer: 'base' }, rule])

        if (!context.candidateRuleMap.has(prefixedIdentifier)) {
          context.candidateRuleMap.set(prefixedIdentifier, [])
        }

        context.candidateRuleMap.get(prefixedIdentifier).push(...withOffsets)
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
        let value = [].concat(utilities[identifier])

        let withOffsets = value.map((rule) => [{ sort: offset, layer: 'utilities', options }, rule])

        if (!context.candidateRuleMap.has(prefixedIdentifier)) {
          context.candidateRuleMap.set(prefixedIdentifier, [])
        }

        context.candidateRuleMap.get(prefixedIdentifier).push(...withOffsets)
      }
    },
    // ---
    jit: {
      e: escapeClassName,
      config: tailwindConfig,
      theme: tailwindConfig.theme,
      addVariant(variantName, applyVariant, options = {}) {
        insertInto(variantList, variantName, options)
        variantMap.set(variantName, applyVariant)
      },
    },
  }
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
  root.walkAtRules('layer', (layerNode) => {
    extractVariantAtRules(layerNode)

    if (layerNode.params === 'base') {
      for (let node of layerNode.nodes) {
        layerPlugins.push(function ({ addBase }) {
          addBase(node, { respectPrefix: false })
        })
      }
    } else if (layerNode.params === 'components') {
      for (let node of layerNode.nodes) {
        layerPlugins.push(function ({ addComponents }) {
          addComponents(node, { respectPrefix: false })
        })
      }
    } else if (layerNode.params === 'utilities') {
      for (let node of layerNode.nodes) {
        layerPlugins.push(function ({ addUtilities }) {
          addUtilities(node, { respectPrefix: false })
        })
      }
    }
  })

  return layerPlugins
}

function registerPlugins(tailwindConfig, plugins, context) {
  let variantList = []
  let variantMap = new Map()
  let offsets = {
    base: 0n,
    components: 0n,
    utilities: 0n,
  }

  let pluginApi = buildPluginApi(tailwindConfig, context, {
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

function cleanupContext(context) {
  if (context.watcher) {
    context.watcher.close()
  }
}

// Retrieve an existing context from cache if possible (since contexts are unique per
// source path), or set up a new one (including setting up watchers and registering
// plugins) then return it
function setupContext(configOrPath) {
  return (result, root) => {
    let foundTailwind = false

    root.walkAtRules('tailwind', () => {
      foundTailwind = true
    })

    let sourcePath = result.opts.from
    let [
      tailwindConfig,
      userConfigPath,
      tailwindConfigHash,
      configDependencies,
    ] = getTailwindConfig(configOrPath)
    let isConfigFile = userConfigPath !== null

    let contextDependencies = new Set(
      sharedState.env.TAILWIND_DISABLE_TOUCH ? configDependencies : []
    )

    // If there are no @tailwind rules, we don't consider this CSS file or it's dependencies
    // to be dependencies of the context. Can reuse the context even if they change.
    // We may want to think about `@layer` being part of this trigger too, but it's tough
    // because it's impossible for a layer in one file to end up in the actual @tailwind rule
    // in another file since independent sources are effectively isolated.
    if (foundTailwind) {
      contextDependencies.add(sourcePath)
      for (let message of result.messages) {
        if (message.type === 'dependency') {
          contextDependencies.add(message.file)
        }
      }
    }

    if (sharedState.env.TAILWIND_DISABLE_TOUCH) {
      for (let file of configDependencies) {
        result.messages.push({
          type: 'dependency',
          plugin: 'tailwindcss-jit',
          parent: result.opts.from,
          file,
        })
      }
    } else {
      if (isConfigFile) {
        contextDependencies.add(userConfigPath)
      }
    }

    let contextDependenciesChanged = trackModified([...contextDependencies])

    process.env.DEBUG && console.log('Source path:', sourcePath)

    if (!contextDependenciesChanged) {
      // If this file already has a context in the cache and we don't need to
      // reset the context, return the cached context.
      if (isConfigFile && contextMap.has(sourcePath)) {
        return contextMap.get(sourcePath)
      }

      // If the config used already exists in the cache, return that.
      if (configContextMap.has(tailwindConfigHash)) {
        let context = configContextMap.get(tailwindConfigHash)
        contextSourcesMap.get(context).add(sourcePath)
        contextMap.set(sourcePath, context)
        return context
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

    process.env.DEBUG && console.log('Setting up new context...')

    let context = {
      changedFiles: new Set(),
      ruleCache: new Set(),
      watcher: null,
      scannedContent: false,
      touchFile: null,
      classCache: new Map(),
      applyClassCache: new Map(),
      notClassCache: new Set(),
      postCssNodeCache: new Map(),
      candidateRuleMap: new Map(),
      configPath: userConfigPath,
      tailwindConfig: tailwindConfig,
      configDependencies: new Set(),
      candidateFiles: (Array.isArray(tailwindConfig.purge)
        ? tailwindConfig.purge
        : tailwindConfig.purge.content
      ).map((path) => normalizePath(path)),
      variantMap: new Map(),
      stylesheetCache: null,
      fileModifiedMap: new Map(),
    }

    // ---

    // Update all context tracking state

    configContextMap.set(tailwindConfigHash, context)
    contextMap.set(sourcePath, context)

    if (!contextSourcesMap.has(context)) {
      contextSourcesMap.set(context, new Set())
    }

    contextSourcesMap.get(context).add(sourcePath)

    // ---

    if (isConfigFile && !sharedState.env.TAILWIND_DISABLE_TOUCH) {
      for (let dependency of getModuleDependencies(userConfigPath)) {
        if (dependency.file === userConfigPath) {
          continue
        }

        context.configDependencies.add(dependency.file)
      }
    }

    rebootWatcher(context)

    let corePluginList = Object.entries(corePlugins)
      .map(([name, plugin]) => {
        if (!tailwindConfig.corePlugins.includes(name)) {
          return null
        }

        return plugin
      })
      .filter(Boolean)

    let userPlugins = tailwindConfig.plugins.map((plugin) => {
      if (plugin.__isOptionsFunction) {
        plugin = plugin()
      }

      return typeof plugin === 'function' ? plugin : plugin.handler
    })

    let layerPlugins = collectLayerPlugins(root)

    // TODO: This is a workaround for backwards compatibility, since custom variants
    // were historically sorted before screen/stackable variants.
    let beforeVariants = [corePlugins['pseudoClassVariants']]
    let afterVariants = [
      corePlugins['directionVariants'],
      corePlugins['reducedMotionVariants'],
      corePlugins['darkVariants'],
      corePlugins['screenVariants'],
    ]

    registerPlugins(
      context.tailwindConfig,
      [...corePluginList, ...beforeVariants, ...userPlugins, ...afterVariants, ...layerPlugins],
      context
    )

    return context
  }
}

module.exports = setupContext
