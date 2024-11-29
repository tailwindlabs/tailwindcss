import QuickLRU from '@alloc/quick-lru'
import { compile, env, Features } from '@tailwindcss/node'
import { clearRequireCache } from '@tailwindcss/node/require-cache'
import { Scanner } from '@tailwindcss/oxide'
import { Features as LightningCssFeatures, transform } from 'lightningcss'
import fs from 'node:fs'
import path from 'node:path'
import postcss, {
  type AcceptedPlugin,
  type PluginCreator,
  type Container as PostCSSContainerNode,
  type Node as PostCSSNode,
} from 'postcss'
import { type AstNode } from '../../tailwindcss/src/ast'
import fixRelativePathsPlugin from './postcss-fix-relative-paths'

interface CacheEntry {
  mtimes: Map<string, number>
  compiler: null | Awaited<ReturnType<typeof compile>>
  scanner: null | Scanner
  ast: AstNode[] | null
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
    ast: null,
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
  let inDevelopment = process.env.NODE_ENV !== 'production'
  let optimize = opts.optimize ?? !inDevelopment

  return {
    postcssPlugin: '@tailwindcss/postcss',
    plugins: [
      // We need to handle the case where `postcss-import` might have run before
      // the Tailwind CSS plugin is run. In this case, we need to manually fix
      // relative paths before processing it in core.
      fixRelativePathsPlugin(),

      {
        postcssPlugin: 'tailwindcss',
        async OnceExit(root, { result }) {
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

            let compiler = await compile(root.toString(), {
              buildAst: inDevelopment,
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

          let ast = null as AstNode[] | null
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
          let output = context.compiler.build(candidates)
          if (typeof output === 'string') {
            css = output
          } else {
            ast = output
          }
          env.DEBUG && console.timeEnd('[@tailwindcss/postcss] Build CSS')

          // Replace CSS
          if (inDevelopment) {
            if (ast !== context.ast) {
              context.ast = ast
            }
          } else {
            if (css !== context.css && optimize) {
              env.DEBUG && console.time('[@tailwindcss/postcss] Optimize CSS')
              context.optimizedCss = optimizeCss(css, {
                minify: typeof optimize === 'object' ? optimize.minify : true,
              })
              env.DEBUG && console.timeEnd('[@tailwindcss/postcss] Optimize CSS')
            }
          }

          let postCssAst = null as PostCSSContainerNode | null
          if (inDevelopment && context.ast) {
            env.DEBUG && console.time('[@tailwindcss/postcss] Our AST -> PostCSS AST')
            postCssAst = transformIntoPostCssAst(context.ast)
            env.DEBUG && console.timeEnd('[@tailwindcss/postcss] Our AST -> PostCSS AST')
          } else {
            console.time('[@tailwindcss/postcss] string -> PostCSS AST')
            postCssAst = postcss.parse(optimize ? context.optimizedCss : context.css, result.opts)
            console.timeEnd('[@tailwindcss/postcss] string -> PostCSS AST')
          }

          env.DEBUG && console.time('[@tailwindcss/postcss] Update PostCSS AST')
          root.removeAll()
          root.append(postCssAst)
          env.DEBUG && console.timeEnd('[@tailwindcss/postcss] Update PostCSS AST')
          env.DEBUG && console.timeEnd('[@tailwindcss/postcss] Total time in @tailwindcss/postcss')
        },
      },
    ],
  }
}

function transformIntoPostCssAst(ast: AstNode[]): PostCSSContainerNode {
  let seenAtProperties = new Set<string>()
  let propertyFallbacksRoot = [] as PostCSSNode[]
  let propertyFallbacksUniversal = [] as PostCSSNode[]
  let newRoot = postcss.root()
  function transformNode(node: AstNode, parent: PostCSSContainerNode | null = null) {
    let postCssNode = null as PostCSSNode | null

    if (node.kind === 'comment') {
      postCssNode = postcss.comment({ text: node.value })
    } else if (node.kind === 'declaration') {
      if (node.property === '--tw-sort') return
      if (node.value === undefined) return
      if (node.value === null) return

      postCssNode = postcss.decl({
        prop: node.property,
        value: node.value ?? '',
        important: node.important,
      })
    } else if (node.kind === 'at-rule') {
      if (node.name === '@property') {
        if (seenAtProperties.has(node.params)) return

        // Collect fallbacks for `@property` rules for Firefox support
        // We turn these into rules on `:root` or `*` and some pseudo-elements
        // based on the value of `inherits``
        let property = node.params
        let initialValue = null
        let inherits = false

        for (let prop of node.nodes) {
          if (prop.kind !== 'declaration') continue
          if (prop.property === 'initial-value') {
            initialValue = prop.value
          } else if (prop.property === 'inherits') {
            inherits = prop.value === 'true'
          }
        }

        if (inherits) {
          propertyFallbacksRoot.push(
            postcss.decl({
              prop: property,
              value: initialValue ?? 'initial',
            }),
          )
        } else {
          propertyFallbacksUniversal.push(
            postcss.decl({
              prop: property,
              value: initialValue ?? 'initial',
            }),
          )
        }

        seenAtProperties.add(node.params)
      } else {
        postCssNode = postcss.atRule({ name: node.name.slice(1), params: node.params })
      }
    } else if (node.kind === 'rule') {
      postCssNode = postcss.rule({ selector: node.selector })
    } else if (node.kind === 'at-root') {
      let tmpRoot = postcss.root()
      for (let child of node.nodes) {
        transformNode(child, tmpRoot)
      }
      newRoot.append(tmpRoot)
      return
    } else if (node.kind === 'context') {
      for (let child of node.nodes) {
        transformNode(child, parent)
      }
      return
    }

    // Add the node to its parent's `nodes` array
    if (parent && parent.append && postCssNode !== null) {
      parent.append(postCssNode)
    }

    // Recursively transform children
    if ('nodes' in node) {
      for (let child of node.nodes) {
        transformNode(child, postCssNode as PostCSSContainerNode)
      }
    }
  }
  for (let node of ast) {
    transformNode(node, newRoot)
  }
  let fallbackAst = []
  if (propertyFallbacksRoot.length) {
    fallbackAst.push(
      postcss.rule({
        selector: ':root',
        nodes: propertyFallbacksRoot,
      }),
    )
  }
  if (propertyFallbacksUniversal.length) {
    fallbackAst.push(
      postcss.rule({
        selector: '*, ::before, ::after, ::backdrop',
        nodes: propertyFallbacksUniversal,
      }),
    )
  }
  if (fallbackAst.length) {
    newRoot.append(
      postcss.atRule({
        name: 'supports',
        params: '(-moz-orient: inline)',
        nodes: [
          postcss.atRule({
            name: 'layer',
            params: 'base',
            nodes: fallbackAst,
          }),
        ],
      }),
    )
  }

  return newRoot
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
