import { describe } from 'vitest'
import { candidate, css, fetchStyles, html, js, retryAssertion, test, ts, txt } from '../utils'

describe.each(['postcss', 'lightningcss'])('%s', (transformer) => {
  test(
    'resolves aliases in production build',
    {
      fs: {
        'package.json': txt`
          {
            "type": "module",
            "dependencies": {
              "@tailwindcss/vite": "workspace:^",
              "tailwindcss": "workspace:^"
            },
            "devDependencies": {
              ${transformer === 'lightningcss' ? `"lightningcss": "^1.26.0",` : ''}
              "vite": "^5.3.5"
            }
          }
        `,
        'vite.config.ts': ts`
          import tailwindcss from '@tailwindcss/vite'
          import { defineConfig } from 'vite'
          import { fileURLToPath } from 'node:url'

          export default defineConfig({
            css: ${transformer === 'postcss' ? '{}' : "{ transformer: 'lightningcss' }"},
            build: { cssMinify: false },
            plugins: [tailwindcss()],
            resolve: {
              alias: {
                '#css-alias': fileURLToPath(new URL('./src/alias.css', import.meta.url)),
                '#js-alias': fileURLToPath(new URL('./src/plugin.js', import.meta.url)),
              },
            },
          })
        `,
        'index.html': html`
          <head>
            <link rel="stylesheet" href="./src/index.css" />
          </head>
          <body>
            <div class="underline custom-underline">Hello, world!</div>
          </body>
        `,
        'src/index.css': css`
          @import '#css-alias';
          @plugin '#js-alias';
        `,
        'src/alias.css': css`
          @reference 'tailwindcss/theme';
          @import 'tailwindcss/utilities';
        `,
        'src/plugin.js': js`
          export default function ({ addUtilities }) {
            addUtilities({ '.custom-underline': { 'border-bottom': '1px solid green' } })
          }
        `,
      },
    },
    async ({ fs, exec, expect }) => {
      await exec('pnpm vite build')

      let files = await fs.glob('dist/**/*.css')
      expect(files).toHaveLength(1)
      let [filename] = files[0]

      await fs.expectFileToContain(filename, [candidate`underline`, candidate`custom-underline`])
    },
  )

  test(
    'resolves aliases in dev mode',
    {
      fs: {
        'package.json': txt`
          {
            "type": "module",
            "dependencies": {
              "@tailwindcss/vite": "workspace:^",
              "tailwindcss": "workspace:^"
            },
            "devDependencies": {
              ${transformer === 'lightningcss' ? `"lightningcss": "^1.26.0",` : ''}
              "vite": "^5.3.5"
            }
          }
        `,
        'vite.config.ts': ts`
          import tailwindcss from '@tailwindcss/vite'
          import { defineConfig } from 'vite'
          import { fileURLToPath } from 'node:url'

          export default defineConfig({
            css: ${transformer === 'postcss' ? '{}' : "{ transformer: 'lightningcss' }"},
            build: { cssMinify: false },
            plugins: [tailwindcss()],
            resolve: {
              alias: {
                '#css-alias': fileURLToPath(new URL('./src/alias.css', import.meta.url)),
                '#js-alias': fileURLToPath(new URL('./src/plugin.js', import.meta.url)),
              },
            },
          })
        `,
        'index.html': html`
          <head>
            <link rel="stylesheet" href="./src/index.css" />
          </head>
          <body>
            <div class="underline custom-underline">Hello, world!</div>
          </body>
        `,
        'src/index.css': css`
          @import '#css-alias';
          @plugin '#js-alias';
        `,
        'src/alias.css': css`
          @reference 'tailwindcss/theme';
          @import 'tailwindcss/utilities';
        `,
        'src/plugin.js': js`
          export default function ({ addUtilities }) {
            addUtilities({ '.custom-underline': { 'border-bottom': '1px solid green' } })
          }
        `,
      },
    },
    async ({ spawn, expect }) => {
      let process = await spawn('pnpm vite dev')
      await process.onStdout((m) => m.includes('ready in'))

      let url = ''
      await process.onStdout((m) => {
        let match = /Local:\s*(http.*)\//.exec(m)
        if (match) url = match[1]
        return Boolean(url)
      })

      await retryAssertion(async () => {
        let styles = await fetchStyles(url, '/index.html')
        expect(styles).toContain(candidate`underline`)
        expect(styles).toContain(candidate`custom-underline`)
      })
    },
  )
})
