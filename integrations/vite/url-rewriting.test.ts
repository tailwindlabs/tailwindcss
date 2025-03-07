import { describe } from 'vitest'
import { binary, css, html, svg, test, ts, txt } from '../utils'

const SIMPLE_IMAGE = `iVBORw0KGgoAAAANSUhEUgAAADAAAAAlAQAAAAAsYlcCAAAACklEQVR4AWMYBQABAwABRUEDtQAAAABJRU5ErkJggg==`

describe.each(['postcss', 'lightningcss'])('%s', (transformer) => {
  test(
    'can rewrite urls in production builds',
    {
      fs: {
        'package.json': txt`
          {
            "type": "module",
            "dependencies": {
              "tailwindcss": "workspace:^"
            },
            "devDependencies": {
              ${transformer === 'lightningcss' ? `"lightningcss": "^1.26.0",` : ''}
              "@tailwindcss/vite": "workspace:^",
              "vite": "^6"
            }
          }
        `,
        'vite.config.ts': ts`
          import tailwindcss from '@tailwindcss/vite'
          import { defineConfig } from 'vite'

          export default defineConfig({
            plugins: [tailwindcss()],
            build: {
              assetsInlineLimit: 256,
              cssMinify: false,
            },
            css: ${transformer === 'postcss' ? '{}' : "{ transformer: 'lightningcss' }"},
          })
        `,
        'index.html': html`
          <!doctype html>
          <html>
            <head>
              <link rel="stylesheet" href="./src/app.css" />
            </head>
            <body>
              <div id="app"></div>
            </body>
          </html>
        `,
        'src/app.css': css`
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
        'resources/image.png': binary(SIMPLE_IMAGE),
        'resources/vector.svg': svg`
          <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
            <rect width="100%" height="100%" fill="red" />
            <circle cx="200" cy="100" r="80" fill="green" />
            <rect width="100%" height="100%" fill="red" />
            <circle cx="200" cy="100" r="80" fill="green" />
          </svg>
        `,
        'src/dir-1/dir-2/dir-3/vector-2.svg': svg`
          <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
            <rect width="100%" height="100%" fill="blue" />
            <circle cx="200" cy="100" r="80" fill="green" />
            <rect width="100%" height="100%" fill="red" />
            <circle cx="200" cy="100" r="80" fill="pink" />
          </svg>
       `,
      },
    },
    async ({ fs, exec, expect }) => {
      await exec('pnpm vite build')

      let files = await fs.glob('dist/**/*.css')
      expect(files).toHaveLength(1)

      await fs.expectFileToContain(files[0][0], [SIMPLE_IMAGE])

      let images = await fs.glob('dist/**/*.svg')
      expect(images).toHaveLength(2)

      await fs.expectFileToContain(files[0][0], [/\/assets\/vector-.*?\.svg/])
    },
  )
})
