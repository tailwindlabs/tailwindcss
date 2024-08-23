import { candidate, css, html, js, json, test } from '../utils'

test(
  'Config files (CJS)',
  {
    fs: {
      'package.json': json`
        {
          "dependencies": {
            "postcss": "^8",
            "postcss-cli": "^10",
            "tailwindcss": "workspace:^",
            "@tailwindcss/postcss": "workspace:^"
          }
        }
      `,
      'postcss.config.js': js`
        /** @type {import('postcss-load-config').Config} */
        module.exports = {
          plugins: {
            '@tailwindcss/postcss': {},
          },
        }
      `,
      'index.html': html`
        <div class="text-primary"></div>
      `,
      'tailwind.config.js': js`
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
        @config '../tailwind.config.js';
      `,
    },
  },
  async ({ fs, exec }) => {
    await exec('pnpm postcss src/index.css --output dist/out.css')

    await fs.expectFileToContain('dist/out.css', [
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
          "dependencies": {
            "postcss": "^8",
            "postcss-cli": "^10",
            "tailwindcss": "workspace:^",
            "@tailwindcss/postcss": "workspace:^"
          }
        }
      `,
      'postcss.config.mjs': js`
        import tailwindcss from '@tailwindcss/postcss'
        /** @type {import('postcss-load-config').Config} */
        export default {
          plugins: [tailwindcss()],
        }
      `,
      'index.html': html`
        <div class="text-primary"></div>
      `,
      'tailwind.config.mjs': js`
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
        @config '../tailwind.config.mjs';
      `,
    },
  },
  async ({ fs, exec }) => {
    await exec('pnpm postcss src/index.css --output dist/out.css')

    await fs.expectFileToContain('dist/out.css', [
      //
      candidate`text-primary`,
    ])
  },
)

test(
  'Config files (CJS, watch mode)',
  {
    fs: {
      'package.json': json`
        {
          "dependencies": {
            "postcss": "^8",
            "postcss-cli": "^10",
            "tailwindcss": "workspace:^",
            "@tailwindcss/postcss": "workspace:^"
          }
        }
      `,
      'postcss.config.js': js`
        /** @type {import('postcss-load-config').Config} */
        module.exports = {
          plugins: {
            '@tailwindcss/postcss': {},
          },
        }
      `,
      'index.html': html`
        <div class="text-primary"></div>
      `,
      'tailwind.config.js': js`
        let myColor = require('./my-color.js')
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
      'my-color.js': js`module.exports = 'blue'`,
      'src/index.css': css`
        @import 'tailwindcss';
        @config '../tailwind.config.js';
      `,
    },
  },
  async ({ fs, spawn }) => {
    await spawn('pnpm postcss src/index.css --output dist/out.css --watch --verbose')

    await fs.expectFileToContain('dist/out.css', [
      //
      candidate`text-primary`,
      'color: blue',
    ])

    await fs.write('my-color.js', js`module.exports = 'red'`)

    await fs.expectFileToContain('dist/out.css', [
      //
      candidate`text-primary`,
      'color: red',
    ])
  },
)

test(
  'Config files (ESM, watch mode)',
  {
    fs: {
      'package.json': json`
        {
          "dependencies": {
            "postcss": "^8",
            "postcss-cli": "^10",
            "tailwindcss": "workspace:^",
            "@tailwindcss/postcss": "workspace:^"
          }
        }
      `,
      'postcss.config.mjs': js`
        import tailwindcss from '@tailwindcss/postcss'
        /** @type {import('postcss-load-config').Config} */
        export default {
          plugins: [tailwindcss()],
        }
      `,
      'index.html': html`
        <div class="text-primary"></div>
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
  async ({ fs, spawn }) => {
    await spawn('pnpm postcss src/index.css --output dist/out.css --watch --verbose')

    await fs.expectFileToContain('dist/out.css', [
      //
      candidate`text-primary`,
      'color: blue',
    ])

    await fs.write('my-color.mjs', js`export default 'red'`)

    await fs.expectFileToContain('dist/out.css', [
      //
      candidate`text-primary`,
      'color: red',
    ])
  },
)
