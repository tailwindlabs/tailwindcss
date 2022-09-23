// @ts-check

import chokidar from 'chokidar'
import fs from 'fs'
import micromatch from 'micromatch'
import normalizePath from 'normalize-path'
import path from 'path'

import { readFileWithRetries } from './utils.js'

/**
 *
 * @param {*} args
 * @param {{ state, rebuild(changedFiles: any[]): Promise<any> }} param1
 * @returns {{
 *   fswatcher: import('chokidar').FSWatcher,
 *   refreshWatchedFiles(): void,
 * }}
 */
export function createWatcher(args, { state, rebuild }) {
  let shouldPoll = args['--poll']
  let shouldCoalesceWriteEvents = shouldPoll || process.platform === 'win32'

  // Polling interval in milliseconds
  // Used only when polling or coalescing add/change events on Windows
  let pollInterval = 10

  let watcher = chokidar.watch([], {
    // Force checking for atomic writes in all situations
    // This causes chokidar to wait up to 100ms for a file to re-added after it's been unlinked
    // This only works when watching directories though
    atomic: true,

    usePolling: shouldPoll,
    interval: shouldPoll ? pollInterval : undefined,
    ignoreInitial: true,
    awaitWriteFinish: shouldCoalesceWriteEvents
      ? {
          stabilityThreshold: 50,
          pollInterval: pollInterval,
        }
      : false,
  })

  let chain = Promise.resolve()
  let pendingRebuilds = new Set()
  let changedContent = []

  /**
   *
   * @param {*} file
   * @param {(() => Promise<string>) | null} content
   */
  function recordChangedFile(file, content = null) {
    file = path.resolve(file)

    content = content ?? (async () => await fs.promises.readFile(file, 'utf8'))

    changedContent.push({
      file,
      content,
      extension: path.extname(file).slice(1),
    })

    chain = chain.then(() => rebuild(changedContent))

    return chain
  }

  watcher.on('change', (file) => recordChangedFile(file))
  watcher.on('add', (file) => recordChangedFile(file))

  // Restore watching any files that are "removed"
  // This can happen when a file is pseudo-atomically replaced (a copy is created, overwritten, the old one is unlinked, and the new one is renamed)
  // TODO: An an optimization we should allow removal when the config changes
  watcher.on('unlink', (file) => {
    file = normalizePath(file)

    // Only re-add the file if it's not covered by a dynamic pattern
    if (!micromatch.some([file], state.contentPatterns.dynamic)) {
      watcher.add(file)
    }
  })

  // Some applications such as Visual Studio (but not VS Code)
  // will only fire a rename event for atomic writes and not a change event
  // This is very likely a chokidar bug but it's one we need to work around
  // We treat this as a change event and rebuild the CSS
  watcher.on('raw', (evt, filePath, meta) => {
    if (evt !== 'rename') {
      return
    }

    let watchedPath = meta.watchedPath

    // Watched path might be the file itself
    // Or the directory it is in
    filePath = watchedPath.endsWith(filePath) ? watchedPath : path.join(watchedPath, filePath)

    // Skip this event since the files it is for does not match any of the registered content globs
    if (!micromatch.some([filePath], state.contentPatterns.all)) {
      return
    }

    // Skip since we've already queued a rebuild for this file that hasn't happened yet
    if (pendingRebuilds.has(filePath)) {
      return
    }

    pendingRebuilds.add(filePath)

    chain = chain.then(async () => {
      let content

      try {
        content = await readFileWithRetries(path.resolve(filePath))
      } finally {
        pendingRebuilds.delete(filePath)
      }

      return recordChangedFile(filePath, () => content)
    })
  })

  return {
    fswatcher: watcher,

    refreshWatchedFiles() {
      watcher.add(Array.from(state.contextDependencies))
      watcher.add(Array.from(state.configDependencies))
      watcher.add(state.contentPatterns.all)
    },
  }
}
