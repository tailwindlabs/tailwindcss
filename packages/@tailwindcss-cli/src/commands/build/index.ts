import watcher from '@parcel/watcher'
import { clearCache, scanDir, type ChangedContent, type GlobEntry } from '@tailwindcss/oxide'
import fixRelativePathsPlugin from 'internal-postcss-fix-relative-paths'
import { Features, transform } from 'lightningcss'
import { existsSync } from 'node:fs'
import fs from 'node:fs/promises'
import path from 'node:path'
import postcss from 'postcss'
import atImport from 'postcss-import'
import * as tailwindcss from 'tailwindcss'
import type { Arg, Result } from '../../utils/args'
import { disposables } from '../../utils/disposables'
import {
  eprintln,
  formatDuration,
  header,
  highlight,
  println,
  relative,
} from '../../utils/renderer'
import { resolve } from '../../utils/resolve'
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

  // Resolve the input
  let [input, cssImportPaths] = await handleImports(
    args['--input']
      ? args['--input'] === '-'
        ? await drainStdin()
        : await fs.readFile(args['--input'], 'utf-8')
      : css`
          @import '${resolve('tailwindcss/index.css')}';
        `,
    args['--input'] ?? base,
  )

  let previous = {
    css: '',
    optimizedCss: '',
  }

  async function write(css: string, args: Result<ReturnType<typeof options>>) {
    let output = css

    // Optimize the output
    if (args['--minify'] || args['--optimize']) {
      if (css !== previous.css) {
        let optimizedCss = optimizeCss(css, {
          file: args['--input'] ?? 'input.css',
          minify: args['--minify'] ?? false,
        })
        previous.css = css
        previous.optimizedCss = optimizedCss
        output = optimizedCss
      } else {
        output = previous.optimizedCss
      }
    }

    // Write the output
    if (args['--output']) {
      await outputFile(args['--output'], output)
    } else {
      println(output)
    }
  }

  let inputFile = args['--input'] && args['--input'] !== '-' ? args['--input'] : process.cwd()

  let basePath = path.dirname(path.resolve(inputFile))

  function compile(css: string) {
    let globs: string[] = []

    let { build } = tailwindcss.compile(css, {
      loadPlugin: (pluginPath) => {
        if (pluginPath[0] === '.') {
          return require(path.resolve(basePath, pluginPath))
        }

        return require(pluginPath)
      },
      onContentPath(glob) {
        globs.push(glob)
      },
    })

    return { build, globs }
  }

  // Compile the input
  let compiler = compile(input)
  let scanDirResult = scanDir({ base, contentPaths: compiler.globs })

  // Watch for changes
  if (args['--watch']) {
    let cleanupWatchers = await createWatchers(scanDirResult.globs, async function handle(files) {
      try {
        // If the only change happened to the output file, then we don't want to
        // trigger a rebuild because that will result in an infinite loop.
        if (files.length === 1 && files[0] === args['--output']) return

        let changedFiles: ChangedContent[] = []
        let rebuildStrategy: 'incremental' | 'full' = 'incremental'

        for (let file of files) {
          // If one of the changed files is related to the input CSS files, then
          // we need to do a full rebuild because the theme might have changed.
          if (cssImportPaths.includes(file)) {
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

          // Clear cached candidates
          clearCache()

          // Collect the new `input` and `cssImportPaths`.
          ;[input, cssImportPaths] = await handleImports(
            args['--input']
              ? await fs.readFile(args['--input'], 'utf-8')
              : css`
                  @import '${resolve('tailwindcss/index.css')}';
                `,
            args['--input'] ?? base,
          )

          // Create a new compiler, given the new `input`
          compiler = compile(input)

          // Re-scan the directory to get the new `candidates`
          scanDirResult = scanDir({ base, contentPaths: compiler.globs })

          // Setup new watchers
          cleanupWatchers = await createWatchers(scanDirResult.globs, handle)

          // Re-compile the CSS
          compiledCss = compiler.build(scanDirResult.candidates)
        }

        // Scan changed files only for incremental rebuilds.
        else if (rebuildStrategy === 'incremental') {
          let newCandidates = scanDirResult.scanFiles(changedFiles)

          // No candidates found which means we don't need to rebuild. This can
          // happen if a file is detected but doesn't match any of the globs.
          if (newCandidates.length === 0) return

          compiledCss = compiler.build(newCandidates)
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
    })

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

  await write(compiler.build(scanDirResult.candidates), args)

  let end = process.hrtime.bigint()
  eprintln(header())
  eprintln()
  eprintln(`Done in ${formatDuration(end - start)}`)
}

async function createWatchers(globs: GlobEntry[], handle: (files: string[]) => void) {
  let watchers = disposables()
  let files = new Set<string>()

  let d = disposables()
  function enqueueFlush() {
    d.dispose()
    d.queueMacrotask(() => {
      handle(Array.from(files))
      files.clear()
    })
  }

  // Setup a watcher for every glob based on the `base` directory.
  for (let glob of globs) {
    // Globs with `!` are negated and should not require a dedicated watcher.
    if (glob.glob[0] === '!') continue

    let { unsubscribe } = await watcher.subscribe(glob.base, async (err, events) => {
      if (err) {
        console.error(err)
        return
      }

      for (let event of events) {
        if (event.type === 'delete') continue
        files.add(event.path)
      }

      enqueueFlush()
    })

    watchers.add(unsubscribe)
  }

  return () => watchers.dispose()
}

function handleImports(
  input: string,
  file: string,
): [css: string, paths: string[]] | Promise<[css: string, paths: string[]]> {
  // TODO: Should we implement this ourselves instead of relying on PostCSS?
  //
  // Relevant specification:
  //   - CSS Import Resolve: https://csstools.github.io/css-import-resolve/

  if (!input.includes('@import') && !input.includes('@plugin') && !input.includes('@content')) {
    return [input, [file]]
  }

  return postcss()
    .use(atImport())
    .use(fixRelativePathsPlugin())
    .process(input, { from: file })
    .then((result) => [
      result.css,

      // Use `result.messages` to get the imported files. This also includes the
      // current file itself.
      [file].concat(
        result.messages.filter((msg) => msg.type === 'dependency').map((msg) => msg.file),
      ),
    ])
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
