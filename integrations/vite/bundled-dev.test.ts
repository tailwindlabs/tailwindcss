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
    async function fetchBundledStyles(): Promise<string> {
      let index = await fetch(`${url}/`)
      let html = await index.text()
      if (html.includes('__vite_is_fallback_page__')) {
        throw new Error('Bundling still in progress')
      }

      let match = /<script[^>]*\ssrc="([^"]+)"/.exec(html)
      if (!match) throw new Error(`No script tag found in:\n\n${html}`)

      let bundle = await fetch(new URL(match[1], `${url}/`))
      return await bundle.text()
    }

    await retryAssertion(async () => {
      let styles = await fetchBundledStyles()
      expect(styles).toContain(candidate`underline`)
      expect(styles).toContain(candidate`flex`)
    })

    await retryAssertion(async () => {
      // Updates are additive and cause new candidates to be added.
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

      let styles = await fetchBundledStyles()
      expect(styles).toContain(candidate`underline`)
      expect(styles).toContain(candidate`flex`)
      expect(styles).toContain(candidate`m-2`)
    })

    await retryAssertion(async () => {
      // Manually added `@source`s are watched and trigger a rebuild
      await fs.write(
        'project-b/src/index.html',
        html`
          <div class="flex font-bold" />
        `,
      )

      let styles = await fetchBundledStyles()
      expect(styles).toContain(candidate`underline`)
      expect(styles).toContain(candidate`flex`)
      expect(styles).toContain(candidate`m-2`)
      expect(styles).toContain(candidate`font-bold`)
    })

    expect(pluginErrors).toEqual([])
  },
)
