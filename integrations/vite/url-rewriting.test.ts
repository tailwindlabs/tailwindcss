import { expect } from 'vitest'
import { binary, css, html, json, test, ts } from '../utils'

const SIMPLE_IMAGE = `iVBORw0KGgoAAAANSUhEUgAAADAAAAAlAQAAAAAsYlcCAAAACklEQVR4AWMYBQABAwABRUEDtQAAAABJRU5ErkJggg==`

test(
  'can rewrite urls in production builds',
  {
    fs: {
      'package.json': json`
        {
          "type": "module",
          "dependencies": {
            "tailwindcss": "workspace:^"
          },
          "devDependencies": {
            "@tailwindcss/vite": "workspace:^",
            "vite": "^5.3.5"
          }
        }
      `,
      'vite.config.ts': ts`
        import { defineConfig } from 'vite'
        import tailwindcss from '@tailwindcss/vite'

        export default defineConfig({
          plugins: [tailwindcss()],
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
            <script type="module" src="./src/main.ts"></script>
          </body>
        </html>
      `,
      'src/main.ts': ts``,
      'src/app.css': css`
        @import './dir-1/bar.css';
        @import './dir-1/dir-2/baz.css';
      `,
      'src/dir-1/bar.css': css`
        .bar {
          background-image: url('../../resources/image.png');
        }
      `,
      'src/dir-1/dir-2/baz.css': css`
        .baz {
          background-image: url('../../../resources/image.png');
        }
      `,
      'resources/image.png': binary(SIMPLE_IMAGE),
    },
  },
  async ({ fs, exec }) => {
    await exec('pnpm vite build')

    let files = await fs.glob('dist/**/*.css')
    expect(files).toHaveLength(1)

    await fs.expectFileToContain(files[0][0], [SIMPLE_IMAGE])
  },
)
