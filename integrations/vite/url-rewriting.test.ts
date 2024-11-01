import { describe, expect } from 'vitest'
import { binary, css, html, test, ts, txt } from '../utils'

const SIMPLE_IMAGE = `iVBORw0KGgoAAAANSUhEUgAAADAAAAAlAQAAAAAsYlcCAAAACklEQVR4AWMYBQABAwABRUEDtQAAAABJRU5ErkJggg==`

for (let transformer of ['postcss', 'lightningcss']) {
  describe(transformer, () => {
    test(
      'can rewrite urls in production builds',
      {
        todo: transformer === 'lightningcss',
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
                "vite": "^5.3.5"
              }
            }
          `,
          'vite.config.ts': ts`
            import tailwindcss from '@tailwindcss/vite'
            import { defineConfig } from 'vite'

            export default defineConfig({
              plugins: [tailwindcss()],
              build: { cssMinify: false },
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
  })
}
