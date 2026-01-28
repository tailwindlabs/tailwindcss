import { compile, env, Features, Instrumentation, normalizePath, optimize } from '@tailwindcss/node'
import { clearRequireCache } from '@tailwindcss/node/require-cache'
import { Scanner } from '@tailwindcss/oxide'
import fs from 'node:fs'
import path from 'node:path'
import type { LoaderContext } from 'webpack'

const DEBUG = env.DEBUG

export interface LoaderOptions {
  /**
   * The base directory to scan for class candidates.
   *
   * Defaults to the current working directory.
   */
  base?: string

  /**
   * Optimize and minify the output CSS.
   */
  optimize?: boolean | { minify?: boolean }
}

interface CacheEntry {
  mtimes: Map<string, number>
  compiler: null | Awaited<ReturnType<typeof compile>>
  scanner: null | Scanner
  candidates: Set<string>
  fullRebuildPaths: string[]
}

const cache = new Map<string, CacheEntry>()

function getContextFromCache(inputFile: string, opts: LoaderOptions): CacheEntry {
  let key = `${inputFile}:${opts.base ?? ''}:${JSON.stringify(opts.optimize)}`
  if (cache.has(key)) return cache.get(key)!
  let entry: CacheEntry = {
    mtimes: new Map<string, number>(),
    compiler: null,
    scanner: null,
    candidates: new Set<string>(),
    fullRebuildPaths: [],
  }
  cache.set(key, entry)
  return entry
}

export default async function tailwindLoader(
  this: LoaderContext<LoaderOptions>,
  source: string,
): Promise<void> {
  const callback = this.async()
  const options = this.getOptions() ?? {}
  const inputFile = this.resourcePath
  const base = options.base ?? process.cwd()
  const shouldOptimize = options.optimize ?? process.env.NODE_ENV === 'production'

  using I = new Instrumentation()

  DEBUG && I.start(`[@tailwindcss/webpack] ${path.relative(base, inputFile)}`)

  try {
    let context = getContextFromCache(inputFile, options)
    let inputBasePath = path.dirname(path.resolve(inputFile))

    // Whether this is the first build or not
    let isInitialBuild = context.compiler === null

    async function createCompiler() {
      DEBUG && I.start('Setup compiler')
      if (context.fullRebuildPaths.length > 0 && !isInitialBuild) {
        clearRequireCache(context.fullRebuildPaths)
      }

      context.fullRebuildPaths = []

      DEBUG && I.start('Create compiler')
      let compiler = await compile(source, {
        from: inputFile,
        base: inputBasePath,
        shouldRewriteUrls: true,
        onDependency: (depPath) => context.fullRebuildPaths.push(depPath),
      })
      DEBUG && I.end('Create compiler')

      DEBUG && I.end('Setup compiler')
      return compiler
    }

    // Setup the compiler if it doesn't exist yet
    context.compiler ??= await createCompiler()

    // Early exit if no Tailwind features are used
    if (context.compiler.features === Features.None) {
      DEBUG && I.end(`[@tailwindcss/webpack] ${path.relative(base, inputFile)}`)
      callback(null, source)
      return
    }

    let rebuildStrategy: 'full' | 'incremental' = 'incremental'

    // Track file modification times to CSS files
    DEBUG && I.start('Register full rebuild paths')
    {
      // Report dependencies for config files, plugins, etc.
      for (let file of context.fullRebuildPaths) {
        this.addDependency(path.resolve(file))
      }

      let files = [...context.fullRebuildPaths, inputFile]

      for (let file of files) {
        let changedTime: number | null = null
        try {
          changedTime = fs.statSync(file)?.mtimeMs ?? null
        } catch {
          // File might not exist
        }

        if (changedTime === null) {
          if (file === inputFile) {
            rebuildStrategy = 'full'
          }
          continue
        }

        let prevTime = context.mtimes.get(file)
        if (prevTime === changedTime) continue

        rebuildStrategy = 'full'
        context.mtimes.set(file, changedTime)
      }
    }
    DEBUG && I.end('Register full rebuild paths')

    if (rebuildStrategy === 'full' && !isInitialBuild) {
      context.compiler = await createCompiler()
    }

    let compiler = context.compiler

    // Check if we need to process this file at all
    if (
      !(
        compiler.features &
        (Features.AtApply | Features.JsPluginCompat | Features.ThemeFunction | Features.Utilities)
      )
    ) {
      DEBUG && I.end(`[@tailwindcss/webpack] ${path.relative(base, inputFile)}`)
      callback(null, source)
      return
    }

    // Setup or update scanner if needed
    if (context.scanner === null || rebuildStrategy === 'full') {
      DEBUG && I.start('Setup scanner')
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

      context.scanner = new Scanner({ sources })
      DEBUG && I.end('Setup scanner')
    }

    // Scan for candidates if utilities are used
    if (compiler.features & Features.Utilities) {
      DEBUG && I.start('Scan for candidates')
      for (let candidate of context.scanner.scan()) {
        context.candidates.add(candidate)
      }
      DEBUG && I.end('Scan for candidates')

      DEBUG && I.start('Register dependency messages')
      // Add all found files as direct dependencies
      let resolvedInputFile = path.resolve(base, inputFile)
      for (let file of context.scanner.files) {
        let absolutePath = path.resolve(file)
        // The CSS file cannot be a dependency of itself
        if (absolutePath === resolvedInputFile) {
          continue
        }
        this.addDependency(absolutePath)
      }

      // Register context dependencies for glob patterns
      for (let glob of context.scanner.globs) {
        // Skip negated patterns
        if (glob.pattern[0] === '!') continue

        // Avoid adding a dependency on the base directory itself
        if (glob.pattern === '*' && base === glob.base) {
          continue
        }

        this.addContextDependency(path.resolve(glob.base))
      }

      // Validate that source(...) paths are directories
      let root = compiler.root
      if (root !== 'none' && root !== null) {
        let basePath = normalizePath(path.resolve(root.base, root.pattern))
        try {
          let stats = fs.statSync(basePath)
          if (!stats.isDirectory()) {
            throw new Error(
              `The path given to \`source(…)\` must be a directory but got \`source(${basePath})\` instead.`,
            )
          }
        } catch (err) {
          if ((err as NodeJS.ErrnoException).code !== 'ENOENT') {
            throw err
          }
          // Directory doesn't exist yet, which is fine
        }
      }
      DEBUG && I.end('Register dependency messages')
    }

    DEBUG && I.start('Build utilities')
    let css = compiler.build([...context.candidates])
    DEBUG && I.end('Build utilities')

    // Optionally optimize the output
    let result = css
    if (shouldOptimize) {
      DEBUG && I.start('Optimization')
      let optimized = optimize(css, {
        minify: typeof shouldOptimize === 'object' ? shouldOptimize.minify : true,
      })
      result = optimized.code
      DEBUG && I.end('Optimization')
    }

    DEBUG && I.end(`[@tailwindcss/webpack] ${path.relative(base, inputFile)}`)
    callback(null, result)
  } catch (error) {
    // Clear the cache entry on error to force a full rebuild next time
    let key = `${inputFile}:${options.base ?? ''}:${JSON.stringify(options.optimize)}`
    cache.delete(key)

    DEBUG && I.end(`[@tailwindcss/webpack] ${path.relative(base, inputFile)}`)
    callback(error as Error)
  }
}
