import {
  compile,
  env,
  Instrumentation,
  optimize,
  toSourceMap,
  type SourceMap,
} from '@tailwindcss/node'
import { clearRequireCache } from '@tailwindcss/node/require-cache'
import { Scanner, type ChangedContent } from '@tailwindcss/oxide'
import { existsSync, type Stats } from 'node:fs'
import fs from 'node:fs/promises'
import path from 'node:path'
import type { Arg, Result } from '../../utils/args'
import { Disposables } from '../../utils/disposables'
import {
  eprintln,
  formatDuration,
  header,
  highlight,
  println,
  relative,
  wordWrap,
} from '../../utils/renderer'
import { drainStdin, outputFile } from './utils'

const css = String.raw
const DEBUG = env.DEBUG
const DEFAULT_POLL_INTERVAL_MS = 250

export function options() {
  return {
    '--input': {
      type: 'string',
      description: 'Input file',
      alias: '-i',
    },
    '--output': {
      type: 'string',
      description: 'Output file',
      alias: '-o',
      default: '-',
    },
    '--watch': {
      type: 'boolean | string',
      description:
        'Watch for changes and rebuild as needed, and use `always` to keep watching when stdin is closed',
      alias: '-w',
      values: ['always'],
    },
    '--poll': {
      type: 'boolean | number',
      description: 'Use polling instead of filesystem events when watching',
      default: false,
      values: ['ms'],
    },
    '--minify': {
      type: 'boolean',
      description: 'Optimize and minify the output',
      alias: '-m',
    },
    '--optimize': {
      type: 'boolean',
      description: 'Optimize the output without minifying',
    },
    '--cwd': {
      type: 'string',
      description: 'The current working directory',
      default: '.',
    },
    '--map': {
      type: 'boolean | string',
      description: 'Generate a source map',
      default: false,
    },
    '--silent': {
      type: 'boolean',
      description: 'Suppress non-error output',
    },
  } satisfies Arg
}

function formatError(error: unknown): string {
  let seen = new Set() // Track seen errors to prevent circular errors
  function render(err: unknown, depth: number): string[] {
    let indent = '  '.repeat(depth)
    let width = (process.stderr.columns ?? Infinity) - 2 * (depth + 1)

    let output = [
      `${indent}${red(depth === 0 ? 'Error:' : 'Caused by:')}`,
      `${indent}${dim('\u250C')}`,
    ]

    for (let line of `${err}`.split('\n')) {
      let wrapped = wordWrap(line, width)
      if (wrapped.length === 0) wrapped = ['']
      for (let chunk of wrapped) {
        output.push(`${indent}${dim('\u2502')} ${chunk}`)
      }
    }

    output.push(`${indent}${dim('\u2514')}`)

    if (typeof err === 'object' && err !== null && 'cause' in err && err.cause != null) {
      if (!seen.add(err).has(err.cause)) {
        output.push(...render(err.cause, depth + 1))
      }
    }

    return output
  }

  return render(error, 0).join('\n')
}

async function handleError<T>(fn: () => T): Promise<T> {
  try {
    return await fn()
  } catch (err) {
    eprintln(formatError(err))
    process.exit(1)
  }
}

export async function handle(args: Result<ReturnType<typeof options>>) {
  if (!args['--silent']) eprintln(header())
  if (!args['--silent']) eprintln()

  using I = new Instrumentation()
  DEBUG && I.start('[@tailwindcss/cli] (initial build)')

  let base = path.resolve(args['--cwd'])

  // Resolve the output as an absolute path. If the output is a `-`, then we
  // don't need to resolve it because this is a flag to indicate that we want to
  // use `stdout` instead.
  if (args['--output'] && args['--output'] !== '-') {
    args['--output'] = path.resolve(base, args['--output'])
  }

  // Resolve the input as an absolute path. If the input is a `-`, then we don't
  // need to resolve it because this is a flag to indicate that we want to use
  // `stdin` instead.
  if (args['--input'] && args['--input'] !== '-') {
    args['--input'] = path.resolve(base, args['--input'])

    // Ensure the provided `--input` exists.
    if (!existsSync(args['--input'])) {
      eprintln(`Specified input file ${highlight(relative(args['--input']))} does not exist.`)
      process.exit(1)
    }
  }

  // Check if the input and output file paths are identical, otherwise return an
  // error to the user.
  if (args['--input'] === args['--output'] && args['--input'] !== '-') {
    eprintln(
      `Specified input file ${highlight(relative(args['--input']))} and output file ${highlight(relative(args['--output']))} are identical.`,
    )
    process.exit(1)
  }

  // If the user passes `{bin} build --map -` then this likely means they want to output the map inline
  // this is the default behavior of `{bin build} --map` to inform the user of that
  if (args['--map'] === '-') {
    eprintln(`Use --map without a value to inline the source map.`)
    process.exit(1)
  }

  if (args['--poll'] === undefined) {
    eprintln(`Use --poll with a non-zero value in milliseconds.`)
    process.exit(1)
  }
  let pollInterval = args['--poll'] === true ? DEFAULT_POLL_INTERVAL_MS : args['--poll']
  if (pollInterval !== false && pollInterval <= 0) {
    eprintln(`Specified polling interval must be a positive number.`)
    process.exit(1)
  }

  // Resolve the map as an absolute path. If the output is true then we
  // don't need to resolve it because it'll be an inline source map
  if (args['--map'] && args['--map'] !== true) {
    args['--map'] = path.resolve(base, args['--map'])
  }

  let start = process.hrtime.bigint()

  let input = args['--input']
    ? args['--input'] === '-'
      ? await drainStdin()
      : await fs.readFile(args['--input'], 'utf-8')
    : css`
        @import 'tailwindcss';
      `

  let previous = {
    css: '',
    optimizedCss: '',
    output: null as string | null,
  }

  async function write(
    css: string,
    map: SourceMap | null,
    args: Result<ReturnType<typeof options>>,
    I: Instrumentation,
  ) {
    let output = css

    // Optimize the output
    if (args['--minify'] || args['--optimize']) {
      if (css !== previous.css) {
        DEBUG && I.start('Optimize CSS')
        let optimized = optimize(css, {
          file: args['--input'] ?? 'input.css',
          minify: args['--minify'] ?? false,
          map: map?.raw ?? undefined,
        })
        DEBUG && I.end('Optimize CSS')
        previous.css = css
        previous.optimizedCss = optimized.code
        if (optimized.map) {
          map = toSourceMap(optimized.map)
        }
        output = optimized.code
      } else {
        output = previous.optimizedCss
      }
    }

    // Write the output
    if (map) {
      // Inline the source map
      if (args['--map'] === true) {
        output += `\n`
        output += map.inline
      } else if (typeof args['--map'] === 'string') {
        let basePath =
          args['--output'] && args['--output'] !== '-'
            ? path.dirname(path.resolve(args['--output']))
            : process.cwd()

        let mapPath = path.resolve(args['--map'])

        let relativePath = path.relative(basePath, mapPath)

        output += `\n`
        output += map.comment(relativePath)

        DEBUG && I.start('Write source map')
        await outputFile(args['--map'], map.raw)
        DEBUG && I.end('Write source map')
      }
    }

    let didChange = output !== previous.output

    DEBUG && I.start('Write output')
    if (args['--output'] && args['--output'] !== '-') {
      await outputFile(args['--output'], output)
    } else if (didChange) {
      println(output)
    }
    DEBUG && I.end('Write output')

    previous.output = output
    return didChange
  }

  let inputFilePath =
    args['--input'] && args['--input'] !== '-' ? path.resolve(args['--input']) : null

  let inputBasePath = inputFilePath ? path.dirname(inputFilePath) : process.cwd()

  let fullRebuildPaths: string[] = inputFilePath ? [inputFilePath] : []
  let backupRebuildPaths = fullRebuildPaths

  async function createCompiler(css: string, I: Instrumentation) {
    DEBUG && I.start('Setup compiler')
    let compiler = await compile(css, {
      from: args['--output'] ? (inputFilePath ?? 'stdin.css') : undefined,
      base: inputBasePath,
      onDependency(path) {
        fullRebuildPaths.push(path)
      },
    })

    let sources = (() => {
      // Disable auto source detection
      if (compiler.root === 'none') {
        return []
      }

      // No root specified, use the base directory
      if (compiler.root === null) {
        return [{ base, pattern: '**/*', negated: false }]
      }

      // Use the specified root
      return [{ ...compiler.root, negated: false }]
    })().concat(compiler.sources)

    // Do not scan the current executable. Otherwise when using the standalone
    // CLI, if the CLI lives in the current repo we would be scanning that file.
    //
    // This is also immune against renames of the executable file.
    sources.push({
      base: path.dirname(process.execPath),
      pattern: path.basename(process.execPath),
      negated: true,
    })

    if (inputFilePath !== null) {
      sources.push({
        base: path.dirname(inputFilePath),
        pattern: path.basename(inputFilePath),
        negated: false,
      })
    }

    let scanner = new Scanner({ sources })
    DEBUG && I.end('Setup compiler')

    return [compiler, scanner] as const
  }

  let [compiler, scanner] = await handleError(() => createCompiler(input, I))
  let cleanupWatchers: (() => Promise<void>)[] = []

  // Watch for changes
  if (args['--watch'] && pollInterval === false) {
    // Ensure the file watcher can be loaded before setting up any watchers,
    // such that we can present a helpful error message if needed.
    await handleError(() => loadWatcher())

    cleanupWatchers.push(
      await createWatchers(await watchDirectories(scanner), async function handle(files) {
        try {
          // If the only change happened to the output file, then we don't want to
          // trigger a rebuild because that will result in an infinite loop.
          if (files.length === 1 && files[0] === args['--output']) return

          using I = new Instrumentation()
          DEBUG && I.start('[@tailwindcss/cli] (watcher)')

          // Re-compile the input
          let start = process.hrtime.bigint()

          let resolvedFullRebuildPaths = fullRebuildPaths
          let rebuildStrategy = getRebuildStrategy(files, resolvedFullRebuildPaths)

          // Track the compiled CSS
          let compiledCss = ''
          let compiledMap: SourceMap | null = null

          // Scan the entire `base` directory for full rebuilds.
          if (rebuildStrategy.kind === 'full') {
            // Read the new `input`.
            let input = args['--input']
              ? args['--input'] === '-'
                ? await drainStdin()
                : await fs.readFile(args['--input'], 'utf-8')
              : css`
                  @import 'tailwindcss';
                `
            clearRequireCache(resolvedFullRebuildPaths)

            // Track current rebuild paths in case something goes wrong when
            // performing a full rebuild.
            backupRebuildPaths = fullRebuildPaths.slice()

            // The `inputFilePath`, if provided, will be the only known full
            // rebuild path before the compiler is re-created.
            fullRebuildPaths = inputFilePath ? [inputFilePath] : []

            // Create a new compiler, given the new `input`
            ;[compiler, scanner] = await createCompiler(input, I)

            // Succesfully created a new compiler, so the `fullRebuildPaths`
            // will be updated. If other errors occur, we should be able to
            // restore the paths unconditionally.
            backupRebuildPaths = fullRebuildPaths.slice()

            // Scan the directory for candidates
            DEBUG && I.start('Scan for candidates')
            let candidates = scanner.scan()
            DEBUG && I.end('Scan for candidates')

            // Setup new watchers
            DEBUG && I.start('Setup new watchers')
            let newCleanupFunction = await createWatchers(await watchDirectories(scanner), handle)
            DEBUG && I.end('Setup new watchers')

            // Clear old watchers
            DEBUG && I.start('Cleanup old watchers')
            await Promise.all(cleanupWatchers.splice(0).map((cleanup) => cleanup()))
            DEBUG && I.end('Cleanup old watchers')

            cleanupWatchers.push(newCleanupFunction)

            // Re-compile the CSS
            DEBUG && I.start('Build CSS')
            compiledCss = compiler.build(candidates)
            DEBUG && I.end('Build CSS')

            if (args['--map']) {
              DEBUG && I.start('Build Source Map')
              compiledMap = toSourceMap(compiler.buildSourceMap())
              DEBUG && I.end('Build Source Map')
            }
          }

          // Scan changed files only for incremental rebuilds.
          else if (rebuildStrategy.kind === 'incremental') {
            DEBUG && I.start('Scan for candidates')
            let newCandidates = scanner.scanFiles(rebuildStrategy.changedFiles)
            DEBUG && I.end('Scan for candidates')

            // No new candidates found which means we don't need to write to
            // disk, and can return early.
            if (newCandidates.length <= 0) {
              let end = process.hrtime.bigint()
              if (!args['--silent']) eprintln(`Done in ${formatDuration(end - start)}`)
              return
            }

            DEBUG && I.start('Build CSS')
            compiledCss = compiler.build(newCandidates)
            DEBUG && I.end('Build CSS')

            if (args['--map']) {
              DEBUG && I.start('Build Source Map')
              compiledMap = toSourceMap(compiler.buildSourceMap())
              DEBUG && I.end('Build Source Map')
            }
          }

          await write(compiledCss, compiledMap, args, I)

          let end = process.hrtime.bigint()
          if (!args['--silent']) eprintln(`Done in ${formatDuration(end - start)}`)
        } catch (err) {
          // It's important that we perform a full rebuild when any of the
          // dependencies tracked in `fullRebuildPaths` has been changed.
          //
          // If we remove one of those files, then a subsequent build will be
          // triggered, but it will fail because the dependency is gone. The
          // compiler itself will be in a broken state and won't be able to
          // register any dependencies therefore we want to restore all the
          // dependencies from before. If we don't do that, then we won't be
          // able to recover from a bug in a transitive dependency.
          //
          // E.g.:
          // ```css
          // /* input.css — known full rebuild path */
          // @import 'tailwindcss';
          // @config "./tailwind.config.js";
          // ```
          //
          // ```js
          // // tailwind.config.js
          // const theme = require('./my-theme.js');
          //
          // module.exports = {
          //   theme
          // }
          // ```
          // In this case `my-theme.js` is a transitive dependency of
          // `input.css` via `tailwind.config.js`. Removing `my-theme.js` will
          // result in an error, restoring `my-theme.js` should trigger a
          // fresh build even though the compiler didn't restore.
          //
          // Once the build error is fixed, a fresh full rebuild will happen
          // which in turn will fixup the full rebuild paths.
          fullRebuildPaths = backupRebuildPaths

          // Catch any errors and print them to stderr, but don't exit the process
          // and keep watching.
          eprintln(formatError(err))

          let end = process.hrtime.bigint()
          if (!args['--silent']) eprintln(`Done in ${formatDuration(end - start)}`)
        }
      }),
    )

    // Abort the watcher if `stdin` is closed to avoid zombie processes. You can
    // disable this behavior with `--watch=always`.
    if (args['--watch'] !== 'always') {
      process.stdin.on('end', () => {
        Promise.all(cleanupWatchers.map((fn) => fn())).then(
          () => process.exit(0),
          () => process.exit(1),
        )
      })
    }

    // Keep the process running
    process.stdin.resume()
  }

  DEBUG && I.start('Scan for candidates')
  let candidates = scanner.scan()
  DEBUG && I.end('Scan for candidates')
  DEBUG && I.start('Build CSS')
  let output = await handleError(() => compiler.build(candidates))
  DEBUG && I.end('Build CSS')

  let map: SourceMap | null = null

  if (args['--map']) {
    DEBUG && I.start('Build Source Map')
    map = await handleError(() => toSourceMap(compiler.buildSourceMap()))
    DEBUG && I.end('Build Source Map')
  }

  await write(output, map, args, I)

  let end = process.hrtime.bigint()
  if (!args['--silent']) eprintln(`Done in ${formatDuration(end - start)}`)

  // Watch for changes, using polling
  if (args['--watch'] && pollInterval !== false) {
    let cleanupPollingIndicator = () => {}

    function logPollingMessage(message: string) {
      if (!args['--silent']) {
        process.stderr.write('\r\x1B[2K')
      }

      eprintln(message)

      if (!args['--silent']) {
        process.stderr.write(`\r\x1B[2K${dim(`Polling for changes…`)}`)
      }
    }

    async function fullRebuild(I: Instrumentation) {
      clearRequireCache(fullRebuildPaths)
      backupRebuildPaths = fullRebuildPaths.slice()
      fullRebuildPaths = inputFilePath ? [inputFilePath] : []

      let input = args['--input']
        ? args['--input'] === '-'
          ? await drainStdin()
          : await fs.readFile(args['--input'], 'utf-8')
        : css`
            @import 'tailwindcss';
          `

      ;[compiler, scanner] = await createCompiler(input, I)
      backupRebuildPaths = fullRebuildPaths.slice()

      DEBUG && I.start('Scan for candidates')
      let candidates = scanner.scan()
      DEBUG && I.end('Scan for candidates')

      DEBUG && I.start('Build CSS')
      let output = compiler.build(candidates)
      DEBUG && I.end('Build CSS')

      let map: SourceMap | null = null

      if (args['--map']) {
        DEBUG && I.start('Build Source Map')
        map = toSourceMap(compiler.buildSourceMap())
        DEBUG && I.end('Build Source Map')
      }

      await write(output, map, args, I)
    }

    if (!args['--silent']) {
      let restored = false

      function restoreCursor() {
        if (restored) return
        restored = true
        process.stderr.write('\r\x1B[2K\x1B[?25h')
        process.off('exit', restoreCursor)
        process.off('SIGINT', onSigint)
        process.off('SIGTERM', onSigterm)
      }

      function onSigint() {
        restoreCursor()
        process.exit(130)
      }

      function onSigterm() {
        restoreCursor()
        process.exit(143)
      }

      process.stderr.write('\x1B[?25l')
      process.on('exit', restoreCursor)
      process.on('SIGINT', onSigint)
      process.on('SIGTERM', onSigterm)

      cleanupPollingIndicator = restoreCursor
      cleanupWatchers.push(async () => cleanupPollingIndicator())
    }

    cleanupWatchers.push(
      createPollingWatcher(async () => {
        using I = new Instrumentation()

        DEBUG && I.start('Scan for candidates')
        let candidates = scanner.scan()
        DEBUG && I.end('Scan for candidates')

        let files = scanner.scannedFiles.filter(
          (file) => file !== args['--output'] && file !== args['--map'],
        )

        if (files.length <= 0) return

        let start = process.hrtime.bigint()

        let strategy = getRebuildStrategy(files, fullRebuildPaths)

        if (strategy.kind === 'full') {
          try {
            await fullRebuild(I)
          } catch (err) {
            fullRebuildPaths = backupRebuildPaths

            logPollingMessage(formatError(err))
          }

          if (!args['--silent']) {
            logPollingMessage(`Done in ${formatDuration(process.hrtime.bigint() - start)}`)
          }
          return
        }

        // No candidates found which means we don't need to write to disk, and
        // can return early.
        if (candidates.length <= 0) {
          if (!args['--silent']) {
            logPollingMessage(`Done in ${formatDuration(process.hrtime.bigint() - start)}`)
          }
          return
        }

        DEBUG && I.start('Build CSS')
        let output = compiler.build(candidates)
        DEBUG && I.end('Build CSS')

        let map: SourceMap | null = null

        if (args['--map']) {
          DEBUG && I.start('Build Source Map')
          map = toSourceMap(compiler.buildSourceMap())
          DEBUG && I.end('Build Source Map')
        }

        await write(output, map, args, I)

        if (!args['--silent']) {
          logPollingMessage(`Done in ${formatDuration(process.hrtime.bigint() - start)}`)
        }
      }, pollInterval),
    )

    if (args['--watch'] !== 'always') {
      process.stdin.on('end', () => {
        Promise.all(cleanupWatchers.map((fn) => fn())).then(
          () => process.exit(0),
          () => process.exit(1),
        )
      })
    }

    process.stdin.resume()
    if (!args['--silent']) {
      process.stderr.write(`\r\x1B[2K${dim(`Polling for changes…`)}`)
    }
  }
}

// Load `@parcel/watcher` lazily so a missing or broken native binding only
// affects `--watch` (without `--poll`), instead of crashing one-off builds and
// polling mode as well.
async function loadWatcher(): Promise<typeof import('@parcel/watcher')> {
  try {
    return (await import('@parcel/watcher')).default
  } catch (err) {
    throw new Error(
      `Failed to load the file watcher. Your platform may not be supported by \`@parcel/watcher\`. As a workaround, you can use polling instead by passing the \`--watch --poll\` flags.`,
      { cause: err },
    )
  }
}

async function createWatchers(dirs: string[], cb: (files: string[]) => void) {
  let watcher = await loadWatcher()

  // Remove any directories that are children of an already watched directory.
  // If we don't we may not get notified of certain filesystem events regardless
  // of whether or not they are for the directory that is duplicated.

  // 1. Sort in asc by length
  dirs = dirs.sort((a, z) => a.length - z.length)

  // 2. Remove any directories that are children of another directory
  let toRemove = []

  // /project-a 0
  // /project-a/src 1

  for (let i = 0; i < dirs.length; ++i) {
    for (let j = 0; j < i; ++j) {
      if (!dirs[i].startsWith(`${dirs[j]}/`)) continue

      toRemove.push(dirs[i])
    }
  }

  dirs = dirs.filter((dir) => !toRemove.includes(dir))

  // Track all Parcel watchers for each glob.
  //
  // When we encounter a change in a CSS file, we need to setup new watchers and
  // we want to cleanup the old ones we captured here.
  let watchers = new Disposables()

  // Track all files that were added or changed.
  let files = new Set<string>()

  // Keep track of the debounce queue to avoid multiple rebuilds.
  let debounceQueue = new Disposables()

  // A changed file can be watched by multiple watchers, but we only want to
  // handle the file once. We debounce the handle function with the collected
  // files to handle them in a single batch and to avoid multiple rebuilds.
  async function enqueueCallback() {
    // Dispose all existing macrotasks.
    await debounceQueue.dispose()

    // Setup a new macrotask to handle the files in batch.
    debounceQueue.queueMacrotask(() => {
      cb(Array.from(files))
      files.clear()
    })
  }

  // Setup a watcher for every directory.
  for (let dir of dirs) {
    let { unsubscribe } = await watcher.subscribe(dir, async (err, events) => {
      // Whenever an error occurs we want to let the user know about it but we
      // want to keep watching for changes.
      if (err) {
        console.error(err)
        return
      }

      await Promise.all(
        events.map(async (event) => {
          // When a file is deleted, a rebuild should be triggered such that we
          // can figure out whether this file must trigger a fresh build or not.
          //
          // If it must trigger a fresh build, then we will temporarily end up
          // in a broken state, but an error will be shown to the user. Once the
          // user resolves the issue, the CLI will recover.
          if (event.type === 'delete') {
            files.add(event.path)
            return
          }

          // Ignore directory changes. We only care about file changes
          let stats: Stats | null = null
          try {
            stats = await fs.lstat(event.path)
          } catch {}
          if (!stats?.isFile() && !stats?.isSymbolicLink()) {
            return
          }

          // Track the changed file.
          files.add(event.path)
        }),
      )

      // Handle the tracked files at some point in the future.
      await enqueueCallback()
    })

    // Ensure we cleanup the watcher when we're done.
    watchers.add(unsubscribe)
  }

  // Cleanup
  return async () => {
    await watchers.dispose()
    await debounceQueue.dispose()
  }
}

function getRebuildStrategy(
  files: string[],
  fullRebuildPaths: string[],
): { kind: 'incremental'; changedFiles: ChangedContent[] } | { kind: 'full' } {
  let changedFiles: ChangedContent[] = []

  for (let file of files) {
    // If one of the changed files is related to the input CSS or JS
    // config/plugin files, then we need to do a full rebuild because
    // the theme might have changed.
    if (fullRebuildPaths.includes(file)) {
      return { kind: 'full' }
    }

    // Track new and updated files for incremental rebuilds.
    changedFiles.push({
      file,
      extension: path.extname(file).slice(1),
    } satisfies ChangedContent)
  }

  return { kind: 'incremental', changedFiles }
}

function createPollingWatcher(cb: () => Promise<void>, pollInterval: number) {
  let disposed = false
  let timer: ReturnType<typeof setTimeout> | null = null

  async function poll() {
    if (disposed) return

    try {
      await cb()
    } catch (err) {
      console.error(err)
    } finally {
      if (!disposed) {
        timer = setTimeout(poll, pollInterval)
      }
    }
  }

  timer = setTimeout(poll, pollInterval)

  return async () => {
    disposed = true
    if (timer) clearTimeout(timer)
  }
}

async function watchDirectories(scanner: Scanner) {
  let directories = (
    await Promise.all(
      scanner.normalizedSources.map(async (globEntry) => {
        let resolvedPath = path.resolve(globEntry.base)
        let realPath = await fs.realpath(resolvedPath).catch(() => resolvedPath)

        return fs
          .stat(realPath)
          .then((stat) => (stat.isDirectory() ? [realPath] : []))
          .catch(() => [])
      }),
    )
  ).flat(1)

  return Array.from(new Set(directories))
}

function dim(str: string) {
  return `\x1B[2m${str}\x1B[22m`
}

function red(str: string) {
  return `\x1B[31m${str}\x1B[39m`
}
