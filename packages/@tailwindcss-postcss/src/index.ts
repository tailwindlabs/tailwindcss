import QuickLRU from '@alloc/quick-lru'
import { compileAst, env, Features } from '@tailwindcss/node'
import { clearRequireCache } from '@tailwindcss/node/require-cache'
import { Scanner } from '@tailwindcss/oxide'
import { Features as LightningCssFeatures, transform } from 'lightningcss'
import fs from 'node:fs'
import path from 'node:path'
import postcss, { type AcceptedPlugin, type PluginCreator } from 'postcss'
import type { AstNode } from '../../tailwindcss/src/ast'
import { cssAstToPostCssAst, postCssAstToCssAst } from './ast'
import fixRelativePathsPlugin from './postcss-fix-relative-paths'

interface CacheEntry {
  mtimes: Map<string, number>
  compiler: null | Awaited<ReturnType<typeof compileAst>>
  scanner: null | Scanner
  css: string
  optimizedCss: string
  fullRebuildPaths: string[]
}
let cache = new QuickLRU<string, CacheEntry>({ maxSize: 50 })

function getContextFromCache(inputFile: string, opts: PluginOptions): CacheEntry {
  let key = `${inputFile}:${opts.base ?? ''}:${opts.optimize ?? ''}`
  if (cache.has(key)) return cache.get(key)!
  let entry = {
    mtimes: new Map<string, number>(),
    compiler: null,
    scanner: null,
    css: '',
    optimizedCss: '',
    fullRebuildPaths: [] as string[],
  }
  cache.set(key, entry)
  return entry
}

export type PluginOptions = {
  // The base directory to scan for class candidates.
  base?: string

  // Optimize and minify the output CSS.
  optimize?: boolean | { minify?: boolean }
}

function tailwindcss(opts: PluginOptions = {}): AcceptedPlugin {
  let base = opts.base ?? process.cwd()
  let optimize = opts.optimize ?? process.env.NODE_ENV === 'production'

  return {
    postcssPlugin: '@tailwindcss/postcss',
    plugins: [
      // We need to handle the case where `postcss-import` might have run before
      // the Tailwind CSS plugin is run. In this case, we need to manually fix
      // relative paths before processing it in core.
      fixRelativePathsPlugin(),

      {
        postcssPlugin: 'tailwindcss',
        async Once(root, { result }) {
          env.DEBUG && console.time('[@tailwindcss/postcss] Total time in @tailwindcss/postcss')
          let inputFile = result.opts.from ?? ''
          let context = getContextFromCache(inputFile, opts)
          let inputBasePath = path.dirname(path.resolve(inputFile))

          async function createCompiler() {
            env.DEBUG && console.time('[@tailwindcss/postcss] Setup compiler')
            if (context.fullRebuildPaths.length > 0 && !isInitialBuild) {
              clearRequireCache(context.fullRebuildPaths)
            }

            context.fullRebuildPaths = []

            let compiler = await compileAst(postCssAstToCssAst(root), {
              base: inputBasePath,
              onDependency: (path) => {
                context.fullRebuildPaths.push(path)
              },
            })

            env.DEBUG && console.timeEnd('[@tailwindcss/postcss] Setup compiler')
            return compiler
          }

          // Whether this is the first build or not, if it is, then we can
          // optimize the build by not creating the compiler until we need it.
          let isInitialBuild = context.compiler === null

          // Setup the compiler if it doesn't exist yet. This way we can
          // guarantee a `build()` function is available.
          context.compiler ??= await createCompiler()

          if (context.compiler.features === Features.None) {
            return
          }

          let rebuildStrategy: 'full' | 'incremental' = 'incremental'

          // Track file modification times to CSS files
          {
            for (let file of context.fullRebuildPaths) {
              result.messages.push({
                type: 'dependency',
                plugin: '@tailwindcss/postcss',
                file,
                parent: result.opts.from,
              })
            }

            let files = result.messages.flatMap((message) => {
              if (message.type !== 'dependency') return []
              return message.file
            })
            files.push(inputFile)

            for (let file of files) {
              let changedTime = fs.statSync(file, { throwIfNoEntry: false })?.mtimeMs ?? null
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

          let ast: AstNode[] = []
          let css = ''

          if (
            rebuildStrategy === 'full' &&
            // We can re-use the compiler if it was created during the
            // initial build. If it wasn't, we need to create a new one.
            !isInitialBuild
          ) {
            context.compiler = await createCompiler()
          }

          if (context.scanner === null || rebuildStrategy === 'full') {
            let sources = (() => {
              // Disable auto source detection
              if (context.compiler.root === 'none') {
                return []
              }

              // No root specified, use the base directory
              if (context.compiler.root === null) {
                return [{ base, pattern: '**/*' }]
              }

              // Use the specified root
              return [context.compiler.root]
            })().concat(context.compiler.globs)

            // Look for candidates used to generate the CSS
            context.scanner = new Scanner({ sources })
          }

          env.DEBUG && console.time('[@tailwindcss/postcss] Scan for candidates')
          let candidates =
            context.compiler.features & Features.Utilities ? context.scanner.scan() : []
          env.DEBUG && console.timeEnd('[@tailwindcss/postcss] Scan for candidates')

          if (context.compiler.features & Features.Utilities) {
            // Add all found files as direct dependencies
            for (let file of context.scanner.files) {
              result.messages.push({
                type: 'dependency',
                plugin: '@tailwindcss/postcss',
                file,
                parent: result.opts.from,
              })
            }

            // Register dependencies so changes in `base` cause a rebuild while
            // giving tools like Vite or Parcel a glob that can be used to limit
            // the files that cause a rebuild to only those that match it.
            for (let { base: globBase, pattern } of context.scanner.globs) {
              // Avoid adding a dependency on the base directory itself, since it
              // causes Next.js to start an endless recursion if the `distDir` is
              // configured to anything other than the default `.next` dir.
              if (pattern === '*' && base === globBase) {
                continue
              }

              if (pattern === '') {
                result.messages.push({
                  type: 'dependency',
                  plugin: '@tailwindcss/postcss',
                  file: globBase,
                  parent: result.opts.from,
                })
              } else {
                result.messages.push({
                  type: 'dir-dependency',
                  plugin: '@tailwindcss/postcss',
                  dir: globBase,
                  glob: pattern,
                  parent: result.opts.from,
                })
              }
            }
          }

          env.DEBUG && console.time('[@tailwindcss/postcss] Build CSS')
          ast = context.compiler.build(candidates)
          env.DEBUG && console.timeEnd('[@tailwindcss/postcss] Build CSS')

          if (optimize) {
            // Replace CSS
            if (css !== context.css && optimize) {
              env.DEBUG && console.time('[@tailwindcss/postcss] Optimize CSS')
              context.optimizedCss = optimizeCss(css, {
                minify: typeof optimize === 'object' ? optimize.minify : true,
              })
              env.DEBUG && console.timeEnd('[@tailwindcss/postcss] Optimize CSS')
            }
            context.css = css

            env.DEBUG && console.time('[@tailwindcss/postcss] Update PostCSS AST')
            root.removeAll()
            root.append(postcss.parse(optimize ? context.optimizedCss : context.css, result.opts))
            env.DEBUG && console.timeEnd('[@tailwindcss/postcss] Update PostCSS AST')
            env.DEBUG &&
              console.timeEnd('[@tailwindcss/postcss] Total time in @tailwindcss/postcss')
          } else {
            root.removeAll()
            root.append(cssAstToPostCssAst(ast))
          }
        },
      },
    ],
  }
}

function optimizeCss(
  input: string,
  { file = 'input.css', minify = false }: { file?: string; minify?: boolean } = {},
) {
  function optimize(code: Buffer | Uint8Array) {
    return transform({
      filename: file,
      code,
      minify,
      sourceMap: false,
      drafts: {
        customMedia: true,
      },
      nonStandard: {
        deepSelectorCombinator: true,
      },
      include: LightningCssFeatures.Nesting,
      exclude: LightningCssFeatures.LogicalProperties,
      targets: {
        safari: (16 << 16) | (4 << 8),
        ios_saf: (16 << 16) | (4 << 8),
        firefox: 128 << 16,
        chrome: 120 << 16,
      },
      errorRecovery: true,
    }).code
  }

  // Running Lightning CSS twice to ensure that adjacent rules are merged after
  // nesting is applied. This creates a more optimized output.
  return optimize(optimize(Buffer.from(input))).toString()
}

export default Object.assign(tailwindcss, { postcss: true }) as PluginCreator<PluginOptions>
