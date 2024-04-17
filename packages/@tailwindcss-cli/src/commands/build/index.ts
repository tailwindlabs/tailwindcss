import remapping from '@ampproject/remapping'
import watcher from '@parcel/watcher'
import { IO, Parsing, scanDir, scanFiles, type ChangedContent } from '@tailwindcss/oxide'
import { Features, transform } from 'lightningcss'
import MagicString from 'magic-string'
import { existsSync } from 'node:fs'
import fs from 'node:fs/promises'
import path from 'node:path'
import postcss from 'postcss'
import atImport from 'postcss-import'
import type { RawSourceMap } from 'source-map-js'
import { compile } from 'tailwindcss'
import type { Arg, Result } from '../../utils/args'
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
    '--map': {
      type: 'boolean | string',
      description: 'Generate source maps',
      alias: '-p',
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

function attachInlineMap(source: string, map: any) {
  return (
    source +
    `\n/*# sourceMappingURL=data:application/json;base64,` +
    Buffer.from(JSON.stringify(map)).toString('base64') +
    ' */'
  )
}

export async function handle(args: Result<ReturnType<typeof options>>) {
  type SourceMapType = null | { kind: 'inline' } | { kind: 'file'; path: string }

  let sourcemapType: SourceMapType

  if (args['--map'] === true) {
    sourcemapType = { kind: 'inline' }
  } else if (typeof args['--map'] === 'string') {
    sourcemapType = { kind: 'file', path: args['--map'] }
  } else {
    sourcemapType = null
  }

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
  let { candidates } = scanDir({ base })

  let source = args['--input']
    ? args['--input'] === '-'
      ? await drainStdin()
      : await fs.readFile(args['--input'], 'utf-8')
    : css`
        @import '${resolve('tailwindcss/index.css')}';
      `

  let magic = new MagicString(source, {
    filename: 'source.css',
  })

  // Resolve the input
  let [input, cssImportPaths, importedMap] = await handleImports(
    source,
    args['--input'] ?? base,
    sourcemapType ? true : false,
  )

  let previous = {
    css: '',
    optimizedCss: '',
    optimizedMap: null,
  }

  async function write(
    css: string,
    tailwindMap: RawSourceMap | null,
    args: Result<ReturnType<typeof options>>,
  ) {
    let output = css

    let combinedMap = tailwindMap
      ? remapping(tailwindMap as any, (file) => {
          if (file === 'input.css') {
            return importedMap
          }

          if (file === 'imported.css') {
            return Object.assign(
              magic.generateDecodedMap({
                source: 'source.css',
                hires: 'boundary',
                includeContent: true,
              }),
              {
                version: 3 as const,
              },
            ) as any
          }

          return null
        })
      : null

    let outputMap = combinedMap

    // Optimize the output
    if (args['--minify'] || args['--optimize']) {
      if (css !== previous.css) {
        let { css: optimizedCss, map: optimizedMap } = optimizeCss(css, {
          file: args['--input'] ?? 'input.css',
          minify: args['--minify'] ?? false,
          map: combinedMap,
        })
        previous.css = css
        previous.optimizedCss = optimizedCss
        previous.optimizedMap = optimizedMap
        output = optimizedCss
        outputMap = optimizedMap
      } else {
        output = previous.optimizedCss
        outputMap = previous.optimizedMap
      }
    }

    if (outputMap && sourcemapType?.kind === 'inline') {
      output = attachInlineMap(output, outputMap)
    } else if (outputMap && sourcemapType?.kind === 'file') {
      await outputFile(sourcemapType.path, JSON.stringify(outputMap))
    }

    // Write the output
    if (args['--output']) {
      await outputFile(args['--output'], output)
    } else {
      println(output)
    }
  }

  // Compile the input
  let { build, buildSourceMap } = compile(input, {
    map: sourcemapType ? true : false,
  })

  let outputCss = build(candidates)
  let outputMap = sourcemapType ? buildSourceMap() : null

  await write(outputCss, outputMap, args)

  let end = process.hrtime.bigint()
  eprintln(header())
  eprintln()
  eprintln(`Done in ${formatDuration(end - start)}`)

  // Watch for changes
  if (args['--watch']) {
    await watcher.subscribe(base, async (err, events) => {
      if (err) {
        console.error(err)
        return
      }

      try {
        // If the only change happened to the output file, then we don't want to
        // trigger a rebuild because that will result in an infinite loop.
        if (events.length === 1 && events[0].path === args['--output']) return

        let changedFiles: ChangedContent[] = []
        let rebuildStrategy: 'incremental' | 'full' = 'incremental'

        for (let event of events) {
          // Track new and updated files for incremental rebuilds.
          if (event.type === 'create' || event.type === 'update') {
            changedFiles.push({
              file: event.path,
              extension: path.extname(event.path).slice(1),
            } satisfies ChangedContent)
          }

          // If one of the changed files is related to the input CSS files, then
          // we need to do a full rebuild because the theme might have changed.
          if (cssImportPaths.includes(event.path)) {
            rebuildStrategy = 'full'

            // No need to check the rest of the events, because we already know we
            // need to do a full rebuild.
            break
          }
        }

        // Re-compile the input
        let start = process.hrtime.bigint()

        // Track the compiled CSS
        let compiledCss = ''
        let compiledMap = null

        // Scan the entire `base` directory for full rebuilds.
        if (rebuildStrategy === 'full') {
          // Re-scan the directory to get the new `candidates`.
          candidates = scanDir({ base }).candidates

          // Collect the new `input` and `cssImportPaths`.
          ;[input, cssImportPaths] = await handleImports(
            args['--input']
              ? await fs.readFile(args['--input'], 'utf-8')
              : css`
                  @import '${resolve('tailwindcss/index.css')}';
                `,
            args['--input'] ?? base,
            sourcemapType ? true : false,
          )

          let compiler = compile(input, { map: sourcemapType ? true : false })
          ;[build, buildSourceMap] = [compiler.build, compiler.buildSourceMap]
          compiledCss = build(candidates)
          compiledMap = sourcemapType ? buildSourceMap() : null
        }

        // Scan changed files only for incremental rebuilds.
        else if (rebuildStrategy === 'incremental') {
          let newCandidates = scanFiles(changedFiles, IO.Sequential | Parsing.Sequential)

          compiledCss = build(newCandidates)
          compiledMap = sourcemapType ? buildSourceMap() : null
        }

        await write(compiledCss, compiledMap, args)

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
        process.exit(0)
      })
    }

    // Keep the process running
    process.stdin.resume()
  }
}

type ImportResult = [css: string, paths: string[], map: RawSourceMap | null]

function handleImports(
  input: string,
  file: string,
  map: boolean,
): ImportResult | Promise<ImportResult> {
  // TODO: Should we implement this ourselves instead of relying on PostCSS?
  //
  // Relevant specification:
  //   - CSS Import Resolve: https://csstools.github.io/css-import-resolve/

  if (!input.includes('@import')) {
    return [input, [file], null]
  }

  return postcss()
    .use(atImport())
    .process(input, {
      from: file,
      map: map
        ? {
            // We do not want an inline source map because we'll have to parse it back out
            inline: false,

            // Pass in the map we generated earlier using MagicString
            prev: false,

            // We want source data to be included in the resulting map
            sourcesContent: true,

            // Don't add a comment with the source map URL at the end of the file
            // We'll do this manually if needed
            annotation: false,

            // Require absolute paths in the source map
            absolute: true,
          }
        : false,
    })
    .then((result) => [
      result.css,

      // Use `result.messages` to get the imported files. This also includes the
      // current file itself.
      [file].concat(
        result.messages.filter((msg) => msg.type === 'dependency').map((msg) => msg.file),
      ),

      // Return the source map if it exists
      result.map?.toJSON() ?? null,
    ])
}

function optimizeCss(
  input: string,
  {
    file = 'input.css',
    minify = false,
    map = null,
  }: { file?: string; minify?: boolean; map?: any } = {},
) {
  let result = transform({
    filename: file,
    code: Buffer.from(input),
    minify,
    sourceMap: map ? true : false,
    inputSourceMap: map ? JSON.stringify(map) : undefined,
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
  })

  return {
    css: result.code.toString(),
    map: result.map ? JSON.parse(result.map.toString()) : null,
  }
}
