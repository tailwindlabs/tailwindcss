import { candidate, css, fetchStyles, html, json, retryAssertion, test, ts } from '../utils'

test(
  `dev build`,
  {
    fs: {
      'package.json': json`
        {
          "type": "module",
          "dependencies": {
            "@tailwindcss/vite": "workspace:^",
            "tailwindcss": "workspace:^"
          },
          "devDependencies": {
            "lightningcss": "^1",
            "vite": "^7"
          }
        }
      `,
      'vite.config.ts': ts`
        import tailwindcss from '@tailwindcss/vite'
        import { defineConfig } from 'vite'

        export default defineConfig({
          plugins: [tailwindcss()],
          css: {
            devSourcemap: true,
          },
        })
      `,
      'index.html': html`
        <head>
          <link rel="stylesheet" href="./src/index.css" />
        </head>
        <body>
          <div class="flex">Hello, world!</div>
        </body>
      `,
      'src/index.css': css`
        @import 'tailwindcss/utilities';
        /*  */
      `,
    },
  },
  async ({ fs, spawn, expect, parseSourceMap }) => {
    // Source maps only work in development mode in Vite
    let process = await spawn('pnpm vite dev')
    await process.onStdout((m) => m.includes('ready in'))

    let url = ''
    await process.onStdout((m) => {
      let match = /Local:\s*(http.*)\//.exec(m)
      if (match) url = match[1]
      return Boolean(url)
    })

    let styles = await retryAssertion(async () => {
      let styles = await fetchStyles(url, '/index.html')

      // Wait until we have the right CSS
      expect(styles).toContain(candidate`flex`)

      return styles
    })

    // Make sure we can find a source map
    let map = parseSourceMap(styles)

    expect(map.at(1, 0)).toMatchObject({
      source: null,
      original: '(none)',
      generated: '/*! tailwi...',
    })

    expect(map.at(2, 0)).toMatchObject({
      source: expect.stringContaining('utilities.css'),
      original: '@tailwind...',
      generated: '.flex {...',
    })

    expect(map.at(3, 2)).toMatchObject({
      source: expect.stringContaining('utilities.css'),
      original: '@tailwind...',
      generated: 'display: f...',
    })

    expect(map.at(4, 0)).toMatchObject({
      source: null,
      original: '(none)',
      generated: '}...',
    })
  },
)

// https://github.com/tailwindlabs/tailwindcss/issues/19930
test(
  'production build without Tailwind roots should not result in source map warnings',
  {
    fs: {
      'package.json': json`
        {
          "type": "module",
          "dependencies": {
            "@tailwindcss/vite": "workspace:^",
            "tailwindcss": "workspace:^"
          },
          "devDependencies": {
            "vite": "^7"
          }
        }
      `,
      'vite.config.ts': ts`
        import { defineConfig } from 'vite'
        import tailwindcss from '@tailwindcss/vite'

        export default defineConfig({
          plugins: [
            tailwindcss(),
            {
              name: 'inspect-source-map-chain',
              enforce: 'pre',
              transform(_, id) {
                if (id.includes('.css')) {
                  // Force Rollup to collapse the sourcemap chain during this build.
                  this.getCombinedSourcemap()
                }
              },
            },
          ],
          css: {
            devSourcemap: true,
          },
          build: {
            sourcemap: true,
          },
        })
      `,
      'index.html': html`
        <body>
          <script type="module" src="./src/index.js"></script>
          <div>Hello, world!</div>
        </body>
      `,
      'src/index.js': ts` import './index.css' `,
      'src/index.css': css`
        body {
          color: red;
        }
      `,
    },
  },
  async ({ exec, expect }) => {
    let output = await exec('pnpm vite build')

    expect(output).not.toContain('Sourcemap is likely to be incorrect')
  },
)
