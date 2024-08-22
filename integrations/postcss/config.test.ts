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
        /** @type {import('postcss-load-config').Config} */
        export default {
          plugins: {
            '@tailwindcss/postcss': {},
          },
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
