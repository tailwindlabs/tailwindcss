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
  let scanner: Scanner | null = null
  let changedContent: { content: string; extension: string }[] = []
  let candidates = new Set<string>()
  let fullRebuildPaths = new Set<string>()
  let rebuildStrategy: 'full' | 'incremental' = 'full'
  let compiler: null | Awaited<ReturnType<typeof compile>> = null

  // In serve mode this is treated as a set — the content doesn't matter.
  // In build mode, we store file contents to use them in renderChunk.
  let cssModules: Record<string, { content: string; handled: boolean }> = {}
  let isSSR = false
  let minify = false
  let cssPlugins: readonly Plugin[] = []

  // Trigger update to all CSS modules
  function queueRebuild(isSSR: boolean) {
    // If we're building then we don't need to update anything
    if (!server) return

    let updates: Update[] = []
    for (let id of Object.keys(cssModules)) {
      let cssModule = server.moduleGraph.getModuleById(id)
      if (!cssModule) {
        // Note: Removing this during SSR is not safe and will produce
        // inconsistent results based on the timing of the removal and
        // the order / timing of transforms.
        if (!isSSR) {
          // It is safe to remove the item here since we're iterating on a copy
          // of the keys.
          delete cssModules[id]
        }
        continue
      }

      server.moduleGraph.invalidateModule(cssModule)
      updates.push({
        type: `${cssModule.type}-update`,
        path: cssModule.url,
        acceptedPath: cssModule.url,
        timestamp: Date.now(),
      })
    }

    if (updates.length > 0) {
      server.hot.send({ type: 'update', updates })
    }
  }

  function scan(src: string, extension: string) {
    let updated = false

    if (scanner === null) {
      changedContent.push({ content: src, extension })
      return updated
    }

    // Parse all candidates given the resolved files
    for (let candidate of scanner.scanFiles([{ content: src, extension }])) {
      updated = true
      candidates.add(candidate)
    }

    return updated
  }

  function onFileChange(src: string) {
    if (fullRebuildPaths.has(idToPath(src))) {
      rebuildStrategy = 'full'
      return
    }
  }

  async function generateCss(css: string, inputPath: string, addWatchFile: (file: string) => void) {
    await import('@tailwindcss/node/esm-cache-hook')

    let inputBasePath = path.dirname(path.resolve(inputPath))

    if (compiler === null || rebuildStrategy === 'full') {
      rebuildStrategy = 'incremental'
      clearRequireCache(Array.from(fullRebuildPaths))
      fullRebuildPaths.clear()
      fullRebuildPaths.add(idToPath(inputPath))

      // Resolve `@import`s
      let postcssCompiled = await postcss([
        postcssImport({
          load(path) {
            fullRebuildPaths.add(path)
            addWatchFile(path)
            return fs.readFile(path, 'utf8')
          },
        }),
        fixRelativePathsPlugin(),
      ]).process(css, {
        from: inputPath,
        to: inputPath,
      })
      css = postcssCompiled.css

      compiler = await compile(css, {
        loadPlugin: async (pluginPath) => {
          if (pluginPath[0] !== '.') {
            return import(pluginPath).then((m) => m.default ?? m)
          }

          let resolvedPath = path.resolve(inputBasePath, pluginPath)
          let [module, moduleDependencies] = await Promise.all([
            import(pathToFileURL(resolvedPath).href + '?id=' + Date.now()),
            getModuleDependencies(resolvedPath),
          ])

          addWatchFile(resolvedPath)
          fullRebuildPaths.add(resolvedPath)
          for (let file of moduleDependencies) {
            addWatchFile(file)
            fullRebuildPaths.add(file)
          }
          return module.default ?? module
        },

        loadConfig: async (configPath) => {
          if (configPath[0] !== '.') {
            return import(configPath).then((m) => m.default ?? m)
          }

          let resolvedPath = path.resolve(inputBasePath, configPath)
          let [module, moduleDependencies] = await Promise.all([
            import(pathToFileURL(resolvedPath).href + '?id=' + Date.now()),
            getModuleDependencies(resolvedPath),
          ])

          addWatchFile(resolvedPath)
          fullRebuildPaths.add(resolvedPath)
          for (let file of moduleDependencies) {
            addWatchFile(file)
            fullRebuildPaths.add(file)
          }
          return module.default ?? module
        },
      })
    }

    scanner = new Scanner({
      sources: compiler.globs.map((pattern) => ({
        base: inputBasePath, // Globs are relative to the input.css file
        pattern,
      })),
    })

    // This should not be here, but right now the Vite plugin is setup where we
    // setup a new scanner and compiler every time we request the CSS file
    // (regardless whether it actually changed or not).
    for (let candidate of scanner.scan()) {
      candidates.add(candidate)
    }

    if (changedContent.length > 0) {
      for (let candidate of scanner.scanFiles(changedContent.splice(0))) {
        candidates.add(candidate)
      }
    }

    // Watch individual files
    for (let file of scanner.files) {
      addWatchFile(file)
    }

    // Watch globs
    for (let glob of scanner.globs) {
      if (glob.pattern[0] === '!') continue

      let relative = path.relative(config!.root, glob.base)
      if (relative[0] !== '.') {
        relative = './' + relative
      }
      // Ensure relative is a posix style path since we will merge it with
      // the glob.
      relative = normalizePath(relative)

      addWatchFile(path.posix.join(relative, glob.pattern))
    }

    return compiler.build(Array.from(candidates))
  }

  async function generateOptimizedCss(
    css: string,
    inputPath: string,
    addWatchFile: (file: string) => void,
  ) {
    return optimizeCss(await generateCss(css, inputPath, addWatchFile), { minify })
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

      // Scan index.html for candidates
      transformIndexHtml(html, context) {
        let updated = scan(html, 'html')
        if (updated) {
          queueRebuild(isSSR)
        }
      },

      // Scan all non-CSS files for candidates
      transform(src, id, options) {
        if (id.includes('/.vite/')) return
        let extension = getExtension(id)
        if (extension === '' || extension === 'css') return

        let updated = scan(src, extension)
        if (updated) {
          queueRebuild(options?.ssr ?? false)
        }
      },
    },

    {
      // Step 2 (serve mode): Generate CSS
      name: '@tailwindcss/vite:generate:serve',
      apply: 'serve',
      enforce: 'pre',

      async transform(src, id, options) {
        if (!isTailwindCssFile(id, src)) return
        onFileChange(id)

        // In serve mode, we treat cssModules as a set, ignoring the value.
        cssModules[id] = { content: '', handled: true }

        if (!options?.ssr) {
          // Wait until all other files have been processed, so we can extract
          // all candidates before generating CSS. This must not be called
          // during SSR or it will block the server.
          await server?.waitForRequestsIdle?.(id)
        }

        let code = await transformWithPlugins(
          this,
          id,
          await generateCss(src, id, (file) => this.addWatchFile(file)),
        )
        return { code }
      },
    },

    {
      // Step 2 (full build): Generate CSS
      name: '@tailwindcss/vite:generate:build',
      apply: 'build',
      enforce: 'pre',

      buildStart() {
        for (let [, file] of Object.entries(cssModules)) {
          file.handled = false
        }
      },

      async transform(src, id) {
        if (!isTailwindCssFile(id, src)) return
        onFileChange(id)

        cssModules[id] = { content: src, handled: false }

        // We do a first pass to generate valid CSS for the downstream plugins.
        // However, it's likely that we need to regenerate this later once all
        // candidates have been extracted.
        let code = await transformWithPlugins(
          this,
          id,
          await generateCss(src, id, (file) => this.addWatchFile(file)),
        )
        return { code }
      },

      // renderChunk runs in the bundle generation stage after all transforms.
      // We must run before `enforce: post` so the updated chunks are picked up
      // by vite:css-post.
      async renderChunk(_code, _chunk) {
        for (let [id, file] of Object.entries(cssModules)) {
          if (file.handled) {
            continue
          }

          let css = await generateOptimizedCss(file.content, id, (file) => this.addWatchFile(file))

          // These plugins have side effects which, during build, results in CSS
          // being written to the output dir. We need to run them here to ensure
          // the CSS is written before the bundle is generated.
          await transformWithPlugins(this, id, css)

          file.handled = true
        }
      },
    },
  ] satisfies Plugin[]
}

function getExtension(id: string) {
  let [filename] = id.split('?', 2)
  return path.extname(filename).slice(1)
}

function isTailwindCssFile(id: string, src: string) {
  let extension = getExtension(id)
  let isCssFile = extension === 'css' || (extension === 'vue' && id.includes('&lang.css'))
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
