import path from 'node:path'
import { candidate, css, html, json, retryAssertion, test, ts, txt, yaml } from '../utils'

// Vite's experimental `bundledDev` mode invokes the `hotUpdate` hook without a
// `server`, which used to crash the plugin on every file edit.
//
// - https://github.com/tailwindlabs/tailwindcss/issues/20378
// - https://vite.dev/blog/announcing-vite8-1#experimental-bundled-dev-mode
test(
  'dev mode (experimental `bundledDev`)',
  {
    fs: {
      'package.json': json`{}`,
      'pnpm-workspace.yaml': yaml`
        #
        packages:
          - project-a
      `,
      'project-a/package.json': txt`
        {
          "type": "module",
          "dependencies": {
            "@tailwindcss/vite": "workspace:^",
            "tailwindcss": "workspace:^"
          },
          "devDependencies": {
            "vite": "^8.1"
          }
        }
      `,
      'project-a/vite.config.ts': ts`
        import tailwindcss from '@tailwindcss/vite'
        import { defineConfig } from 'vite'

        export default defineConfig({
          experimental: {
            bundledDev: true,
          },
          plugins: [tailwindcss()],
        })
      `,
      'project-a/index.html': html`
        <head>
          <link rel="stylesheet" href="./src/index.css" />
        </head>
        <body>
          <div class="underline">Hello, world!</div>
        </body>
      `,
      'project-a/src/index.css': css`
        @reference 'tailwindcss/theme';
        @import 'tailwindcss/utilities';
        @source '../../project-b/src/**/*.html';
      `,
      'project-b/src/index.html': html`
        <div class="flex" />
      `,
    },
  },
  async ({ root, spawn, fs, expect }) => {
    let process = await spawn('pnpm vite dev', {
      cwd: path.join(root, 'project-a'),
      env: {
        // Some CI machines have an upstream rolldown bug where its file watcher
        // never delivers a single event. The debug output is the only way to
        // tell that apart from a real regression (see below).
        DEBUG: 'vite:full-bundle-mode',
      },
    })

    // Any debug output beyond the "INITIAL:" startup lines proves rolldown's
    // watcher delivered at least one file event.
    let watcherAlive = false

    // `hotUpdate` errors don't kill the dev server, they are only printed to
    // stderr. Track them explicitly so a crash fails the test even if the
    // rebuild happens to succeed anyway.
    let pluginErrors: string[] = []
    process.onStderr((message) => {
      if (message.includes('vite:full-bundle-mode')) {
        if (!message.includes('INITIAL:')) watcherAlive = true
      } else if (message.includes('@tailwindcss/vite')) {
        pluginErrors.push(message)
      }
      return false
    })

    let url = ''
    await process.onStdout((m) => {
      let match = /Local:\s*(http.*)\//.exec(m)
      if (match) url = match[1]
      return Boolean(url)
    })

    // In `bundledDev` mode the stylesheet is not served separately. Instead the
    // generated CSS is embedded in the bundled JS and injected at runtime, so
    // extract the bundle from the served HTML. While the bundle is being built,
    // Vite serves a temporary fallback page instead.
    //
    // The bundle can be split into multiple chunks (e.g. the HMR client runtime
    // and the app itself), and the chunk containing the CSS is not always the
    // first one, so fetch every referenced script and stylesheet.
    async function fetchBundledStyles(): Promise<string> {
      let index = await fetch(`${url}/`)
      let html = await index.text()
      if (html.includes('__vite_is_fallback_page__')) {
        throw new Error('Bundling still in progress')
      }

      let sources = [
        ...html.matchAll(/<script[^>]*\ssrc="([^"]+)"/g),
        ...html.matchAll(/<link[^>]*\srel="stylesheet"[^>]*\shref="([^"]+)"/g),
      ].map((match) => match[1])
      if (sources.length === 0) throw new Error(`No scripts or stylesheets found in:\n\n${html}`)

      let contents = await Promise.all(
        sources.map(async (src) => {
          let response = await fetch(new URL(src, `${url}/`))
          return await response.text()
        }),
      )
      return contents.join('\n')
    }

    await retryAssertion(
      async () => {
        let styles = await fetchBundledStyles()
        expect(styles).toContain(candidate`underline`)
        expect(styles).toContain(candidate`flex`)
      },
      { timeout: 10_000, delay: 100 },
    )

    // Edit a module file and a manually `@source`d file. Without a connected
    // HMR websocket client (this test only uses HTTP fetches), a file change
    // does not trigger an eager rebuild — it only marks the bundle as stale,
    // and the next fetch kicks off the rebuild. So poll with fetches without
    // touching the files again: rewriting would re-mark the bundle stale right
    // before each fetch and the rebuild could never be observed.
    await fs.write(
      'project-a/index.html',
      html`
        <head>
          <link rel="stylesheet" href="./src/index.css" />
        </head>
        <body>
          <div class="underline m-2">Hello, world!</div>
        </body>
      `,
    )

    await fs.write('project-b/src/index.html', html`
      <div class="flex font-bold" />
    `)

    try {
      await retryAssertion(
        async () => {
          let styles = await fetchBundledStyles()
          expect(styles).toContain(candidate`underline`)
          expect(styles).toContain(candidate`flex`)
          expect(styles).toContain(candidate`m-2`)
          expect(styles).toContain(candidate`font-bold`)
        },
        { timeout: 15_000, delay: 100 },
      )
    } catch (error) {
      // If rolldown's watcher delivered any file event, the updates were
      // genuinely dropped somewhere along the way — a real failure.
      if (watcherAlive) throw error

      // Otherwise the watcher never delivered a single event, so the updates
      // can never be observed no matter how long we wait — an upstream
      // rolldown bug on some CI machines, not a plugin regression. The crash
      // regression this test guards is still covered: `hotUpdate` is driven
      // by Vite's own (working) chokidar watcher and asserted via
      // `pluginErrors` below.
      //
      // Skipping is only sound while the server still healthily serves the
      // original bundle. If it stopped serving (crashed, or wedged on the
      // fallback page), that's real breakage a silent watcher must not mask.
      console.log(error)
      let styles = await fetchBundledStyles()
      expect(styles).toContain(candidate`underline`)
      expect(styles).toContain(candidate`flex`)
      console.warn(
        'Skipping update assertions: rolldown’s file watcher delivered no events on this machine.',
      )
    }

    expect(pluginErrors).toEqual([])
  },
)
