import { getModuleDependencies } from '@tailwindcss/node'
import { clearRequireCache } from '@tailwindcss/node/require-cache'

import { Scanner } from '@tailwindcss/oxide'
import fixRelativePathsPlugin, { normalizePath } from 'internal-postcss-fix-relative-paths'
import { Features, transform } from 'lightningcss'
import fs from 'node:fs/promises'
import { pathToFileURL } from 'node:url'
import path from 'path'
import postcss from 'postcss'
import postcssImport from 'postcss-import'
import { compile } from 'tailwindcss'
import type { Plugin, ResolvedConfig, Rollup, Update, ViteDevServer } from 'vite'

export default function tailwindcss(): Plugin[] {
  let server: ViteDevServer | null = null
  let config: ResolvedConfig | null = null

  let isSSR = false
  let minify = false

  // A list of css plugins defined in the Vite config. We need to retain these
  // so that we can rerun the right transformations in build mode where we have
  // to manually rebuild the css file after the compilation is done.
  let cssPlugins: readonly Plugin[] = []

  let roots: Map<string, Root> = new Map()

  // The Vite extension has two types of sources for candidates:
  //
  // 1. The module graph: These are all modules that vite transforms and we want
  //    them to be automatically scanned for candidates.
  // 2. Root defined `@source`s
  //
  // Module graph candidates are global to the Vite extension since we do not
  // know which CSS roots will be used for the modules. We are using a custom
  // scanner instance with auto source discovery disabled to parse these.
  //
  // For candidates coming from custom `@source` directives of the CSS roots, we
  // create an individual scanner for each root.
  //
  // Note: To improve performance, we do not remove candidates from this set.
  // This means a longer-ongoing dev mode session might contain candidates that
  // are no longer referenced in code.
  let moduleGraphCandidates = new Set<string>()
  let moduleGraphScanner = new Scanner({})

  class Root {
    // Content is only used in serve mode where we need to capture the initial
    // contents of the root file so that we can restore it during the
    // `renderStart` hook.
    public lastContent: string = ''

    // The lazily-initialized Tailwind compiler components. These are persisted
    // throughout rebuilds but will be re-initialized if the rebuild strategy is
    // set to `full`.
    private compiler?: Awaited<ReturnType<typeof compile>>

    private rebuildStrategy: 'full' | 'incremental' = 'full'

    // This is the compiler-specific scanner instance that is used only to scan
    // files for custom @source paths. All other modules we scan for candidates
    // will use the shared moduleGraphScanner instance.
    private scanner?: Scanner

    // List of all candidates that were being returned by the root scanner
    // during the lifetime of the root.
    private candidates: Set<string> = new Set<string>()

    // List of all file dependencies that were captured while generating the
    // root. These are retained so we can clear the require cache when we
    // rebuild the root.
    private dependencies = new Set<string>()

    constructor(private id: string) {}

    // Generate the CSS for the root file. This can return false if the file is
    // not considered a Tailwind root. When this happened, the root can be GCed.
    public async generate(
      content: string,
      addWatchFile: (file: string) => void,
    ): Promise<string | false> {
      await import('@tailwindcss/node/esm-cache-hook')

      this.lastContent = content

      let inputPath = idToPath(this.id)
      let inputBase = path.dirname(path.resolve(inputPath))

      if (this.compiler === null || this.scanner === null || this.rebuildStrategy === 'full') {
        this.rebuildStrategy = 'incremental'
        clearRequireCache(Array.from(this.dependencies))
        this.dependencies = new Set([idToPath(inputPath)])

        let postcssCompiled = await postcss([
          postcssImport({
            load: (path) => {
              this.dependencies.add(path)
              addWatchFile(path)
              return fs.readFile(path, 'utf8')
            },
          }),
          fixRelativePathsPlugin(),
        ]).process(content, {
          from: inputPath,
          to: inputPath,
        })
        let css = postcssCompiled.css

        // This is done inside the Root#generate() method so that we can later
        // use information from the Tailwind compiler to determine if the file
        // is a CSS root (necessary because we will probably inline the
        // `@import` resolution at some point).
        if (!isCssRootFile(css)) {
          return false
        }

        this.compiler = await compile(css, {
          loadPlugin: async (pluginPath) => {
            if (pluginPath[0] !== '.') {
              return import(pluginPath).then((m) => m.default ?? m)
            }

            let resolvedPath = path.resolve(inputBase, pluginPath)
            let [module, moduleDependencies] = await Promise.all([
              import(pathToFileURL(resolvedPath).href + '?id=' + Date.now()),
              getModuleDependencies(resolvedPath),
            ])
            addWatchFile(resolvedPath)
            this.dependencies.add(resolvedPath)
            for (let file of moduleDependencies) {
              addWatchFile(file)
              this.dependencies.add(file)
            }
            return module.default ?? module
          },

          loadConfig: async (configPath) => {
            if (configPath[0] !== '.') {
              return import(configPath).then((m) => m.default ?? m)
            }

            let resolvedPath = path.resolve(inputBase, configPath)
            let [module, moduleDependencies] = await Promise.all([
              import(pathToFileURL(resolvedPath).href + '?id=' + Date.now()),
              getModuleDependencies(resolvedPath),
            ])

            addWatchFile(resolvedPath)
            this.dependencies.add(resolvedPath)
            for (let file of moduleDependencies) {
              addWatchFile(file)
              this.dependencies.add(file)
            }
            return module.default ?? module
          },
        })
        this.scanner = new Scanner({
          sources: this.compiler.globs.map((pattern) => ({
            base: inputBase, // Globs are relative to the input.css file
            pattern,
          })),
        })
      }

      if (!this.scanner || !this.compiler) {
        // TypeScript does not properly refine the scanner and compiler
        // properties (even when extracted into a variable)
        throw new Error('Tailwind CSS compiler is not initialized.')
      }

      // This should not be here, but right now the Vite plugin is setup where
      // we setup a new scanner and compiler every time we request the CSS file
      // (regardless whether it actually changed or not).
      for (let candidate of this.scanner.scan()) {
        this.candidates.add(candidate)
      }

      // Watch individual files found via custom `@source` paths
      for (let file of this.scanner.files) {
        addWatchFile(file)
      }

      // Watch globs found via custom `@source` paths
      for (let glob of this.scanner.globs) {
        if (glob.pattern[0] === '!') continue

        let relative = path.relative(config!.base, glob.base)
        if (relative[0] !== '.') {
          relative = './' + relative
        }
        // Ensure relative is a posix style path since we will merge it with the
        // glob.
        relative = normalizePath(relative)

        addWatchFile(path.posix.join(relative, glob.pattern))
      }

      return this.compiler.build([...moduleGraphCandidates, ...this.candidates])
    }

    public invalidate() {
      this.rebuildStrategy = 'full'
    }
  }

  function scanFile(id: string, content: string, extension: string, isSSR: boolean) {
    let updated = false
    for (let candidate of moduleGraphScanner.scanFiles([{ content, extension }])) {
      updated = true
      moduleGraphCandidates.add(candidate)
    }

    if (updated) {
      invalidateAllRoots(isSSR)
    }
  }

  function invalidateAllRoots(isSSR: boolean) {
    // If we're building then we don't need to update anything
    if (!server) return

    let updates: Update[] = []
    for (let id of roots.keys()) {
      let module = server.moduleGraph.getModuleById(id)
      if (!module) {
        // Note: Removing this during SSR is not safe and will produce
        // inconsistent results based on the timing of the removal and
        // the order / timing of transforms.
        if (!isSSR) {
          // It is safe to remove the item here since we're iterating on a copy
          // of the keys.
          roots.delete(id)
        }
        continue
      }

      server.moduleGraph.invalidateModule(module)
      updates.push({
        type: `${module.type}-update`,
        path: module.url,
        acceptedPath: module.url,
        timestamp: Date.now(),
      })
    }

    if (updates.length > 0) {
      server.hot.send({ type: 'update', updates })
    }
  }

  async function regenerateOptimizedCss(root: Root, addWatchFile: (file: string) => void) {
    let content = root.lastContent
    let generated = await root.generate(content, addWatchFile)
    if (generated === false) {
      return
    }
    return optimizeCss(generated, { minify })
  }

  // Manually run the transform functions of non-Tailwind plugins on the given CSS
  async function transformWithPlugins(context: Rollup.PluginContext, id: string, css: string) {
    let transformPluginContext = {
      ...context,
      getCombinedSourcemap: () => {
        throw new Error('getCombinedSourcemap not implemented')
      },
    }

    for (let plugin of cssPlugins) {
      if (!plugin.transform) continue
      let transformHandler =
        'handler' in plugin.transform! ? plugin.transform.handler : plugin.transform!

      try {
        // Directly call the plugin's transform function to process the
        // generated CSS. In build mode, this updates the chunks later used to
        // generate the bundle. In serve mode, the transformed source should be
        // applied in transform.
        let result = await transformHandler.call(transformPluginContext, css, id)
        if (!result) continue
        if (typeof result === 'string') {
          css = result
        } else if (result.code) {
          css = result.code
        }
      } catch (e) {
        console.error(`Error running ${plugin.name} on Tailwind CSS output. Skipping.`)
      }
    }
    return css
  }

  return [
    {
      // Step 1: Scan source files for candidates
      name: '@tailwindcss/vite:scan',
      enforce: 'pre',

      configureServer(_server) {
        server = _server
      },

      async configResolved(_config) {
        config = _config
        minify = config.build.cssMinify !== false
        isSSR = config.build.ssr !== false && config.build.ssr !== undefined

        let allowedPlugins = [
          // Apply the vite:css plugin to generated CSS for transformations like
          // URL path rewriting and image inlining.
          'vite:css',

          // In build mode, since renderChunk runs after all transformations, we
          // need to also apply vite:css-post.
          ...(config.command === 'build' ? ['vite:css-post'] : []),
        ]

        cssPlugins = config.plugins.filter((plugin) => {
          return allowedPlugins.includes(plugin.name)
        })
      },

      // Scan all non-CSS files for candidates
      transformIndexHtml(html, { path }) {
        scanFile(path, html, 'html', isSSR)
      },
      transform(src, id, options) {
        let extension = getExtension(id)
        if (extension === '' || extension === 'css') return
        scanFile(id, src, extension, options?.ssr ?? false)
      },
    },

    {
      // Step 2 (serve mode): Generate CSS
      name: '@tailwindcss/vite:generate:serve',
      apply: 'serve',
      enforce: 'pre',

      async transform(src, id, options) {
        if (!isPotentialCssRootFile(id)) return

        // TODO: Use DefaultMap
        let root = roots.get(id)
        if (!root) {
          root = new Root(id)
          roots.set(id, root)
        }
        root.invalidate()

        if (!options?.ssr) {
          // Wait until all other files have been processed, so we can extract
          // all candidates before generating CSS. This must not be called
          // during SSR or it will block the server.
          //
          // The reason why we can not rely on the invalidation here is that the
          // users would otherwise see a flicker in the styles as the CSS might
          // be loaded with an invalid set of candidates first.
          await server?.waitForRequestsIdle?.(id)
        }

        let generated = await root.generate(src, (file) => this.addWatchFile(file))
        if (!generated) {
          roots.delete(id)
          return src
        }
        return { code: generated }
      },
    },

    {
      // Step 2 (full build): Generate CSS
      name: '@tailwindcss/vite:generate:build',
      apply: 'build',
      enforce: 'pre',

      async transform(src, id) {
        if (!isPotentialCssRootFile(id)) return

        // TODO: Use DefaultMap
        let root = roots.get(id)
        if (!root) {
          root = new Root(id)
          roots.set(id, root)
        }
        root.invalidate()

        // We do a first pass to generate valid CSS for the downstream plugins.
        // However, since not all candidates are guaranteed to be extracted by
        // this time, we have to re-run a transform for the root later.
        let generated = await root.generate(src, (file) => this.addWatchFile(file))
        if (!generated) {
          roots.delete(id)
          return src
        }
        return { code: generated }
      },

      // `renderStart` runs in the bundle generation stage after all transforms.
      // We must run before `enforce: post` so the updated chunks are picked up
      // by vite:css-post.
      async renderStart() {
        for (let [id, root] of roots.entries()) {
          let generated = await regenerateOptimizedCss(
            root,
            // During the renderStart phase, we can not add watch files since
            // those would not be causing a refresh of the right CSS file. This
            // should not be an issue since we did already process the CSS file
            // before and the dependencies should not be changed (only the
            // candidate list might have)
            () => {},
          )
          if (!generated) {
            roots.delete(id)
            continue
          }

          // These plugins have side effects which, during build, results in CSS
          // being written to the output dir. We need to run them here to ensure
          // the CSS is written before the bundle is generated.
          await transformWithPlugins(this, id, generated)
        }
      },
    },
  ] satisfies Plugin[]
}

function getExtension(id: string) {
  let [filename] = id.split('?', 2)
  return path.extname(filename).slice(1)
}

function isPotentialCssRootFile(id: string) {
  let extension = getExtension(id)
  let isCssFile = extension === 'css' || (extension === 'vue' && id.includes('&lang.css'))
  return isCssFile
}

function isCssRootFile(content: string) {
  return (
    content.includes('@tailwind') ||
    content.includes('@config') ||
    content.includes('@plugin') ||
    content.includes('@apply') ||
    content.includes('@theme') ||
    content.includes('@variant') ||
    content.includes('@utility')
  )
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

function idToPath(id: string) {
  return path.resolve(id.replace(/\?.*$/, ''))
}
