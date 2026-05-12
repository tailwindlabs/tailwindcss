import { describe } from 'vitest'
import {
  candidate,
  css,
  fetchStyles,
  html,
  js,
  json,
  retryAssertion,
  test,
  ts,
  txt,
  yaml,
} from '../utils'

test(
  'resolves tsconfig paths in production build',
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
            "vite": "^8"
          }
        }
      `,
      'tsconfig.json': json`
        {
          "compilerOptions": {
            "baseUrl": ".",
            "paths": {
              "@/*": ["./src/*"]
            }
          }
        }
      `,
      'vite.config.ts': ts`
        import tailwindcss from '@tailwindcss/vite'
        import { defineConfig } from 'vite'

        export default defineConfig({
          build: { cssMinify: false },
          plugins: [tailwindcss()],
          resolve: {
            tsconfigPaths: true,
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
        @import '@/styles/base.css';
        @plugin '@/plugin.js';
      `,
      'src/styles/base.css': css`
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
  'resolves tsconfig paths in dev mode',
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
            "vite": "^8"
          }
        }
      `,
      'tsconfig.json': json`
        {
          "compilerOptions": {
            "baseUrl": ".",
            "paths": {
              "@/*": ["./src/*"]
            }
          }
        }
      `,
      'vite.config.ts': ts`
        import tailwindcss from '@tailwindcss/vite'
        import { defineConfig } from 'vite'

        export default defineConfig({
          build: { cssMinify: false },
          plugins: [tailwindcss()],
          resolve: {
            tsconfigPaths: true,
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
        @import '@/styles/base.css';
        @plugin '@/plugin.js';
      `,
      'src/styles/base.css': css`
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

test(
  'resolves at-sign aliases in production build',
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
            "vite": "^8"
          }
        }
      `,
      'vite.config.ts': ts`
        import tailwindcss from '@tailwindcss/vite'
        import { defineConfig } from 'vite'
        import { fileURLToPath } from 'node:url'

        export default defineConfig({
          build: { cssMinify: false },
          plugins: [tailwindcss()],
          resolve: {
            alias: [{ find: '@', replacement: fileURLToPath(new URL('.', import.meta.url)) }],
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
        @import '@/src/styles/base.css';
        @plugin '@/src/plugin.js';
      `,
      'src/styles/base.css': css`
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
  'resolves package plugins in production build with at-sign aliases',
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
            "tailwind-scrollbar": "^4.0.2",
            "tailwindcss-motion": "^1.1.1",
            "vite": "^8"
          }
        }
      `,
      'vite.config.ts': ts`
        import tailwindcss from '@tailwindcss/vite'
        import { defineConfig } from 'vite'
        import { fileURLToPath } from 'node:url'

        export default defineConfig({
          build: { cssMinify: false },
          plugins: [tailwindcss()],
          resolve: {
            alias: [{ find: '@', replacement: fileURLToPath(new URL('.', import.meta.url)) }],
          },
        })
      `,
      'index.html': html`
        <head>
          <link rel="stylesheet" href="./src/index.css" />
        </head>
        <body>
          <div class="scrollbar scrollbar-thumb-red-500 motion-preset-fade">Hello, world!</div>
        </body>
      `,
      'src/index.css': css`
        @import 'tailwindcss';
        @plugin 'tailwind-scrollbar';
        @plugin 'tailwindcss-motion';
      `,
    },
  },
  async ({ fs, exec, expect }) => {
    await exec('pnpm vite build')

    let files = await fs.glob('dist/**/*.css')
    expect(files).toHaveLength(1)
    let [filename] = files[0]

    await fs.expectFileToContain(filename, [
      candidate`scrollbar`,
      candidate`scrollbar-thumb-red-500`,
      candidate`motion-preset-fade`,
    ])
  },
)

test(
  'resolves package plugins to JS entries in production build when browser points to CSS',
  {
    fs: {
      'package.json': json`
        {
          "type": "module",
          "dependencies": {
            "@tailwindcss/vite": "workspace:^",
            "plugin-browser-css": "workspace:*",
            "tailwindcss": "workspace:^"
          },
          "devDependencies": {
            "vite": "^8"
          }
        }
      `,
      'pnpm-workspace.yaml': yaml`
        #
        packages:
          - packages/*
      `,
      'packages/plugin-browser-css/package.json': json`
        {
          "name": "plugin-browser-css",
          "version": "1.0.0",
          "type": "module",
          "main": "./index.js",
          "module": "./index.js",
          "browser": "./browser.css"
        }
      `,
      'packages/plugin-browser-css/index.js': js`
        export default function ({ addUtilities }) {
          addUtilities({ '.browser-css-plugin': { 'border-bottom': '1px solid green' } })
        }
      `,
      'packages/plugin-browser-css/browser.css': css`
        .should-not-be-loaded-as-a-plugin {
          display: none;
        }
      `,
      'vite.config.ts': ts`
        import tailwindcss from '@tailwindcss/vite'
        import { defineConfig } from 'vite'

        export default defineConfig({
          build: { cssMinify: false },
          plugins: [tailwindcss()],
        })
      `,
      'index.html': html`
        <html>
          <head>
            <link rel="stylesheet" href="./src/index.css" />
          </head>
          <body>
            <div class="browser-css-plugin">Hello, world!</div>
          </body>
        </html>
      `,
      'src/index.css': css`
        @import 'tailwindcss';
        @plugin 'plugin-browser-css';
      `,
    },
  },
  async ({ fs, exec, expect }) => {
    await exec('pnpm vite build')

    let files = await fs.glob('dist/**/*.css')
    expect(files).toHaveLength(1)
    let [filename] = files[0]

    await fs.expectFileToContain(filename, [candidate`browser-css-plugin`])
  },
)

test(
  'resolves package plugins to JS entries in dev mode when browser points to CSS',
  {
    fs: {
      'package.json': json`
        {
          "type": "module",
          "dependencies": {
            "@tailwindcss/vite": "workspace:^",
            "plugin-browser-css": "workspace:*",
            "tailwindcss": "workspace:^"
          },
          "devDependencies": {
            "vite": "^8"
          }
        }
      `,
      'pnpm-workspace.yaml': yaml`
        #
        packages:
          - packages/*
      `,
      'packages/plugin-browser-css/package.json': json`
        {
          "name": "plugin-browser-css",
          "version": "1.0.0",
          "type": "module",
          "main": "./index.js",
          "module": "./index.js",
          "browser": "./browser.css"
        }
      `,
      'packages/plugin-browser-css/index.js': js`
        export default function ({ addUtilities }) {
          addUtilities({ '.browser-css-plugin': { 'border-bottom': '1px solid green' } })
        }
      `,
      'packages/plugin-browser-css/browser.css': css`
        .should-not-be-loaded-as-a-plugin {
          display: none;
        }
      `,
      'vite.config.ts': ts`
        import tailwindcss from '@tailwindcss/vite'
        import { defineConfig } from 'vite'

        export default defineConfig({
          build: { cssMinify: false },
          plugins: [tailwindcss()],
        })
      `,
      'index.html': html`
        <html>
          <head>
            <link rel="stylesheet" href="./src/index.css" />
          </head>
          <body>
            <div class="browser-css-plugin">Hello, world!</div>
          </body>
        </html>
      `,
      'src/index.css': css`
        @import 'tailwindcss';
        @plugin 'plugin-browser-css';
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
      expect(styles).toContain(candidate`browser-css-plugin`)
    })
  },
)

test(
  'resolves package plugins in dev mode when package exports CSS files',
  {
    fs: {
      'package.json': json`
        {
          "type": "module",
          "dependencies": {
            "@tailwindcss/vite": "workspace:^",
            "daisyui": "^5",
            "tailwindcss": "workspace:^"
          },
          "devDependencies": {
            "vite": "^8"
          }
        }
      `,
      'vite.config.ts': ts`
        import tailwindcss from '@tailwindcss/vite'
        import { defineConfig } from 'vite'

        export default defineConfig({
          build: { cssMinify: false },
          plugins: [tailwindcss()],
        })
      `,
      'index.html': html`
        <html>
          <head>
            <link rel="stylesheet" href="./src/index.css" />
          </head>
          <body>
            <button class="btn btn-primary">Hello, world!</button>
          </body>
        </html>
      `,
      'src/index.css': css`
        @import 'tailwindcss';
        @plugin 'daisyui';
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
      expect(styles).toContain('.btn')
      expect(styles).toContain('.btn-primary')
    })
  },
)

test(
  'resolve relative CSS files correctly',
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
            "vite": "^8"
          }
        }
      `,
      'vite.config.ts': ts`
        import tailwindcss from '@tailwindcss/vite'
        import { defineConfig } from 'vite'

        export default defineConfig({
          build: { cssMinify: false },
          plugins: [tailwindcss()],
        })
      `,
      'index.html': html`
        <html>
          <head>
            <link rel="stylesheet" href="./src/index.css" />
          </head>
          <body></body>
        </html>
      `,
      'src/index.css': css`
        @reference 'tailwindcss/theme';
        @import 'tailwindcss/utilities';
        @import './themes/glow.css';
      `,
      // References a file in the current folder, which names happens to match a
      // file in the parent folder as well.
      'src/themes/glow.css': css`@import './entry.css';`,
      'src/themes/entry.css': css`
        .do-include-me {
          color: green;
        }
      `,

      // Never rerefenced, so should not be included
      'src/entry.css': css`
        .do-not-include-me {
          color: red;
        }
      `,
    },
  },
  async ({ exec, fs, expect }) => {
    await exec('pnpm vite build')

    expect(
      (await fs.dumpFiles('./dist/**/*.css')).replace(/-([_a-zA-Z0-9]*?)\.css/g, '-<hash>.css'),
    ).toMatchInlineSnapshot(`
      "
      --- ./dist/assets/index-<hash>.css ---
      .do-include-me {
        color: green;
      }
      "
    `)
  },
)

test(
  'resolve relative JS files correctly',
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
            "vite": "^8"
          }
        }
      `,
      'vite.config.ts': ts`
        import tailwindcss from '@tailwindcss/vite'
        import { defineConfig } from 'vite'

        export default defineConfig({
          build: { cssMinify: false },
          plugins: [tailwindcss()],
        })
      `,
      'index.html': html`
        <html>
          <head>
            <link rel="stylesheet" href="./src/index.css" />
          </head>
          <body></body>
        </html>
      `,
      'src/index.css': css`
        @reference 'tailwindcss/theme';
        @import 'tailwindcss/utilities';
        @import './themes/glow.css';
      `,
      // References a file in the current folder, which names happens to match a
      // file in the parent folder as well.
      'src/themes/glow.css': css`@plugin "./my-plugin.js";`,
      'src/themes/my-plugin.js': ts`
        export default function ({ addBase }) {
          addBase({ '.do-include-me': { color: 'green' } })
        }
      `,

      // Never rerefenced, so should not be included
      'src/my-plugin.js': css`
        export default function ({ addBase }) {
          addBase({ '.do-not-include-me': { 'color': 'red' } })
        }
      `,
    },
  },
  async ({ exec, fs, expect }) => {
    await exec('pnpm vite build')

    expect(
      (await fs.dumpFiles('./dist/**/*.css')).replace(/-([_a-zA-Z0-9]*?)\.css/g, '-<hash>.css'),
    ).toMatchInlineSnapshot(`
        "
        --- ./dist/assets/index-<hash>.css ---
        @layer base {
          .do-include-me {
            color: green;
          }
        }
        "
      `)
  },
)

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
              ${transformer === 'lightningcss' ? `"lightningcss": "^1",` : ''}
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
              ${transformer === 'lightningcss' ? `"lightningcss": "^1",` : ''}
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
