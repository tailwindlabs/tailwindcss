import { IO, Parsing, scanFiles } from '@tailwindcss/oxide'
import path from 'path'
import { compile, optimizeCss } from 'tailwindcss'
import type { Plugin, Update, ViteDevServer } from 'vite'

export default function tailwindcss(): Plugin[] {
  let server: ViteDevServer | null = null
  let candidates = new Set<string>()
  let cssModules = new Set<string>()
  let minify = false

  function isCssFile(id: string) {
    let [filename] = id.split('?', 2)
    let extension = path.extname(filename).slice(1)
    return extension === 'css'
  }

  // Trigger update to all css modules
  function updateCssModules() {
    // If we're building then we don't need to update anything
    if (!server) return

    let updates: Update[] = []
    for (let id of cssModules) {
      let cssModule = server.moduleGraph.getModuleById(id)
      if (!cssModule) {
        console.log('Could not find css module', id)
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
    return compile(css, Array.from(candidates))
  }

  function generateOptimizedCss(css: string) {
    return optimizeCss(generateCss(css), { minify })
  }

  // In dev mode, there isn't a hook to signal that we've seen all files. We use
  // a timer, resetting it on each file seen, and trigger CSS generation when we
  // haven't seen any new files after a timeout. If this triggers too early,
  // there will be a FOOC and but CSS will regenerate after we've seen more files.
  let initialScan = (() => {
    // If too short, we're more likely to trigger a FOOC and generate CSS
    // multiple times. If too long, we delay dev builds.
    let delayInMs = 50

    let timer: ReturnType<typeof setTimeout>
    let resolve: () => void
    let resolved = false

    return {
      tick() {
        if (resolved) return
        timer && clearTimeout(timer)
        timer = setTimeout(resolve, delayInMs)
      },

      complete: new Promise<void>((_resolve) => {
        resolve = () => {
          resolved = true
          _resolve()
        }
      }),
    }
  })()

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
      },

      // Scan index.html for candidates
      transformIndexHtml(html) {
        initialScan.tick()
        let updated = scan(html, 'html')

        // In dev mode, if the generated CSS contains a URL that causes the
        // browser to load a page (e.g. an URL to a missing image), triggering a
        // CSS update will cause an infinite loop. We only trigger if the
        // candidates have been updated.
        if (server && updated) {
          updateCssModules()
        }
      },

      // Scan all other files for candidates
      transform(src, id) {
        initialScan.tick()
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
      // Step 2 (dev mode): Generate CSS
      name: '@tailwindcss/vite:generate:serve',
      apply: 'serve',
      async transform(src, id) {
        if (!isCssFile(id) || !src.includes('@tailwind')) return

        cssModules.add(id)

        // For the initial load we must wait for all source files to be scanned
        await initialScan.complete

        return { code: generateCss(src) }
      },
    },

    {
      // Step 2 (full build): Generate CSS
      name: '@tailwindcss/vite:generate:build',
      enforce: 'post',
      apply: 'build',
      generateBundle(_options, bundle) {
        for (let id in bundle) {
          let item = bundle[id]
          if (item.type !== 'asset') continue
          if (!isCssFile(id)) continue
          let rawSource = item.source
          let source =
            rawSource instanceof Uint8Array ? new TextDecoder().decode(rawSource) : rawSource

          if (source.includes('@tailwind')) {
            item.source = generateOptimizedCss(source)
          }
        }
      },
    },
  ] satisfies Plugin[]
}
