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
    // The worst-case retry budget below adds up to ~100s, which does not fit in
    // the default 60s timeout.
    timeout: 120_000,
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
    })

    // `hotUpdate` errors don't kill the dev server, they are only printed to
    // stderr. Track them explicitly so a crash fails the test even if the
    // rebuild happens to succeed anyway.
    let pluginErrors: string[] = []
    process.onStderr((message) => {
      if (message.includes('@tailwindcss/vite')) pluginErrors.push(message)
      return false
    })

    await process.onStdout((m) => m.includes('ready in'))

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

    // Without a connected HMR websocket client (this test only uses HTTP
    // fetches), a file change does not trigger an eager rebuild — it only marks
    // the bundle as stale. The next request then kicks off a rebuild and is
    // served the fallback page until it finishes.
    //
    // So after writing a file, poll with fetches _without touching the file
    // again_: the fetch itself triggers the rebuild, and rewriting on every
    // poll would re-mark the bundle stale right before each fetch, so a
    // completed rebuild could never be observed (which is exactly what made
    // this test flaky).
    //
    // The write is only repeated when polling comes up empty for a while, which
    // covers a change being lost because rolldown's watcher wasn't fully set up
    // yet. Retried writes must produce _different_ content each time (hence
    // `iteration`), because rolldown compares module contents and treats a
    // write of identical content as a no-op.
    //
    // The polling window doubles as the maximum time a rebuild may take:
    // rewriting any sooner marks the bundle stale again and restarts the
    // rebuild, so a machine whose rebuilds outlast the window would never
    // converge. Rebuilds take ~200ms on an idle machine — the window is sized
    // with generous headroom for an overloaded CI runner.
    let iteration = 0

    async function writeAndAwaitRebuild(
      file: string,
      content: () => string,
      assert: (styles: string) => void,
    ) {
      await retryAssertion(
        async () => {
          await fs.write(file, content())

          await retryAssertion(async () => assert(await fetchBundledStyles()), {
            timeout: 15_000,
            delay: 100,
          })
        },
        { timeout: 45_000 },
      )
    }

    // Updates are additive and cause new candidates to be added.
    await writeAndAwaitRebuild(
      'project-a/index.html',
      () => html`
        <head>
          <link rel="stylesheet" href="./src/index.css" />
        </head>
        <body>
          <div class="underline m-2">Hello, world! (${++iteration})</div>
        </body>
      `,
      (styles) => {
        expect(styles).toContain(candidate`underline`)
        expect(styles).toContain(candidate`flex`)
        expect(styles).toContain(candidate`m-2`)
      },
    )

    // Manually added `@source`s are watched and trigger a rebuild
    await writeAndAwaitRebuild(
      'project-b/src/index.html',
      () => html`
        <div class="flex font-bold" data-iteration="${++iteration}" />
      `,
      (styles) => {
        expect(styles).toContain(candidate`underline`)
        expect(styles).toContain(candidate`flex`)
        expect(styles).toContain(candidate`m-2`)
        expect(styles).toContain(candidate`font-bold`)
      },
    )

    expect(pluginErrors).toEqual([])
  },
)
