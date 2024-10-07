import watcher from '@parcel/watcher'
import { compile, env } from '@tailwindcss/node'
import { clearRequireCache } from '@tailwindcss/node/require-cache'
import { Scanner, type ChangedContent } from '@tailwindcss/oxide'
import { Features, transform } from 'lightningcss'
import { existsSync, Stats } from 'node:fs'
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

export async function handle(args: Result<ReturnType<typeof options>>) {
  let base = path.resolve(args['--cwd'])

  // Resolve the output as an absolute path.
  if (args['--output']) {
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

  async function write(css: string, args: Result<ReturnType<typeof options>>) {
    let output = css

    // Optimize the output
    if (args['--minify'] || args['--optimize']) {
      if (css !== previous.css) {
        env.DEBUG && console.time('[@tailwindcss/cli] Optimize CSS')
        let optimizedCss = optimizeCss(css, {
          file: args['--input'] ?? 'input.css',
          minify: args['--minify'] ?? false,
        })
        env.DEBUG && console.timeEnd('[@tailwindcss/cli] Optimize CSS')
        previous.css = css
        previous.optimizedCss = optimizedCss
        output = optimizedCss
      } else {
        output = previous.optimizedCss
      }
    }

    // Write the output
    env.DEBUG && console.time('[@tailwindcss/cli] Write output')
    if (args['--output']) {
      await outputFile(args['--output'], output)
    } else {
      println(output)
    }
    env.DEBUG && console.timeEnd('[@tailwindcss/cli] Write output')
  }

  let inputBasePath =
    args['--input'] && args['--input'] !== '-'
      ? path.dirname(path.resolve(args['--input']))
      : process.cwd()
  let fullRebuildPaths: string[] = []

  async function createCompiler(css: string) {
    env.DEBUG && console.time('[@tailwindcss/cli] Setup compiler')
    let compiler = await compile(css, {
      base: inputBasePath,
      onDependency(path) {
        fullRebuildPaths.push(path)
      },
    })
    env.DEBUG && console.timeEnd('[@tailwindcss/cli] Setup compiler')
    return compiler
  }

  // Compile the input
  let compiler = await createCompiler(input)
  let scanner = new Scanner({
    detectSources: { base },
    sources: compiler.globs,
  })

  // Watch for changes
  if (args['--watch']) {
    let cleanupWatchers = await createWatchers(
      watchDirectories(base, scanner),
      async function handle(files) {
        try {
          // If the only change happened to the output file, then we don't want to
          // trigger a rebuild because that will result in an infinite loop.
          if (files.length === 1 && files[0] === args['--output']) return

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

          // Re-compile the input
          let start = process.hrtime.bigint()

          // Track the compiled CSS
          let compiledCss = ''

          // Scan the entire `base` directory for full rebuilds.
          if (rebuildStrategy === 'full') {
            // Clear all watchers
            cleanupWatchers()

            // Read the new `input`.
            let input = args['--input']
              ? args['--input'] === '-'
                ? await drainStdin()
                : await fs.readFile(args['--input'], 'utf-8')
              : css`
                  @import 'tailwindcss';
                `
            clearRequireCache(resolvedFullRebuildPaths)
            fullRebuildPaths = []

            // Create a new compiler, given the new `input`
            compiler = await createCompiler(input)

            // Re-scan the directory to get the new `candidates`
            scanner = new Scanner({
              detectSources: { base },
              sources: compiler.globs,
            })

            // Scan the directory for candidates
            env.DEBUG && console.time('[@tailwindcss/cli] Scan for candidates')
            let candidates = scanner.scan()
            env.DEBUG && console.timeEnd('[@tailwindcss/cli] Scan for candidates')

            // Setup new watchers
            cleanupWatchers = await createWatchers(watchDirectories(base, scanner), handle)

            // Re-compile the CSS
            env.DEBUG && console.time('[@tailwindcss/cli] Build CSS')
            compiledCss = compiler.build(candidates)
            env.DEBUG && console.timeEnd('[@tailwindcss/cli] Build CSS')
          }

          // Scan changed files only for incremental rebuilds.
          else if (rebuildStrategy === 'incremental') {
            env.DEBUG && console.time('[@tailwindcss/cli] Scan for candidates')
            let newCandidates = scanner.scanFiles(changedFiles)
            env.DEBUG && console.timeEnd('[@tailwindcss/cli] Scan for candidates')

            // No new candidates found which means we don't need to write to
            // disk, and can return early.
            if (newCandidates.length <= 0) {
              let end = process.hrtime.bigint()
              eprintln(`Done in ${formatDuration(end - start)}`)
              return
            }

            env.DEBUG && console.time('[@tailwindcss/cli] Build CSS')
            compiledCss = compiler.build(newCandidates)
            env.DEBUG && console.timeEnd('[@tailwindcss/cli] Build CSS')
          }

          await write(compiledCss, args)

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
        cleanupWatchers()
        process.exit(0)
      })
    }

    // Keep the process running
    process.stdin.resume()
  }

  env.DEBUG && console.time('[@tailwindcss/cli] Scan for candidates')
  let candidates = scanner.scan()
  env.DEBUG && console.timeEnd('[@tailwindcss/cli] Scan for candidates')
  env.DEBUG && console.time('[@tailwindcss/cli] Build CSS')
  let output = compiler.build(candidates)
  env.DEBUG && console.timeEnd('[@tailwindcss/cli] Build CSS')
  await write(output, args)

  let end = process.hrtime.bigint()
  eprintln(header())
  eprintln()
  eprintln(`Done in ${formatDuration(end - start)}`)
}

function watchDirectories(base: string, scanner: Scanner) {
  return [base].concat(
    scanner.globs.flatMap((globEntry) => {
      // We don't want a watcher for negated globs.
      if (globEntry.pattern[0] === '!') return []

      // We don't want a watcher for nested directories, these will be covered
      // by the `base` directory already.
      if (globEntry.base.startsWith(base)) return []

      return globEntry.base
    }),
  )
}

async function createWatchers(dirs: string[], cb: (files: string[]) => void) {
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
  function enqueueCallback() {
    // Dispose all existing macrotask.
    debounceQueue.dispose()

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
          if (stats === null || stats.isDirectory()) {
            return
          }

          // Track the changed file.
          files.add(event.path)
        }),
      )

      // Handle the tracked files at some point in the future.
      enqueueCallback()
    })

    // Ensure we cleanup the watcher when we're done.
    watchers.add(unsubscribe)
  }

  // Cleanup
  return () => {
    watchers.dispose()
    debounceQueue.dispose()
  }
}

function optimizeCss(
  input: string,
  { file = 'input.css', minify = false }: { file?: string; minify?: boolean } = {},
) {
  return transform({
    filename: file,
    code: Buffer.from(input),
    minify,
    sourceMap: false,
    drafts: {
      customMedia: true,
    },
    nonStandard: {
      deepSelectorCombinator: true,
    },
    include: Features.Nesting,
    exclude: Features.LogicalProperties,
    targets: {
      safari: (16 << 16) | (4 << 8),
    },
    errorRecovery: true,
  }).code.toString()
}
