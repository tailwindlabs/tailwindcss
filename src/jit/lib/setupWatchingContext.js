import fs from 'fs'
import path from 'path'

import fastGlob from 'fast-glob'
import LRU from 'quick-lru'

import hash from '../../util/hashConfig'
import getModuleDependencies from '../../lib/getModuleDependencies'

import resolveConfig from '../../../resolveConfig'

import resolveConfigPath from '../../util/resolveConfigPath'

import { rebootWatcher } from './rebootWatcher'
import { getContext } from './setupContextUtils'

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

function resolveChangedFiles(context) {
  let changedFiles = new Set()

  // If we're not set up and watching files ourselves, we need to do
  // the work of grabbing all of the template files for candidate
  // detection.
  if (!context.scannedContent) {
    let files = fastGlob.sync(context.candidateFiles)
    for (let file of files) {
      changedFiles.add(file)
    }
    context.scannedContent = true
  }

  return changedFiles
}

// DISABLE_TOUCH = FALSE

// Retrieve an existing context from cache if possible (since contexts are unique per
// source path), or set up a new one (including setting up watchers and registering
// plugins) then return it
export default function setupWatchingContext(configOrPath, tailwindDirectives, registerDependency) {
  return (result, root) => {
    let [context, newContext] = getContext(
      configOrPath,
      tailwindDirectives,
      registerDependency,
      root,
      result,
      getTailwindConfig
    )

    if (context.configPath !== null) {
      for (let dependency of getModuleDependencies(context.configPath)) {
        if (dependency.file === context.configPath) {
          continue
        }

        context.configDependencies.add(dependency.file)
      }
    }

    if (newContext) {
      rebootWatcher(context)
    }

    // Register our temp file as a dependency ‚Äî we write to this file
    // to trigger rebuilds.
    if (context.touchFile) {
      registerDependency(context.touchFile)
    }

    if (tailwindDirectives.size > 0) {
      for (let changedFile of resolveChangedFiles(context)) {
        let content = fs.readFileSync(changedFile, 'utf8')
        let extension = path.extname(changedFile).slice(1)
        context.changedContent.push({ content, extension })
      }
    }

    return context
  }
}
