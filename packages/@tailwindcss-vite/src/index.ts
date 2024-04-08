import { IO, Parsing, scanFiles } from '@tailwindcss/oxide'
import { Features, transform } from 'lightningcss'
import path from 'path'
import { compile } from 'tailwindcss'
import type { Plugin, Rollup, Update, ViteDevServer } from 'vite'

export default function tailwindcss(): Plugin[] {
  let server: ViteDevServer | null = null
  let candidates = new Set<string>()
  // In serve mode this is treated as a set — the content doesn't matter.
  // In build mode, we store file contents to use them in renderChunk.
  let cssModules: Record<
    string,
    {
      content: string
      handled: boolean
    }
  > = {}
  let isSSR = false
  let minify = false
  let cssPlugins: readonly Plugin[] = []

  // Trigger update to all CSS modules
  function updateCssModules(isSSR: boolean) {
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
    // Parse all candidates given the resolved files
    for (let candidate of scanFiles(
      [{ content: src, extension }],
      IO.Sequential | Parsing.Sequential,
    )) {
      // On an initial or full build, updated becomes true immediately so we
      // won't be making extra checks.
      if (!updated) {
        if (candidates.has(candidate)) continue
        updated = true
      }
      candidates.add(candidate)
    }
    return updated
  }

  function generateCss(css: string) {
    return compile(css).build(Array.from(candidates))
  }

  function generateOptimizedCss(css: string) {
    return optimizeCss(generateCss(css), { minify })
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
      const transformHandler =
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

      async configResolved(config) {
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
      transformIndexHtml(html) {
        let updated = scan(html, 'html')

        // In serve mode, if the generated CSS contains a URL that causes the
        // browser to load a page (e.g. an URL to a missing image), triggering a
        // CSS update will cause an infinite loop. We only trigger if the
        // candidates have been updated.
        if (updated) {
          updateCssModules(isSSR)
        }
      },

      // Scan all non-CSS files for candidates
      transform(src, id, options) {
        if (id.includes('/.vite/')) return
        let extension = getExtension(id)
        if (extension === '' || extension === 'css') return

        scan(src, extension)
        updateCssModules(options?.ssr ?? false)
      },
    },

    /*
     * The plugins that generate CSS must run after 'enforce: pre' so @imports
     * are expanded in transform.
     */

    {
      // Step 2 (serve mode): Generate CSS
      name: '@tailwindcss/vite:generate:serve',
      apply: 'serve',

      async transform(src, id, options) {
        if (!isTailwindCssFile(id, src)) return

        // In serve mode, we treat cssModules as a set, ignoring the value.
        cssModules[id] = { content: '', handled: true }

        if (!options?.ssr) {
          // Wait until all other files have been processed, so we can extract
          // all candidates before generating CSS. This must not be called
          // during SSR or it will block the server.
          await server?.waitForRequestsIdle?.(id)
        }

        let code = await transformWithPlugins(this, id, generateCss(src))
        return { code }
      },
    },

    {
      // Step 2 (full build): Generate CSS
      name: '@tailwindcss/vite:generate:build',
      apply: 'build',

      transform(src, id) {
        if (!isTailwindCssFile(id, src)) return
        cssModules[id] = { content: src, handled: false }
      },

      // renderChunk runs in the bundle generation stage after all transforms.
      // We must run before `enforce: post` so the updated chunks are picked up
      // by vite:css-post.
      async renderChunk(_code, _chunk) {
        for (let [id, file] of Object.entries(cssModules)) {
          if (file.handled) {
            continue
          }

          let css = generateOptimizedCss(file.content)

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
  if (id.includes('/.vite/')) return
  return getExtension(id) === 'css' && src.includes('@tailwind')
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
