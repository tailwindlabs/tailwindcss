// @ts-check

import chokidar from 'chokidar'
import fs from 'fs'
import normalizePath from 'normalize-path'
import path from 'path'
import picomatch from 'picomatch'

import { readFileWithRetries } from './utils.js'

/**
 * The core idea of this watcher is:
 * 1. Whenever a file is added, changed, or renamed we queue a rebuild
 * 2. Perform as few rebuilds as possible by batching them together
 * 3. Coalesce events that happen in quick succession to avoid unnecessary rebuilds
 * 4. Ensure another rebuild happens _if_ changed while a rebuild is in progress
 */

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

  /**
   * chokidar v4 no longer supports glob patterns. Instead of handing it the
   * content globs we watch the base directory of every content path and do the
   * glob matching ourselves. The helpers below mirror what chokidar v3 did
   * internally for globs: dotfiles match, negated globs act as ignore patterns
   * and directories that can't contain a matching file are not watched at all.
   */

  /**
   * Paths that were explicitly added to the watcher (the input CSS file, config
   * files, PostCSS dependencies, …) as opposed to files that are only watched
   * because they match one of the content globs.
   *
   * @type {Set<string>}
   */
  let explicitPaths = new Set()

  /** @type {{ key: string | null, isIncluded: (file: string) => boolean, isExcluded: (file: string) => boolean }} */
  let contentMatchers = { key: null, isIncluded: () => false, isExcluded: () => false }

  /** @type {Map<string, (part: string) => boolean>} */
  let segmentMatchers = new Map()

  /**
   * Whether any of the glob `patterns` match `file`
   *
   * @param {string} file
   * @param {string[]} patterns
   */
  function matchesAny(file, patterns) {
    return patterns.some((pattern) => picomatch(pattern, {})(file))
  }

  /**
   * @param {string} file
   */
  function isExplicitlyWatched(file) {
    return explicitPaths.has(normalizePath(path.resolve(file)))
  }

  /**
   * Matchers for the positive and the negated content globs, rebuilt whenever
   * the content configuration changes
   */
  function getContentMatchers() {
    let patterns = state.contentPatterns.all
    let key = patterns.join('\n')

    if (contentMatchers.key !== key) {
      let positive = patterns.filter((pattern) => !pattern.startsWith('!'))
      let negative = patterns
        .filter((pattern) => pattern.startsWith('!'))
        .map((pattern) => pattern.slice(1))

      contentMatchers = {
        key,
        isIncluded: positive.length > 0 ? picomatch(positive, { dot: true }) : () => false,
        isExcluded: negative.length > 0 ? picomatch(negative, { dot: true }) : () => false,
      }
    }

    return contentMatchers
  }

  /**
   * Whether `file` matches the content globs (and is not excluded by a negated one)
   *
   * @param {string} file
   */
  function matchesContentPatterns(file) {
    let { isIncluded, isExcluded } = getContentMatchers()
    return isIncluded(file) && !isExcluded(file)
  }

  /**
   * @param {string} file
   */
  function isWatchedFile(file) {
    return isExplicitlyWatched(file) || matchesContentPatterns(file)
  }

  /**
   * @param {string} globPart
   * @param {string} pathPart
   */
  function matchesSegment(globPart, pathPart) {
    let matcher = segmentMatchers.get(globPart)

    if (matcher === undefined) {
      matcher = picomatch(globPart, { dot: true })
      segmentMatchers.set(globPart, matcher)
    }

    return matcher(pathPart)
  }

  /**
   * Whether `dir` could contain files that match one of the content globs
   *
   * @param {string} dir
   */
  function mayContainContentFiles(dir) {
    // Directories matched by a negated glob (e.g. `!./src/ignored/**`) are never watched
    if (getContentMatchers().isExcluded(dir)) return false

    for (let contentPath of state.contentPaths) {
      if (contentPath.ignore || contentPath.glob === null) continue

      let relative = path.relative(contentPath.base, dir)
      if (relative === '') return true
      // Outside the base directory (`..` as a whole segment, not e.g. `..templates`)
      if (relative === '..' || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) {
        continue
      }

      // Brace expansions that span directories (e.g. `{a,b/c}/*.html`) can't be
      // matched segment by segment, so we watch everything below the base
      if (/\{[^{}]*\/[^{}]*\}/.test(contentPath.glob)) return true

      // Only the directory parts of the glob are relevant here
      let globParts = contentPath.glob.split('/')
      if (globParts.length > 1) globParts.pop()

      let pathParts = relative.split(path.sep)
      let globstar = false

      let matches = globParts.every((globPart, idx) => {
        if (globPart === '**') globstar = true
        return globstar || pathParts[idx] === undefined || matchesSegment(globPart, pathParts[idx])
      })

      if (matches) return true
    }

    return false
  }

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

    // Skip files and directories that don't match the content globs (see above)
    ignored: (filePath, stats) => {
      if (stats === undefined) return false
      if (stats.isDirectory()) return !mayContainContentFiles(filePath)
      if (stats.isFile()) return !isWatchedFile(filePath)
      return false
    },
  })

  // A queue of rebuilds, file reads, etc… to run
  let chain = Promise.resolve()

  /**
   * A list of files that have been changed since the last rebuild
   *
   * @type {{file: string, content: () => Promise<string>, extension: string}[]}
   */
  let changedContent = []

  /**
   * A list of files for which a rebuild has already been queued.
   * This is used to prevent duplicate rebuilds when multiple events are fired for the same file.
   * The rebuilt file is cleared from this list when it's associated rebuild has _started_
   * This is because if the file is changed during a rebuild it won't trigger a new rebuild which it should
   **/
  let pendingRebuilds = new Set()

  let _timer
  let _reject

  /**
   * Rebuilds the changed files and resolves when the rebuild is
   * complete regardless of whether it was successful or not
   */
  async function rebuildAndContinue() {
    let changes = changedContent.splice(0)

    // There are no changes to rebuild so we can just do nothing
    if (changes.length === 0) {
      return Promise.resolve()
    }

    // Clear all pending rebuilds for the about-to-be-built files
    changes.forEach((change) => pendingRebuilds.delete(change.file))

    // Resolve the promise even when the rebuild fails
    return rebuild(changes).then(
      () => {},
      (e) => {
        console.error(e.toString())
      }
    )
  }

  /**
   *
   * @param {*} file
   * @param {(() => Promise<string>) | null} content
   * @param {boolean} skipPendingCheck
   * @returns {Promise<void>}
   */
  function recordChangedFile(file, content = null, skipPendingCheck = false) {
    file = path.resolve(file)

    // Applications like Vim/Neovim fire both rename and change events in succession for atomic writes
    // In that case rebuild has already been queued by rename, so can be skipped in change
    if (pendingRebuilds.has(file) && !skipPendingCheck) {
      return Promise.resolve()
    }

    // Mark that a rebuild of this file is going to happen
    // It MUST happen synchronously before the rebuild is queued for this to be effective
    pendingRebuilds.add(file)

    changedContent.push({
      file,
      content: content ?? (() => fs.promises.readFile(file, 'utf8')),
      extension: path.extname(file).slice(1),
    })

    if (_timer) {
      clearTimeout(_timer)
      _reject()
    }

    // If a rebuild is already in progress we don't want to start another one until the 10ms timer has expired
    chain = chain.then(
      () =>
        new Promise((resolve, reject) => {
          _timer = setTimeout(resolve, 10)
          _reject = reject
        })
    )

    // Resolves once this file has been rebuilt (or the rebuild for this file has failed)
    // This queues as many rebuilds as there are changed files
    // But those rebuilds happen after some delay
    // And will immediately resolve if there are no changes
    chain = chain.then(rebuildAndContinue, rebuildAndContinue)

    return chain
  }

  watcher.on('change', (file) => isWatchedFile(file) && recordChangedFile(file))
  watcher.on('add', (file) => isWatchedFile(file) && recordChangedFile(file))

  // Restore watching any files that are "removed"
  // This can happen when a file is pseudo-atomically replaced (a copy is created, overwritten, the old one is unlinked, and the new one is renamed)
  // TODO: An an optimization we should allow removal when the config changes
  watcher.on('unlink', (file) => {
    file = normalizePath(file)

    // Only re-add the file if it's not covered by a dynamic pattern
    if (!matchesAny(file, state.contentPatterns.dynamic)) {
      watcher.add(file)
    }
  })

  // Some applications such as Visual Studio (but not VS Code)
  // will only fire a rename event for atomic writes and not a change event
  // This is very likely a chokidar bug but it's one we need to work around
  // We treat this as a change event and rebuild the CSS
  watcher.on('raw', (evt, filePath, meta) => {
    if (evt !== 'rename' || filePath === null) {
      return
    }

    let watchedPath = meta.watchedPath

    // Watched path might be the file itself
    // Or the directory it is in
    filePath = watchedPath.endsWith(filePath) ? watchedPath : path.join(watchedPath, filePath)

    // Skip this event since the files it is for does not match any of the registered content globs
    if (!matchesAny(filePath, state.contentPatterns.all)) {
      return
    }

    // Skip since we've already queued a rebuild for this file that hasn't happened yet
    if (pendingRebuilds.has(filePath)) {
      return
    }

    // We'll go ahead and add the file to the pending rebuilds list here
    // It'll be removed when the rebuild starts unless the read fails
    // which will be taken care of as well
    pendingRebuilds.add(filePath)

    async function enqueue() {
      try {
        // We need to read the file as early as possible outside of the chain
        // because it may be gone by the time we get to it. doing the read
        // immediately increases the chance that the file is still there
        let content = await readFileWithRetries(path.resolve(filePath))

        if (content === undefined) {
          return
        }

        // This will push the rebuild onto the chain
        // We MUST skip the rebuild check here otherwise the rebuild will never happen on Linux
        // This is because the order of events and timing is different on Linux
        // @ts-ignore: TypeScript isn't picking up that content is a string here
        await recordChangedFile(filePath, () => content, true)
      } catch {
        // If reading the file fails, it's was probably a deleted temporary file
        // So we can ignore it and no rebuild is needed
      }
    }

    enqueue().then(() => {
      // If the file read fails we still need to make sure the file isn't stuck in the pending rebuilds list
      pendingRebuilds.delete(filePath)
    })
  })

  return {
    fswatcher: watcher,

    refreshWatchedFiles() {
      // chokidar v4 doesn't support globs, so we watch the base directory of
      // every content path and filter the events ourselves (see above)
      let contentBases = state.contentPaths
        .filter((contentPath) => !contentPath.ignore)
        .map((contentPath) => contentPath.base)

      let paths = [
        ...state.contextDependencies,
        ...state.configBag.dependencies,
        ...new Set(contentBases),
      ]

      for (let p of paths) {
        explicitPaths.add(normalizePath(path.resolve(p)))
      }

      watcher.add(paths)
    },
  }
}
