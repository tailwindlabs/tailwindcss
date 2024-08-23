import { expect } from 'vitest'
import { candidate, css, fetchStyles, html, js, json, retryAssertion, test, ts } from '../utils'

test(
  'Config files (CJS)',
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
            "vite": "^5.3.5"
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
        <head>
          <link rel="stylesheet" href="./src/index.css" />
        </head>
        <body>
          <div class="text-primary"></div>
        </body>
      `,
      'tailwind.config.cjs': js`
        module.exports = {
          theme: {
            extend: {
              colors: {
                primary: 'blue',
              },
            },
          },
        }
      `,
      'src/index.css': css`
        @import 'tailwindcss';
        @config '../tailwind.config.cjs';
      `,
    },
  },
  async ({ fs, exec }) => {
    await exec('pnpm vite build')

    let files = await fs.glob('dist/**/*.css')
    expect(files).toHaveLength(1)
    let [filename] = files[0]

    await fs.expectFileToContain(filename, [
      //
      candidate`text-primary`,
    ])
  },
)

test(
  'Config files (ESM)',
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
            "vite": "^5.3.5"
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
        <head>
          <link rel="stylesheet" href="./src/index.css" />
        </head>
        <body>
          <div class="text-primary"></div>
        </body>
      `,
      'tailwind.config.js': js`
        export default {
          theme: {
            extend: {
              colors: {
                primary: 'blue',
              },
            },
          },
        }
      `,
      'src/index.css': css`
        @import 'tailwindcss';
        @config '../tailwind.config.js';
      `,
    },
  },
  async ({ fs, exec }) => {
    await exec('pnpm vite build')

    let files = await fs.glob('dist/**/*.css')
    expect(files).toHaveLength(1)
    let [filename] = files[0]

    await fs.expectFileToContain(filename, [
      //
      candidate`text-primary`,
    ])
  },
)

test(
  'Config files (CJS, dev mode)',
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
            "vite": "^5.3.5"
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
        <head>
          <link rel="stylesheet" href="./src/index.css" />
        </head>
        <body>
          <div class="text-primary"></div>
        </body>
      `,
      'tailwind.config.cjs': js`
        const myColor = require('./my-color.cjs')
        module.exports = {
          theme: {
            extend: {
              colors: {
                primary: myColor,
              },
            },
          },
        }
      `,
      'my-color.cjs': js`module.exports = 'blue'`,
      'src/index.css': css`
        @import 'tailwindcss';
        @config '../tailwind.config.cjs';
      `,
    },
  },
  async ({ fs, getFreePort, spawn }) => {
    let port = await getFreePort()
    await spawn(`pnpm vite dev --port ${port}`)

    await retryAssertion(async () => {
      let css = await fetchStyles(port, '/index.html')
      expect(css).toContain(candidate`text-primary`)
      expect(css).toContain('color: blue')
    })

    await fs.write('my-color.cjs', js`module.exports = 'red'`)
    await retryAssertion(async () => {
      let css = await fetchStyles(port, '/index.html')
      expect(css).toContain(candidate`text-primary`)
      expect(css).toContain('color: red')
    })
  },
)

test(
  'Config files (ESM, dev mode)',
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
            "vite": "^5.3.5"
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
        <head>
          <link rel="stylesheet" href="./src/index.css" />
        </head>
        <body>
          <div class="text-primary"></div>
        </body>
      `,
      'tailwind.config.mjs': js`
        import myColor from './my-color.mjs'
        export default {
          theme: {
            extend: {
              colors: {
                primary: myColor,
              },
            },
          },
        }
      `,
      'my-color.mjs': js`export default 'blue'`,
      'src/index.css': css`
        @import 'tailwindcss';
        @config '../tailwind.config.mjs';
      `,
    },
  },
  async ({ fs, getFreePort, spawn }) => {
    let port = await getFreePort()
    await spawn(`pnpm vite dev --port ${port}`)

    await retryAssertion(async () => {
      let css = await fetchStyles(port, '/index.html')
      expect(css).toContain(candidate`text-primary`)
      expect(css).toContain('color: blue')
    })

    await fs.write('my-color.mjs', js`export default 'red'`)
    await retryAssertion(async () => {
      let css = await fetchStyles(port, '/index.html')
      expect(css).toContain(candidate`text-primary`)
      expect(css).toContain('color: red')
    })
  },
)
