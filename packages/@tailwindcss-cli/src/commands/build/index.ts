import watcher from '@parcel/watcher'
import { compile, env, Instrumentation, optimize } from '@tailwindcss/node'
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
} from '../../utils/renderer'
import { drainStdin, outputFile } from './utils'

const css = String.raw
const DEBUG = env.DEBUG

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
      description: 'Watch for changes and rebuild as needed',
      alias: '-w',
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
  } satisfies Arg
}

async function handleError<T>(fn: () => T): Promise<T> {
  try {
    return await fn()
  } catch (err) {
    if (err instanceof Error) {
      eprintln(err.toString())
    }
    process.exit(1)
  }
}

export async function handle(args: Result<ReturnType<typeof options>>) {
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
      eprintln(header())
      eprintln()
      eprintln(`Specified input file ${highlight(relative(args['--input']))} does not exist.`)
      process.exit(1)
    }
  }

  // Check if the input and output file paths are identical, otherwise return an
  // error to the user.
  if (args['--input'] === args['--output'] && args['--input'] !== '-') {
    eprintln(header())
    eprintln()
    eprintln(
      `Specified input file ${highlight(relative(args['--input']))} and output file ${highlight(relative(args['--output']))} are identical.`,
    )
    process.exit(1)
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
  }

  async function write(css: string, args: Result<ReturnType<typeof options>>, I: Instrumentation) {
    let output = css

    // Optimize the output
    if (args['--minify'] || args['--optimize']) {
      if (css !== previous.css) {
        DEBUG && I.start('Optimize CSS')
        let optimizedCss = optimize(css, {
          file: args['--input'] ?? 'input.css',
          minify: args['--minify'] ?? false,
        })
        DEBUG && I.end('Optimize CSS')
        previous.css = css
        previous.optimizedCss = optimizedCss
        output = optimizedCss
      } else {
        output = previous.optimizedCss
      }
    }

    // Write the output
    DEBUG && I.start('Write output')
    if (args['--output'] && args['--output'] !== '-') {
      await outputFile(args['--output'], output)
    } else {
      println(output)
    }
    DEBUG && I.end('Write output')
  }

  let inputFilePath =
    args['--input'] && args['--input'] !== '-' ? path.resolve(args['--input']) : null

  let inputBasePath = inputFilePath ? path.dirname(inputFilePath) : process.cwd()

  let fullRebuildPaths: string[] = inputFilePath ? [inputFilePath] : []

  async function createCompiler(css: string, I: Instrumentation) {
    DEBUG && I.start('Setup compiler')
    let compiler = await compile(css, {
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

    let scanner = new Scanner({ sources })
    DEBUG && I.end('Setup compiler')

    return [compiler, scanner] as const
  }

  let [compiler, scanner] = await handleError(() => createCompiler(input, I))

  // Watch for changes
  if (args['--watch']) {
    let cleanupWatchers = await createWatchers(
      watchDirectories(scanner),
      async function handle(files) {
        try {
          // If the only change happened to the output file, then we don't want to
          // trigger a rebuild because that will result in an infinite loop.
          if (files.length === 1 && files[0] === args['--output']) return

          using I = new Instrumentation()
          DEBUG && I.start('[@tailwindcss/cli] (watcher)')

          // Re-compile the input
          let start = process.hrtime.bigint()

          let changedFiles: ChangedContent[] = []
          let rebuildStrategy: 'incremental' | 'full' = 'incremental'

          let resolvedFullRebuildPaths = fullRebuildPaths

          for (let file of files) {
            // If one of the changed files is related to the input CSS or JS
            // config/plugin files, then we need to do a full rebuild because
            // the theme might have changed.
            if (resolvedFullRebuildPaths.includes(file)) {
              rebuildStrategy = 'full'

              // No need to check the rest of the events, because we already know we
              // need to do a full rebuild.
              break
            }

            // Track new and updated files for incremental rebuilds.
            changedFiles.push({
              file,
              extension: path.extname(file).slice(1),
            } satisfies ChangedContent)
          }

          // Track the compiled CSS
          let compiledCss = ''

          // Scan the entire `base` directory for full rebuilds.
          if (rebuildStrategy === 'full') {
            // Read the new `input`.
            let input = args['--input']
              ? args['--input'] === '-'
                ? await drainStdin()
                : await fs.readFile(args['--input'], 'utf-8')
              : css`
                  @import 'tailwindcss';
                `
            clearRequireCache(resolvedFullRebuildPaths)
            fullRebuildPaths = inputFilePath ? [inputFilePath] : []

            // Create a new compiler, given the new `input`
            ;[compiler, scanner] = await createCompiler(input, I)

            // Scan the directory for candidates
            DEBUG && I.start('Scan for candidates')
            let candidates = scanner.scan()
            DEBUG && I.end('Scan for candidates')

            // Setup new watchers
            DEBUG && I.start('Setup new watchers')
            let newCleanupWatchers = await createWatchers(watchDirectories(scanner), handle)
            DEBUG && I.end('Setup new watchers')

            // Clear old watchers
            DEBUG && I.start('Cleanup old watchers')
            await cleanupWatchers()
            DEBUG && I.end('Cleanup old watchers')

            cleanupWatchers = newCleanupWatchers

            // Re-compile the CSS
            DEBUG && I.start('Build CSS')
            compiledCss = compiler.build(candidates)
            DEBUG && I.end('Build CSS')
          }

          // Scan changed files only for incremental rebuilds.
          else if (rebuildStrategy === 'incremental') {
            DEBUG && I.start('Scan for candidates')
            let newCandidates = scanner.scanFiles(changedFiles)
            DEBUG && I.end('Scan for candidates')

            // No new candidates found which means we don't need to write to
            // disk, and can return early.
            if (newCandidates.length <= 0) {
              let end = process.hrtime.bigint()
              eprintln(`Done in ${formatDuration(end - start)}`)
              return
            }

            DEBUG && I.start('Build CSS')
            compiledCss = compiler.build(newCandidates)
            DEBUG && I.end('Build CSS')
          }

          await write(compiledCss, args, I)

          let end = process.hrtime.bigint()
          eprintln(`Done in ${formatDuration(end - start)}`)
        } catch (err) {
          // Catch any errors and print them to stderr, but don't exit the process
          // and keep watching.
          if (err instanceof Error) {
            eprintln(err.toString())
          }
        }
      },
    )

    // Abort the watcher if `stdin` is closed to avoid zombie processes. You can
    // disable this behavior with `--watch=always`.
    if (args['--watch'] !== 'always') {
      process.stdin.on('end', () => {
        cleanupWatchers().then(
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
  await write(output, args, I)

  let end = process.hrtime.bigint()
  eprintln(header())
  eprintln()
  eprintln(`Done in ${formatDuration(end - start)}`)
}

async function createWatchers(dirs: string[], cb: (files: string[]) => void) {
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
          // We currently don't handle deleted files because it doesn't influence
          // the CSS output. This is because we currently keep all scanned
          // candidates in a cache for performance reasons.
          if (event.type === 'delete') return

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

function watchDirectories(scanner: Scanner) {
  return [...new Set(scanner.normalizedSources.flatMap((globEntry) => globEntry.base))]
}
