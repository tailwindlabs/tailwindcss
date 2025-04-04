import QuickLRU from '@alloc/quick-lru'
import {
  compileAst,
  env,
  Features,
  Instrumentation,
  optimize as optimizeCss,
  Polyfills,
} from '@tailwindcss/node'
import { clearRequireCache } from '@tailwindcss/node/require-cache'
import { Scanner } from '@tailwindcss/oxide'
import fs from 'node:fs'
import path, { relative } from 'node:path'
import postcss, { type AcceptedPlugin, type PluginCreator } from 'postcss'
import { toCss, type AstNode } from '../../tailwindcss/src/ast'
import { cssAstToPostCssAst, postCssAstToCssAst } from './ast'
import fixRelativePathsPlugin from './postcss-fix-relative-paths'

const DEBUG = env.DEBUG

interface CacheEntry {
  mtimes: Map<string, number>
  compiler: null | ReturnType<typeof compileAst>
  scanner: null | Scanner
  tailwindCssAst: AstNode[]
  cachedPostCssAst: postcss.Root
  optimizedPostCssAst: postcss.Root
  fullRebuildPaths: string[]
}
const cache = new QuickLRU<string, CacheEntry>({ maxSize: 50 })

function getContextFromCache(inputFile: string, opts: PluginOptions): CacheEntry {
  let key = `${inputFile}:${opts.base ?? ''}:${JSON.stringify(opts.optimize)}`
  if (cache.has(key)) return cache.get(key)!
  let entry = {
    mtimes: new Map<string, number>(),
    compiler: null,
    scanner: null,

    tailwindCssAst: [],
    cachedPostCssAst: postcss.root(),
    optimizedPostCssAst: postcss.root(),

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
          using I = new Instrumentation()

          let inputFile = result.opts.from ?? ''
          let isCSSModuleFile = inputFile.endsWith('.module.css')

          DEBUG && I.start(`[@tailwindcss/postcss] ${relative(base, inputFile)}`)

          // Bail out early if this is guaranteed to be a non-Tailwind CSS file.
          {
            DEBUG && I.start('Quick bail check')
            let canBail = true
            root.walkAtRules((node) => {
              if (
                node.name === 'import' ||
                node.name === 'reference' ||
                node.name === 'theme' ||
                node.name === 'variant' ||
                node.name === 'config' ||
                node.name === 'plugin' ||
                node.name === 'apply' ||
                node.name === 'tailwind'
              ) {
                canBail = false
                return false
              }
            })
            if (canBail) return
            DEBUG && I.end('Quick bail check')
          }

          let context = getContextFromCache(inputFile, opts)
          let inputBasePath = path.dirname(path.resolve(inputFile))

          async function createCompiler() {
            DEBUG && I.start('Setup compiler')
            if (context.fullRebuildPaths.length > 0 && !isInitialBuild) {
              clearRequireCache(context.fullRebuildPaths)
            }

            context.fullRebuildPaths = []

            DEBUG && I.start('PostCSS AST -> Tailwind CSS AST')
            let ast = postCssAstToCssAst(root)
            DEBUG && I.end('PostCSS AST -> Tailwind CSS AST')

            DEBUG && I.start('Create compiler')
            let compiler = await compileAst(ast, {
              base: inputBasePath,
              shouldRewriteUrls: true,
              onDependency: (path) => {
                context.fullRebuildPaths.push(path)
              },
              // In CSS Module files, we have to disable the `@property` polyfill since these will
              // emit global `*` rules which are considered to be non-pure and will cause builds
              // to fail.
              polyfills: isCSSModuleFile ? Polyfills.All ^ Polyfills.AtProperty : Polyfills.All,
            })
            DEBUG && I.end('Create compiler')

            DEBUG && I.end('Setup compiler')
            return compiler
          }

          // Whether this is the first build or not, if it is, then we can
          // optimize the build by not creating the compiler until we need it.
          let isInitialBuild = context.compiler === null

          // Setup the compiler if it doesn't exist yet. This way we can
          // guarantee a `build()` function is available.
          context.compiler ??= createCompiler()

          if ((await context.compiler).features === Features.None) {
            return
          }

          let rebuildStrategy: 'full' | 'incremental' = 'incremental'

          // Track file modification times to CSS files
          DEBUG && I.start('Register full rebuild paths')
          {
            for (let file of context.fullRebuildPaths) {
              result.messages.push({
                type: 'dependency',
                plugin: '@tailwindcss/postcss',
                file: path.resolve(file),
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
          DEBUG && I.end('Register full rebuild paths')

          if (
            rebuildStrategy === 'full' &&
            // We can re-use the compiler if it was created during the
            // initial build. If it wasn't, we need to create a new one.
            !isInitialBuild
          ) {
            context.compiler = createCompiler()
          }

          let compiler = await context.compiler

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

            // Look for candidates used to generate the CSS
            context.scanner = new Scanner({ sources })
            DEBUG && I.end('Setup scanner')
          }

          DEBUG && I.start('Scan for candidates')
          let candidates = compiler.features & Features.Utilities ? context.scanner.scan() : []
          DEBUG && I.end('Scan for candidates')

          if (compiler.features & Features.Utilities) {
            DEBUG && I.start('Register dependency messages')
            // Add all found files as direct dependencies
            // Note: With Turbopack, the input file might not be a resolved path
            let resolvedInputFile = path.resolve(base, inputFile)
            for (let file of context.scanner.files) {
              let absolutePath = path.resolve(file)
              // The CSS file cannot be a dependency of itself
              if (absolutePath === resolvedInputFile) {
                continue
              }
              result.messages.push({
                type: 'dependency',
                plugin: '@tailwindcss/postcss',
                file: absolutePath,
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
                  file: path.resolve(globBase),
                  parent: result.opts.from,
                })
              } else {
                result.messages.push({
                  type: 'dir-dependency',
                  plugin: '@tailwindcss/postcss',
                  dir: path.resolve(globBase),
                  glob: pattern,
                  parent: result.opts.from,
                })
              }
            }
            DEBUG && I.end('Register dependency messages')
          }

          DEBUG && I.start('Build utilities')
          let tailwindCssAst = compiler.build(candidates)
          DEBUG && I.end('Build utilities')

          if (context.tailwindCssAst !== tailwindCssAst) {
            if (optimize) {
              DEBUG && I.start('Optimization')

              DEBUG && I.start('AST -> CSS')
              let css = toCss(tailwindCssAst)
              DEBUG && I.end('AST -> CSS')

              DEBUG && I.start('Lightning CSS')
              let ast = optimizeCss(css, {
                minify: typeof optimize === 'object' ? optimize.minify : true,
              })
              DEBUG && I.end('Lightning CSS')

              DEBUG && I.start('CSS -> PostCSS AST')
              context.optimizedPostCssAst = postcss.parse(ast, result.opts)
              DEBUG && I.end('CSS -> PostCSS AST')

              DEBUG && I.end('Optimization')
            } else {
              // Convert our AST to a PostCSS AST
              DEBUG && I.start('Transform Tailwind CSS AST into PostCSS AST')
              context.cachedPostCssAst = cssAstToPostCssAst(tailwindCssAst, root.source)
              DEBUG && I.end('Transform Tailwind CSS AST into PostCSS AST')
            }
          }

          context.tailwindCssAst = tailwindCssAst

          DEBUG && I.start('Update PostCSS AST')
          root.removeAll()
          root.append(
            optimize
              ? context.optimizedPostCssAst.clone().nodes
              : context.cachedPostCssAst.clone().nodes,
          )

          // Trick PostCSS into thinking the indent is 2 spaces, so it uses that
          // as the default instead of 4.
          root.raws.indent = '  '
          DEBUG && I.end('Update PostCSS AST')

          DEBUG && I.end(`[@tailwindcss/postcss] ${relative(base, inputFile)}`)
        },
      },
    ],
  }
}

export default Object.assign(tailwindcss, { postcss: true }) as PluginCreator<PluginOptions>
