import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import os from 'os'

import chokidar from 'chokidar'
import fastGlob from 'fast-glob'
import LRU from 'quick-lru'

import hash from '../../util/hashConfig'
import log from '../../util/log'
import getModuleDependencies from '../../lib/getModuleDependencies'
import resolveConfig from '../../../resolveConfig'
import resolveConfigPath from '../../util/resolveConfigPath'
import { getContext } from './setupContextUtils'
import { env } from './sharedState'

// Earmarks a directory for our touch files.
// If the directory already exists we delete any existing touch files,
// invalidating any caches associated with them.
let touchDir =
  env.TAILWIND_TOUCH_DIR || path.join(os.homedir() || os.tmpdir(), '.tailwindcss', 'touch')

if (!env.TAILWIND_DISABLE_TOUCH) {
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

let watchers = new WeakMap()

function getWatcher(context) {
  if (watchers.has(context)) {
    return watchers.get(context)
  }

  return null
}

function setWatcher(context, watcher) {
  return watchers.set(context, watcher)
}

function rebootWatcher(context) {
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
    let watcher = getWatcher(context)

    Promise.resolve(watcher ? watcher.close() : null).then(() => {
      log.info([
        'Tailwind CSS is watching for changes...',
        'https://tailwindcss.com/docs/just-in-time-mode#watch-mode-and-one-off-builds',
      ])

      watcher = chokidar.watch([...context.candidateFiles, ...context.configDependencies], {
        ignoreInitial: true,
      })

      setWatcher(context, watcher)

      watcher.on('add', (file) => {
        let changedFile = path.resolve('.', file)
        let content = fs.readFileSync(changedFile, 'utf8')
        let extension = path.extname(changedFile).slice(1)
        context.changedContent.push({ content, extension })
        touch(context.touchFile)
      })

      watcher.on('change', (file) => {
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
          let changedFile = path.resolve('.', file)
          let content = fs.readFileSync(changedFile, 'utf8')
          let extension = path.extname(changedFile).slice(1)
          context.changedContent.push({ content, extension })
          touch(context.touchFile)
        }
      })

      watcher.on('unlink', (file) => {
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

    context.disposables.push((oldContext) => {
      let watcher = getWatcher(oldContext)
      if (watcher !== null) {
        watcher.close()
      }
    })

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
