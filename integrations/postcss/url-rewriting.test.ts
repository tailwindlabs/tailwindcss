import { css, html, js, json, test, txt } from '../utils'

test(
  'can rewrite urls in production builds',
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
        module.exports = {
          plugins: {
            '@tailwindcss/postcss': {},
          },
        }
      `,
      'src/index.css': css`
        @reference 'tailwindcss';
        @import './dir-1/bar.css';
        @import './dir-1/dir-2/baz.css';
        @import './dir-1/dir-2/vector.css';
      `,
      'src/dir-1/bar.css': css`
        .test1 {
          background-image: url('../../resources/image.png');
        }
      `,
      'src/dir-1/dir-2/baz.css': css`
        .test2 {
          background-image: url('../../../resources/image.png');
        }
      `,
      'src/dir-1/dir-2/vector.css': css`
        @import './dir-3/vector.css';
        .test3 {
          background-image: url('../../../resources/vector.svg');
        }
      `,
      'src/dir-1/dir-2/dir-3/vector.css': css`
        .test4 {
          background-image: url('./vector-2.svg');
        }
      `,
    },
  },
  async ({ fs, exec, expect }) => {
    await exec('pnpm postcss src/index.css --output dist/out.css')

    expect(await fs.dumpFiles('dist/out.css')).toMatchInlineSnapshot(`
      "
      --- dist/out.css ---
      .test1 {
        background-image: url('../resources/image.png');
      }
      .test2 {
        background-image: url('../resources/image.png');
      }
      .test4 {
        background-image: url('./dir-1/dir-2/dir-3/vector-2.svg');
      }
      .test3 {
        background-image: url('../resources/vector.svg');
      }
      "
    `)
  },
)

test(
  'url rewriting can be disabled',
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
        module.exports = {
          plugins: {
            '@tailwindcss/postcss': {
              transformAssetUrls: false,
            },
          },
        }
      `,
      'src/index.css': css`
        @reference 'tailwindcss';
        @import './dir-1/bar.css';
        @import './dir-1/dir-2/baz.css';
        @import './dir-1/dir-2/vector.css';
      `,
      'src/dir-1/bar.css': css`
        .test1 {
          background-image: url('../../resources/image.png');
        }
      `,
      'src/dir-1/dir-2/baz.css': css`
        .test2 {
          background-image: url('../../../resources/image.png');
        }
      `,
      'src/dir-1/dir-2/vector.css': css`
        @import './dir-3/vector.css';
        .test3 {
          background-image: url('../../../resources/vector.svg');
        }
      `,
      'src/dir-1/dir-2/dir-3/vector.css': css`
        .test4 {
          background-image: url('./vector-2.svg');
        }
      `,
    },
  },
  async ({ fs, exec, expect }) => {
    await exec('pnpm postcss src/index.css --output dist/out.css')

    expect(await fs.dumpFiles('dist/out.css')).toMatchInlineSnapshot(`
      "
      --- dist/out.css ---
      .test1 {
        background-image: url('../../resources/image.png');
      }
      .test2 {
        background-image: url('../../../resources/image.png');
      }
      .test4 {
        background-image: url('./vector-2.svg');
      }
      .test3 {
        background-image: url('../../../resources/vector.svg');
      }
      "
    `)
  },
)

test(
  'can rewrite urls of stylesheets that Vite inlines in production builds',
  {
    fs: {
      'package.json': json`
        {
          "type": "module",
          "dependencies": {
            "tailwindcss": "workspace:^",
            "@tailwindcss/postcss": "workspace:^"
          },
          "devDependencies": {
            "vite": "^8"
          }
        }
      `,
      'postcss.config.js': js`
        export default {
          plugins: {
            '@tailwindcss/postcss': {},
          },
        }
      `,
      'vite.config.js': js`
        import { defineConfig } from 'vite'

        export default defineConfig({
          build: {
            assetsInlineLimit: 0,
            cssMinify: false,
          },
        })
      `,
      'index.html': html`
        <!doctype html>
        <html>
          <head>
            <link rel="stylesheet" href="./src/index.css" />
          </head>
          <body></body>
        </html>
      `,
      // Vite inlines these `@import`s before `@tailwindcss/postcss` runs
      'src/index.css': css`
        @import 'tailwindcss';
        @import '../vendor/example-font/fonts.css';
        @import './fonts/local.css';
      `,
      'src/fonts/local.css': css`
        @font-face {
          font-family: 'Local Sans';
          src: url('./local-sans.woff2') format('woff2');
        }
      `,
      'src/fonts/local-sans.woff2': txt`local-sans`,
      'vendor/example-font/fonts.css': css`
        @font-face {
          font-family: 'Example Sans';
          src: url('./fonts/example-sans.woff2') format('woff2');
        }
      `,
      'vendor/example-font/fonts/example-sans.woff2': txt`example-sans`,
    },
  },
  async ({ fs, exec, expect }) => {
    // Vitest sets `NODE_ENV` to `test`, and `vite build` keeps a `NODE_ENV`
    // that is already set
    await exec('pnpm vite build', { env: { NODE_ENV: 'production' } })

    let files = await fs.glob('dist/**/*.css')
    expect(files).toHaveLength(1)

    let fonts = await fs.glob('dist/**/*.woff2')
    expect(fonts).toHaveLength(2)

    await fs.expectFileToContain(files[0][0], [
      /url\("?\/assets\/example-sans-[^)]*\.woff2"?\)/,
      /url\("?\/assets\/local-sans-[^)]*\.woff2"?\)/,
    ])
  },
)
