import { compile, env, Features, Instrumentation, normalizePath } from '@tailwindcss/node'
import { clearRequireCache } from '@tailwindcss/node/require-cache'
import { Scanner } from '@tailwindcss/oxide'
import { Features as LightningCssFeatures, transform } from 'lightningcss'
import fs from 'node:fs/promises'
import path from 'node:path'
import type { Plugin, ResolvedConfig, Rollup, Update, ViteDevServer } from 'vite'

const DEBUG = env.DEBUG
const SPECIAL_QUERY_RE = /[?&](raw|url)\b/

export default function tailwindcss(): Plugin[] {
  let servers: ViteDevServer[] = []
  let config: ResolvedConfig | null = null

  let isSSR = false
  let minify = false

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
  let moduleGraphCandidates = new DefaultMap<string, Set<string>>(() => new Set<string>())
  let moduleGraphScanner = new Scanner({})

  let roots: DefaultMap<string, Root> = new DefaultMap((id) => {
    let cssResolver = config!.createResolver({
      ...config!.resolve,
      extensions: ['.css'],
      mainFields: ['style'],
      conditions: ['style', 'development|production'],
      tryIndex: false,
      preferRelative: true,
    })
    function customCssResolver(id: string, base: string) {
      return cssResolver(id, base, true, isSSR)
    }

    let jsResolver = config!.createResolver(config!.resolve)
    function customJsResolver(id: string, base: string) {
      return jsResolver(id, base, true, isSSR)
    }
    return new Root(
      id,
      () => moduleGraphCandidates,
      config!.base,
      customCssResolver,
      customJsResolver,
    )
  })

  function scanFile(id: string, content: string, extension: string, isSSR: boolean) {
    let updated = false
    for (let candidate of moduleGraphScanner.scanFiles([{ content, extension }])) {
      updated = true
      moduleGraphCandidates.get(id).add(candidate)
    }

    if (updated) {
      invalidateAllRoots(isSSR)
    }
  }

  function invalidateAllRoots(isSSR: boolean) {
    for (let server of servers) {
      let updates: Update[] = []
      for (let [id, root] of roots.entries()) {
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

  async function regenerateOptimizedCss(
    root: Root,
    addWatchFile: (file: string) => void,
    I: Instrumentation,
  ) {
    let content = root.lastContent
    let generated = await root.generate(content, addWatchFile, I)
    if (generated === false) {
      return
    }
    DEBUG && I.start('Optimize CSS')
    let result = optimizeCss(generated, { minify })
    DEBUG && I.end('Optimize CSS')
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

    for (let plugin of config!.plugins) {
      if (!plugin.transform) continue

      if (plugin.name.startsWith('@tailwindcss/')) {
        // We do not run any Tailwind transforms anymore
        continue
      } else if (
        plugin.name.startsWith('vite:') &&
        // Apply the vite:css plugin to generated CSS for transformations like
        // URL path rewriting and image inlining.
        plugin.name !== 'vite:css' &&
        // In build mode, since `renderStart` runs after all transformations, we
        // need to also apply vite:css-post.
        plugin.name !== 'vite:css-post' &&
        // The vite:vue plugin handles CSS specific post-processing for Vue
        plugin.name !== 'vite:vue'
      ) {
        continue
      } else if (plugin.name === 'ssr-styles') {
        // The Nuxt ssr-styles plugin emits styles from server-side rendered
        // components, we can't run it in the `renderStart` phase so we're
        // skipping it.
        continue
      }

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

        using I = new Instrumentation()
        I.start('[@tailwindcss/vite] Generate CSS (serve)')

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

        let generated = await root.generate(src, (file) => this.addWatchFile(file), I)
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

        using I = new Instrumentation()
        I.start('[@tailwindcss/vite] Generate CSS (build)')

        let root = roots.get(id)

        // We do a first pass to generate valid CSS for the downstream plugins.
        // However, since not all candidates are guaranteed to be extracted by
        // this time, we have to re-run a transform for the root later.
        let generated = await root.generate(src, (file) => this.addWatchFile(file), I)
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
        using I = new Instrumentation()
        I.start('[@tailwindcss/vite] (render start)')

        for (let [id, root] of roots.entries()) {
          let generated = await regenerateOptimizedCss(
            root,
            // During the renderStart phase, we can not add watch files since
            // those would not be causing a refresh of the right CSS file. This
            // should not be an issue since we did already process the CSS file
            // before and the dependencies should not be changed (only the
            // candidate list might have)
            () => {},
            I,
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
  if (id.includes('/.vite/')) return
  let extension = getExtension(id)
  let isCssFile =
    (extension === 'css' ||
      (extension === 'vue' && id.includes('&lang.css')) ||
      (extension === 'astro' && id.includes('&lang.css')) ||
      (extension === 'svelte' && id.includes('&lang.css')))
    // Don't intercept special static asset resources
    !SPECIAL_QUERY_RE.test(id)

  return isCssFile
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
      exclude: LightningCssFeatures.LogicalProperties | LightningCssFeatures.DirSelector,
      targets: {
        safari: (16 << 16) | (4 << 8),
        ios_saf: (16 << 16) | (4 << 8),
        firefox: 128 << 16,
        chrome: 111 << 16,
      },
      errorRecovery: true,
    }).code
  }

  // Running Lightning CSS twice to ensure that adjacent rules are merged after
  // nesting is applied. This creates a more optimized output.
  return optimize(optimize(Buffer.from(input))).toString()
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

  // List of all dependencies captured while generating the root. These are
  // retained so we can clear the require cache when we rebuild the root.
  private dependencies = new Set<string>()

  // The resolved path given to `source(…)`. When not given this is `null`.
  private basePath: string | null = null

  public overwriteCandidates: string[] | null = null

  constructor(
    private id: string,
    private getSharedCandidates: () => Map<string, Set<string>>,
    private base: string,

    private customCssResolver: (id: string, base: string) => Promise<string | false | undefined>,
    private customJsResolver: (id: string, base: string) => Promise<string | false | undefined>,
  ) {}

  // Generate the CSS for the root file. This can return false if the file is
  // not considered a Tailwind root. When this happened, the root can be GCed.
  public async generate(
    content: string,
    addWatchFile: (file: string) => void,
    I: Instrumentation,
  ): Promise<string | false> {
    this.lastContent = content

    let inputPath = idToPath(this.id)
    let inputBase = path.dirname(path.resolve(inputPath))

    if (!this.compiler || !this.scanner || this.requiresRebuild) {
      clearRequireCache(Array.from(this.dependencies))
      this.dependencies = new Set([idToPath(inputPath)])

      DEBUG && I.start('Setup compiler')
      this.compiler = await compile(content, {
        base: inputBase,
        shouldRewriteUrls: true,
        onDependency: (path) => {
          addWatchFile(path)
          this.dependencies.add(path)
        },

        customCssResolver: this.customCssResolver,
        customJsResolver: this.customJsResolver,
      })
      DEBUG && I.end('Setup compiler')

      let sources = (() => {
        // Disable auto source detection
        if (this.compiler.root === 'none') {
          return []
        }

        // No root specified, use the module graph
        if (this.compiler.root === null) {
          return []
        }

        // Use the specified root
        return [this.compiler.root]
      })().concat(this.compiler.globs)

      this.scanner = new Scanner({ sources })
    }

    if (
      !(
        this.compiler.features &
        (Features.AtApply | Features.JsPluginCompat | Features.ThemeFunction | Features.Utilities)
      )
    ) {
      return false
    }

    if (!this.overwriteCandidates || this.compiler.features & Features.Utilities) {
      // This should not be here, but right now the Vite plugin is setup where we
      // setup a new scanner and compiler every time we request the CSS file
      // (regardless whether it actually changed or not).
      DEBUG && I.start('Scan for candidates')
      for (let candidate of this.scanner.scan()) {
        this.candidates.add(candidate)
      }
      DEBUG && I.end('Scan for candidates')
    }

    if (this.compiler.features & Features.Utilities) {
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

        let root = this.compiler.root

        if (root !== 'none' && root !== null) {
          let basePath = normalizePath(path.resolve(root.base, root.pattern))

          let isDir = await fs.stat(basePath).then(
            (stats) => stats.isDirectory(),
            () => false,
          )

          if (!isDir) {
            throw new Error(
              `The path given to \`source(…)\` must be a directory but got \`source(${basePath})\` instead.`,
            )
          }

          this.basePath = basePath
        } else if (root === null) {
          this.basePath = null
        }
      }
    }

    this.requiresRebuild = true

    DEBUG && I.start('Build CSS')
    let result = this.compiler.build(
      this.overwriteCandidates
        ? this.overwriteCandidates
        : [...this.sharedCandidates(), ...this.candidates],
    )
    DEBUG && I.end('Build CSS')

    return result
  }

  private sharedCandidates(): Set<string> {
    if (!this.compiler) return new Set()
    if (this.compiler.root === 'none') return new Set()

    const HAS_DRIVE_LETTER = /^[A-Z]:/

    let shouldIncludeCandidatesFrom = (id: string) => {
      if (this.basePath === null) return true

      if (id.startsWith(this.basePath)) return true

      // This is a windows absolute path that doesn't match so return false
      if (HAS_DRIVE_LETTER.test(id)) return false

      // We've got a path that's not absolute and not on Windows
      // TODO: this is probably a virtual module -- not sure if we need to scan it
      if (!id.startsWith('/')) return true

      // This is an absolute path on POSIX and it does not match
      return false
    }

    let shared = new Set<string>()

    for (let [id, candidates] of this.getSharedCandidates()) {
      if (!shouldIncludeCandidatesFrom(id)) continue

      for (let candidate of candidates) {
        shared.add(candidate)
      }
    }

    return shared
  }
}
