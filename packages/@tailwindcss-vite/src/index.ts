import { compile, env, normalizePath } from '@tailwindcss/node'
import { clearRequireCache } from '@tailwindcss/node/require-cache'
import { Scanner } from '@tailwindcss/oxide'
import { Features, transform } from 'lightningcss'
import path from 'path'
import type { Plugin, ResolvedConfig, Rollup, Update, ViteDevServer } from 'vite'

export default function tailwindcss(): Plugin[] {
  let servers: ViteDevServer[] = []
  let config: ResolvedConfig | null = null

  let isSSR = false
  let minify = false

  // A list of css plugins defined in the Vite config. We need to retain these
  // so that we can rerun the right transformations in build mode where we have
  // to manually rebuild the css file after the compilation is done.
  let cssPlugins: readonly Plugin[] = []

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

  let roots: DefaultMap<string, Root> = new DefaultMap(
    (id) => new Root(id, () => moduleGraphCandidates, config!.base),
  )

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
    for (let server of servers) {
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

        roots.get(id).requiresRebuild = false
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
  }

  async function regenerateOptimizedCss(root: Root, addWatchFile: (file: string) => void) {
    let content = root.lastContent
    let generated = await root.generate(content, addWatchFile)
    if (generated === false) {
      return
    }
    env.DEBUG && console.time('[@tailwindcss/vite] Optimize CSS')
    let result = optimizeCss(generated, { minify })
    env.DEBUG && console.timeEnd('[@tailwindcss/vite] Optimize CSS')
    return result
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

      configureServer(server) {
        servers.push(server)
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
        if (isPotentialCssRootFile(id)) return
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

        let root = roots.get(id)

        if (!options?.ssr) {
          // Wait until all other files have been processed, so we can extract
          // all candidates before generating CSS. This must not be called
          // during SSR or it will block the server.
          //
          // The reason why we can not rely on the invalidation here is that the
          // users would otherwise see a flicker in the styles as the CSS might
          // be loaded with an invalid set of candidates first.
          await Promise.all(servers.map((server) => server.waitForRequestsIdle(id)))
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

        let root = roots.get(id)

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
  let isCssFile =
    (extension === 'css' ||
      (extension === 'vue' && id.includes('&lang.css')) ||
      (extension === 'astro' && id.includes('&lang.css'))) &&
    // Don't intercept ?url and ?raw static asset handling
    !id.includes('?url') &&
    !id.includes('?raw')

  return isCssFile
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

/**
 * A Map that can generate default values for keys that don't exist.
 * Generated default values are added to the map to avoid recomputation.
 */
class DefaultMap<K, V> extends Map<K, V> {
  constructor(private factory: (key: K, self: DefaultMap<K, V>) => V) {
    super()
  }

  get(key: K): V {
    let value = super.get(key)

    if (value === undefined) {
      value = this.factory(key, this)
      this.set(key, value)
    }

    return value
  }
}

class Root {
  // Content is only used in serve mode where we need to capture the initial
  // contents of the root file so that we can restore it during the
  // `renderStart` hook.
  public lastContent: string = ''

  // The lazily-initialized Tailwind compiler components. These are persisted
  // throughout rebuilds but will be re-initialized if the rebuild strategy is
  // set to `full`.
  private compiler?: Awaited<ReturnType<typeof compile>>

  public requiresRebuild: boolean = true

  // This is the compiler-specific scanner instance that is used only to scan
  // files for custom @source paths. All other modules we scan for candidates
  // will use the shared moduleGraphScanner instance.
  private scanner?: Scanner

  // List of all candidates that were being returned by the root scanner during
  // the lifetime of the root.
  private candidates: Set<string> = new Set<string>()

  // List of all file dependencies that were captured while generating the root.
  // These are retained so we can clear the require cache when we rebuild the
  // root.
  private dependencies = new Set<string>()

  constructor(
    private id: string,
    private getSharedCandidates: () => Set<string>,
    private base: string,
  ) {}

  // Generate the CSS for the root file. This can return false if the file is
  // not considered a Tailwind root. When this happened, the root can be GCed.
  public async generate(
    content: string,
    addWatchFile: (file: string) => void,
  ): Promise<string | false> {
    this.lastContent = content

    let inputPath = idToPath(this.id)
    let inputBase = path.dirname(path.resolve(inputPath))

    if (!this.compiler || !this.scanner || this.requiresRebuild) {
      clearRequireCache(Array.from(this.dependencies))
      this.dependencies = new Set([idToPath(inputPath)])

      env.DEBUG && console.time('[@tailwindcss/vite] Setup compiler')
      this.compiler = await compile(content, {
        base: inputBase,
        onDependency: (path) => {
          addWatchFile(path)
          this.dependencies.add(path)
        },
      })
      env.DEBUG && console.timeEnd('[@tailwindcss/vite] Setup compiler')

      this.scanner = new Scanner({
        sources: this.compiler.globs,
      })
    }

    // This should not be here, but right now the Vite plugin is setup where we
    // setup a new scanner and compiler every time we request the CSS file
    // (regardless whether it actually changed or not).
    env.DEBUG && console.time('[@tailwindcss/vite] Scan for candidates')
    for (let candidate of this.scanner.scan()) {
      this.candidates.add(candidate)
    }
    env.DEBUG && console.timeEnd('[@tailwindcss/vite] Scan for candidates')

    // Watch individual files found via custom `@source` paths
    for (let file of this.scanner.files) {
      addWatchFile(file)
    }

    // Watch globs found via custom `@source` paths
    for (let glob of this.scanner.globs) {
      if (glob.pattern[0] === '!') continue

      let relative = path.relative(this.base, glob.base)
      if (relative[0] !== '.') {
        relative = './' + relative
      }
      // Ensure relative is a posix style path since we will merge it with the
      // glob.
      relative = normalizePath(relative)

      addWatchFile(path.posix.join(relative, glob.pattern))
    }

    this.requiresRebuild = true

    env.DEBUG && console.time('[@tailwindcss/vite] Build CSS')
    let result = this.compiler.build([...this.getSharedCandidates(), ...this.candidates])
    env.DEBUG && console.timeEnd('[@tailwindcss/vite] Build CSS')

    return result
  }
}
