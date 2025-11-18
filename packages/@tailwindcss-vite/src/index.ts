import {
  compile,
  env,
  Features,
  Instrumentation,
  normalizePath,
  optimize,
  toSourceMap,
} from '@tailwindcss/node'
import { clearRequireCache } from '@tailwindcss/node/require-cache'
import { Scanner } from '@tailwindcss/oxide'
import fs from 'node:fs/promises'
import path from 'node:path'
import type { Environment, Plugin, ResolvedConfig, ViteDevServer } from 'vite'
import * as vite from 'vite'

const DEBUG = env.DEBUG
const SPECIAL_QUERY_RE = /[?&](?:worker|sharedworker|raw|url)\b/
const COMMON_JS_PROXY_RE = /\?commonjs-proxy/
const INLINE_STYLE_ID_RE = /[?&]index\=\d+\.css$/

export type PluginOptions = {
  /**
   * Optimize and minify the output CSS.
   */
  optimize?: boolean | { minify?: boolean }
}

export default function tailwindcss(opts: PluginOptions = {}): Plugin[] {
  let servers: ViteDevServer[] = []
  let config: ResolvedConfig | null = null
  let rootsByEnv = new DefaultMap<string, Map<string, Root>>((env: string) => new Map())

  let isSSR = false
  let shouldOptimize = true
  let minify = true

  function createRoot(env: Environment | null, id: string) {
    type ResolveFn = (id: string, base: string) => Promise<string | false | undefined>

    let customCssResolver: ResolveFn
    let customJsResolver: ResolveFn

    if (!env) {
      // Older, pre-environment Vite API
      // TODO: Can we drop this??
      let cssResolver = config!.createResolver({
        ...config!.resolve,
        extensions: ['.css'],
        mainFields: ['style'],
        conditions: ['style', 'development|production'],
        tryIndex: false,
        preferRelative: true,
      })

      let jsResolver = config!.createResolver(config!.resolve)

      customCssResolver = (id: string, base: string) => cssResolver(id, base, true, isSSR)
      customJsResolver = (id: string, base: string) => jsResolver(id, base, true, isSSR)
    } else {
      // Newer Vite versions
      let cssResolver = vite.createIdResolver(env.config, {
        ...env.config.resolve,
        extensions: ['.css'],
        mainFields: ['style'],
        conditions: ['style', 'development|production'],
        tryIndex: false,
        preferRelative: true,
      })

      let jsResolver = vite.createIdResolver(env.config, env.config.resolve)

      customCssResolver = (id: string, base: string) => cssResolver(env, id, base, true)
      customJsResolver = (id: string, base: string) => jsResolver(env, id, base, true)
    }

    return new Root(
      id,
      config!.root,
      // Currently, Vite only supports CSS source maps in development and they
      // are off by default. Check to see if we need them or not.
      config?.css.devSourcemap ?? false,
      customCssResolver,
      customJsResolver,
    )
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
        isSSR = config.build.ssr !== false && config.build.ssr !== undefined

        // By default we optimize CSS during the build phase but if the user
        // provides explicit options we'll use those instead
        if (opts.optimize !== undefined) {
          shouldOptimize = opts.optimize !== false
        }

        // Minification is also performed when optimizing as long as it's also
        // enabled in Vite
        minify = shouldOptimize && config.build.cssMinify !== false

        // But again, the user can override that choice explicitly
        if (typeof opts.optimize === 'object') {
          minify = opts.optimize.minify !== false
        }
      },
    },

    {
      // Step 2 (serve mode): Generate CSS
      name: '@tailwindcss/vite:generate:serve',
      apply: 'serve',
      enforce: 'pre',
      transform: {
        filter: {
          id: {
            exclude: [/\/\.vite\//, SPECIAL_QUERY_RE, COMMON_JS_PROXY_RE],
            include: [/\.css(?:\?.*)?$/, /&lang\.css/, INLINE_STYLE_ID_RE],
          },
        },
        async handler(src, id) {
          if (!isPotentialCssRootFile(id)) return

          using I = new Instrumentation()
          DEBUG && I.start('[@tailwindcss/vite] Generate CSS (serve)')

          let roots = rootsByEnv.get(this.environment?.name ?? 'default')
          let root = roots.get(id)
          if (!root) {
            root ??= createRoot(this.environment ?? null, id)
            roots.set(id, root)
          }

          let result = await root.generate(src, (file) => this.addWatchFile(file), I)
          if (!result) {
            roots.delete(id)
            return src
          }

          DEBUG && I.end('[@tailwindcss/vite] Generate CSS (serve)')
          return result
        },
      },
    },

    {
      // Step 2 (full build): Generate CSS
      name: '@tailwindcss/vite:generate:build',
      apply: 'build',
      enforce: 'pre',
      transform: {
        filter: {
          id: {
            exclude: [/\/\.vite\//, SPECIAL_QUERY_RE, COMMON_JS_PROXY_RE],
            include: [/\.css(?:\?.*)?$/, /&lang\.css/, INLINE_STYLE_ID_RE],
          },
        },
        async handler(src, id) {
          if (!isPotentialCssRootFile(id)) return

          using I = new Instrumentation()
          DEBUG && I.start('[@tailwindcss/vite] Generate CSS (build)')

          let roots = rootsByEnv.get(this.environment?.name ?? 'default')
          let root = roots.get(id)
          if (!root) {
            root ??= createRoot(this.environment ?? null, id)
            roots.set(id, root)
          }

          let result = await root.generate(src, (file) => this.addWatchFile(file), I)
          if (!result) {
            roots.delete(id)
            return src
          }
          DEBUG && I.end('[@tailwindcss/vite] Generate CSS (build)')

          if (shouldOptimize) {
            DEBUG && I.start('[@tailwindcss/vite] Optimize CSS')
            result = optimize(result.code, {
              minify,
              map: result.map,
            })
            DEBUG && I.end('[@tailwindcss/vite] Optimize CSS')
          }

          return result
        },
      },
    },
  ] satisfies Plugin[]
}

function getExtension(id: string) {
  let [filename] = id.split('?', 2)
  return path.extname(filename).slice(1)
}

function isPotentialCssRootFile(id: string) {
  if (id.includes('/.vite/')) return false

  // Don't intercept special static asset resources
  if (SPECIAL_QUERY_RE.test(id)) return false
  if (COMMON_JS_PROXY_RE.test(id)) return false

  let extension = getExtension(id)
  let isCssFile = extension === 'css' || id.includes('&lang.css') || id.match(INLINE_STYLE_ID_RE)

  return isCssFile
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
  // The lazily-initialized Tailwind compiler components. These are persisted
  // throughout rebuilds but will be re-initialized if the rebuild strategy is
  // set to `full`.
  private compiler?: Awaited<ReturnType<typeof compile>>

  // The lazily-initialized Tailwind scanner.
  private scanner?: Scanner

  // List of all candidates that were being returned by the root scanner during
  // the lifetime of the root.
  private candidates: Set<string> = new Set<string>()

  // List of all build dependencies (e.g. imported  stylesheets or plugins) and
  // their last modification timestamp. If no mtime can be found, we need to
  // assume the file has always changed.
  private buildDependencies = new Map<string, number | null>()

  constructor(
    private id: string,
    private base: string,

    private enableSourceMaps: boolean,
    private customCssResolver: (id: string, base: string) => Promise<string | false | undefined>,
    private customJsResolver: (id: string, base: string) => Promise<string | false | undefined>,
  ) {}

  // Generate the CSS for the root file. This can return false if the file is
  // not considered a Tailwind root. When this happened, the root can be GCed.
  public async generate(
    content: string,
    _addWatchFile: (file: string) => void,
    I: Instrumentation,
  ): Promise<
    | {
        code: string
        map: string | undefined
      }
    | false
  > {
    let inputPath = idToPath(this.id)

    function addWatchFile(file: string) {
      // Don't watch the input file since it's already a dependency anc causes
      // issues with some setups (e.g. Qwik).
      if (file === inputPath) {
        return
      }

      // Scanning `.svg` file containing a `#` or `?` in the path will
      // crash Vite. We work around this for now by ignoring updates to them.
      //
      // https://github.com/tailwindlabs/tailwindcss/issues/16877
      if (/[\#\?].*\.svg$/.test(file)) {
        return
      }
      _addWatchFile(file)
    }

    let requiresBuildPromise = this.requiresBuild()
    let inputBase = path.dirname(path.resolve(inputPath))

    if (!this.compiler || !this.scanner || (await requiresBuildPromise)) {
      clearRequireCache(Array.from(this.buildDependencies.keys()))
      this.buildDependencies.clear()

      this.addBuildDependency(idToPath(inputPath))

      DEBUG && I.start('Setup compiler')
      let addBuildDependenciesPromises: Promise<void>[] = []
      this.compiler = await compile(content, {
        from: this.enableSourceMaps ? this.id : undefined,
        base: inputBase,
        shouldRewriteUrls: true,
        onDependency: (path) => {
          addWatchFile(path)
          addBuildDependenciesPromises.push(this.addBuildDependency(path))
        },

        customCssResolver: this.customCssResolver,
        customJsResolver: this.customJsResolver,
      })
      await Promise.all(addBuildDependenciesPromises)
      DEBUG && I.end('Setup compiler')

      DEBUG && I.start('Setup scanner')

      let sources = (() => {
        // Disable auto source detection
        if (this.compiler.root === 'none') {
          return []
        }

        // No root specified, auto-detect based on the `**/*` pattern
        if (this.compiler.root === null) {
          return [{ base: this.base, pattern: '**/*', negated: false }]
        }

        // Use the specified root
        return [{ ...this.compiler.root, negated: false }]
      })().concat(this.compiler.sources)

      this.scanner = new Scanner({ sources })
      DEBUG && I.end('Setup scanner')
    } else {
      for (let buildDependency of this.buildDependencies.keys()) {
        addWatchFile(buildDependency)
      }
    }

    if (
      !(
        this.compiler.features &
        (Features.AtApply | Features.JsPluginCompat | Features.ThemeFunction | Features.Utilities)
      )
    ) {
      return false
    }

    if (this.compiler.features & Features.Utilities) {
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
        }
      }
    }

    DEBUG && I.start('Build CSS')
    let code = this.compiler.build([...this.candidates])
    DEBUG && I.end('Build CSS')

    DEBUG && I.start('Build Source Map')
    let map = this.enableSourceMaps ? toSourceMap(this.compiler.buildSourceMap()).raw : undefined
    DEBUG && I.end('Build Source Map')

    return {
      code,
      map,
    }
  }

  private async addBuildDependency(path: string) {
    let mtime: number | null = null
    try {
      mtime = (await fs.stat(path)).mtimeMs
    } catch {}
    this.buildDependencies.set(path, mtime)
  }

  private async requiresBuild(): Promise<boolean> {
    for (let [path, mtime] of this.buildDependencies) {
      if (mtime === null) return true
      try {
        let stat = await fs.stat(path)
        if (stat.mtimeMs > mtime) {
          return true
        }
      } catch {
        return true
      }
    }
    return false
  }
}
