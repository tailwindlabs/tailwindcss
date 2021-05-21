import fs from 'fs'
import path from 'path'

import fastGlob from 'fast-glob'
import LRU from 'quick-lru'
import normalizePath from 'normalize-path'

import hash from '../../util/hashConfig'
import getModuleDependencies from '../../lib/getModuleDependencies'

import resolveConfig from '../../../resolveConfig'

import resolveConfigPath from '../../util/resolveConfigPath'

import * as sharedState from './sharedState'
import { env } from './sharedState'

import { rebootWatcher } from './rebootWatcher'
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
    let [prevConfig, prevModified = -Infinity, prevConfigHash] =
      configPathCache.get(userConfigPath) || []
    let modified = fs.statSync(userConfigPath).mtimeMs

    // It hasn't changed (based on timestamp)
    if (modified <= prevModified) {
      return [prevConfig, userConfigPath, prevConfigHash, [userConfigPath]]
    }

    // It has changed (based on timestamp), or first run
    delete require.cache[userConfigPath]
    let newConfig = resolveConfig(require(userConfigPath))
    let newHash = hash(newConfig)
    configPathCache.set(userConfigPath, [newConfig, modified, newHash])
    return [newConfig, userConfigPath, newHash, [userConfigPath]]
  }

  // It's a plain object, not a path
  let newConfig = resolveConfig(
    configOrPath.config === undefined ? configOrPath : configOrPath.config
  )

  return [newConfig, null, hash(newConfig), [userConfigPath]]
}

function cleanMe(tailwindDirectives, context, registerDependency) {
  if (context.configPath !== null) {
    registerDependency(context.configPath)
  }

  if (tailwindDirectives.size > 0) {
    // Register our temp file as a dependency — we write to this file
    // to trigger rebuilds.
    if (context.touchFile) {
      registerDependency(context.touchFile)
    }

    // If we're not set up and watching files ourselves, we need to do
    // the work of grabbing all of the template files for candidate
    // detection.
    if (!context.scannedContent) {
      let files = fastGlob.sync(context.candidateFiles)
      for (let file of files) {
        context.changedFiles.add(file)
      }
      context.scannedContent = true
    }
  }
}

// DISABLE_TOUCH = FALSE

// Retrieve an existing context from cache if possible (since contexts are unique per
// source path), or set up a new one (including setting up watchers and registering
// plugins) then return it
export default function setupWatchingContext(configOrPath, tailwindDirectives, registerDependency) {
  return (result, root) => {
    let sourcePath = result.opts.from
    let [
      tailwindConfig,
      userConfigPath,
      tailwindConfigHash,
      configDependencies,
    ] = getTailwindConfig(configOrPath)
    let isConfigFile = userConfigPath !== null

    let contextDependencies = new Set(configDependencies)

    // If there are no @tailwind rules, we don't consider this CSS file or it's dependencies
    // to be dependencies of the context. Can reuse the context even if they change.
    // We may want to think about `@layer` being part of this trigger too, but it's tough
    // because it's impossible for a layer in one file to end up in the actual @tailwind rule
    // in another file since independent sources are effectively isolated.
    if (tailwindDirectives.size > 0) {
      contextDependencies.add(sourcePath)
      for (let message of result.messages) {
        if (message.type === 'dependency') {
          contextDependencies.add(message.file)
        }
      }
    }

    for (let file of configDependencies) {
      result.messages.push({
        type: 'dependency',
        plugin: 'tailwindcss',
        parent: result.opts.from,
        file,
      })
    }

    let contextDependenciesChanged = trackModified([...contextDependencies])

    env.DEBUG && console.log('Source path:', sourcePath)

    if (!contextDependenciesChanged) {
      // If this file already has a context in the cache and we don't need to
      // reset the context, return the cached context.
      if (isConfigFile && contextMap.has(sourcePath)) {
        let context = contextMap.get(sourcePath)

        cleanMe(tailwindDirectives, context, registerDependency)

        return context
      }

      // If the config used already exists in the cache, return that.
      if (configContextMap.has(tailwindConfigHash)) {
        let context = configContextMap.get(tailwindConfigHash)
        contextSourcesMap.get(context).add(sourcePath)
        contextMap.set(sourcePath, context)

        cleanMe(tailwindDirectives, context, registerDependency)

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

    ///
    if (isConfigFile) {
      for (let dependency of getModuleDependencies(userConfigPath)) {
        if (dependency.file === userConfigPath) {
          continue
        }

        context.configDependencies.add(dependency.file)
      }
    }

    rebootWatcher(context)
    ////

    registerPlugins(resolvePlugins(context, tailwindDirectives, root), context)

    cleanMe(tailwindDirectives, context, registerDependency)

    return context
  }
}
