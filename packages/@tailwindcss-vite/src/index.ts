import { IO, Parsing, scanFiles } from '@tailwindcss/oxide'
import { Features, transform } from 'lightningcss'
import path from 'path'
import { compile } from 'tailwindcss'
import type { Plugin, Rollup, Update, ViteDevServer } from 'vite'

export default function tailwindcss(): Plugin[] {
  let server: ViteDevServer | null = null
  let candidates = new Set<string>()
  // In serve mode, we treat this as a set, storing storing empty strings.
  // In build mode, we store file contents to use them in renderChunk.
  let cssModules: Record<string, string> = {}
  let minify = false
  let plugins: readonly Plugin[] = []

  // Trigger update to all css modules
  function updateCssModules() {
    // If we're building then we don't need to update anything
    if (!server) return

    let updates: Update[] = []
    for (let id of Object.keys(cssModules)) {
      let cssModule = server.moduleGraph.getModuleById(id)
      if (!cssModule) {
        // It is safe to remove the item here since we're iterating on a copy of
        // the values.
        delete cssModules[id]
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

  // Transform the CSS by manually run the transform functions of non-Tailwind plugins on the given
  // CSS.
  async function transformWithPlugins(context: Rollup.PluginContext, id: string, css: string) {
    let transformPluginContext = {
      ...context,
      getCombinedSourcemap: () => {
        throw new Error('getCombinedSourcemap not implemented')
      },
    }

    for (let plugin of plugins) {
      if (
        // Skip our own plugins
        plugin.name.startsWith('@tailwindcss/') ||
        // Skip vite:import-analysis and vite:build-import-analysis because they try
        // to process CSS as JS and fail.
        plugin.name.includes('import-analysis')
      )
        continue

      if (!plugin.transform) continue
      const transformHandler =
        'handler' in plugin.transform! ? plugin.transform.handler : plugin.transform!

      try {
        // Based on https://github.com/unocss/unocss/blob/main/packages/vite/src/modes/global/build.ts#L43
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
        plugins = config.plugins
      },

      // Scan index.html for candidates
      transformIndexHtml(html) {
        let updated = scan(html, 'html')

        // In serve mode, if the generated CSS contains a URL that causes the
        // browser to load a page (e.g. an URL to a missing image), triggering a
        // CSS update will cause an infinite loop. We only trigger if the
        // candidates have been updated.
        if (server && updated) {
          updateCssModules()
        }
      },

      // Scan all other files for candidates
      transform(src, id) {
        if (id.includes('/.vite/')) return
        let [filename] = id.split('?', 2)
        let extension = path.extname(filename).slice(1)
        if (extension === '' || extension === 'css') return

        scan(src, extension)

        if (server) {
          updateCssModules()
        }
      },
    },

    {
      // Step 2 (dev server mode): Generate CSS
      name: '@tailwindcss/vite:generate:serve',
      apply: 'serve',

      async transform(src, id) {
        if (!isTailwindCssFile(id, src)) return

        // In serve mode, we treat cssModules as a set, ignoring the value.
        cssModules[id] = ''

        // Wait until all other files have been processed, so we can extract all
        // candidates before generating CSS.
        await server?.waitForRequestsIdle?.(id)

        let code = await transformWithPlugins(this, id, generateCss(src))
        return { code }
      },
    },

    {
      // Step 2 (full build): Generate CSS
      //
      // This must run after 'enforce: pre' so @imports are expanded in transform, and before 'enforce: post'
      // so the transformed chunks are applied.
      name: '@tailwindcss/vite:generate:build',
      apply: 'build',

      transform(src, id) {
        if (id.includes('/.vite/')) return
        if (!isTailwindCssFile(id, src)) return
        cssModules[id] = src
        return
      },

      // renderChunk runs in the bundle generation stage after all transforms.
      async renderChunk(_code, _chunk) {
        for (let [cssFile, css] of Object.entries(cssModules)) {
          // Running transform updates the chunk directly inside Rollup.
          await transformWithPlugins(this, cssFile, generateOptimizedCss(css))
        }
      },
    },
  ] satisfies Plugin[]
}

function isTailwindCssFile(id: string, src: string) {
  let [filename] = id.split('?', 2)
  let extension = path.extname(filename).slice(1)
  return extension === 'css' && src.includes('@tailwind')
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
