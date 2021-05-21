import fs from 'fs'
import path from 'path'

import fastGlob from 'fast-glob'
import parseGlob from 'parse-glob'
import LRU from 'quick-lru'
import normalizePath from 'normalize-path'

import hash from '../../util/hashConfig'
import getModuleDependencies from '../../lib/getModuleDependencies'

import resolveConfig from '../../../resolveConfig'

import resolveConfigPath from '../../util/resolveConfigPath'

import * as sharedState from './sharedState'
import { env } from './sharedState'

import { trackModified, resolvePlugins, registerPlugins } from './setupContextUtils'

let contextMap = sharedState.contextMap
let configContextMap = sharedState.configContextMap
let contextSourcesMap = sharedState.contextSourcesMap

function cleanupContext(context) {
  if (context.watcher) {
    context.watcher.close()
  }
}

let configPathCache = new LRU({ maxSize: 100 })

// Get the config object based on a path
function getTailwindConfig(configOrPath) {
  let userConfigPath = resolveConfigPath(configOrPath)

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

function resolveChangedFiles(context) {
  let changedFiles = new Set()
  env.DEBUG && console.time('Finding changed files')
  let files = fastGlob.sync(context.candidateFiles)
  for (let file of files) {
    let prevModified = context.fileModifiedMap.has(file)
      ? context.fileModifiedMap.get(file)
      : -Infinity
    let modified = fs.statSync(file).mtimeMs

    if (modified > prevModified) {
      changedFiles.add(file)
      context.fileModifiedMap.set(file, modified)
    }
  }
  env.DEBUG && console.timeEnd('Finding changed files')
  return changedFiles
}

function getContext(configOrPath, tailwindDirectives, registerDependency, root, result) {
  let sourcePath = result.opts.from
  let [tailwindConfig, userConfigPath, tailwindConfigHash, configDependencies] = getTailwindConfig(
    configOrPath
  )
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

  // ---

  let contextDependenciesChanged = trackModified([...contextDependencies])

  env.DEBUG && console.log('Source path:', sourcePath)

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

  env.DEBUG && console.log('Setting up new context...')

  let purgeContent = Array.isArray(tailwindConfig.purge)
    ? tailwindConfig.purge
    : tailwindConfig.purge.content

  let context = {
    changedFiles: new Set(),
    ruleCache: new Set(),
    watcher: null,
    touchFile: null,
    classCache: new Map(),
    applyClassCache: new Map(),
    notClassCache: new Set(),
    postCssNodeCache: new Map(),
    candidateRuleMap: new Map(),
    configPath: userConfigPath,
    tailwindConfig: tailwindConfig,
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
    rawContent: purgeContent
      .filter((item) => typeof item.raw === 'string')
      .map(({ raw, extension }) => ({ content: raw, extension })),
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

  // getModuleDependencies

  // ---

  registerPlugins(resolvePlugins(context, tailwindDirectives, root), context)

  return context
}

// DISABLE_TOUCH = TRUE

// Retrieve an existing context from cache if possible (since contexts are unique per
// source path), or set up a new one (including setting up watchers and registering
// plugins) then return it
export default function setupTrackingContext(configOrPath, tailwindDirectives, registerDependency) {
  return (result, root) => {
    let context = getContext(configOrPath, tailwindDirectives, registerDependency, root, result)

    // If there are no @tailwind rules, we don't consider this CSS file or it's dependencies
    // to be dependencies of the context. Can reuse the context even if they change.
    // We may want to think about `@layer` being part of this trigger too, but it's tough
    // because it's impossible for a layer in one file to end up in the actual @tailwind rule
    // in another file since independent sources are effectively isolated.
    if (tailwindDirectives.size > 0) {
      // Add template paths as postcss dependencies.
      for (let maybeGlob of context.candidateFiles) {
        let {
          is: { glob: isGlob },
          base,
        } = parseGlob(maybeGlob)

        if (isGlob) {
          // rollup-plugin-postcss does not support dir-dependency messages
          // but directories can be watched in the same way as files
          registerDependency(
            path.resolve(base),
            env.ROLLUP_WATCH === 'true' ? 'dependency' : 'dir-dependency'
          )
        } else {
          registerDependency(path.resolve(maybeGlob))
        }
      }

      for (let changedFile of resolveChangedFiles(context)) {
        context.changedFiles.add(changedFile)
      }
    }

    return context
  }
}
