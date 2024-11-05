import { describe, expect } from 'vitest'
import { css, fetchStyles, html, retryAssertion, test, ts, txt } from '../utils'

function createSetup(transformer: 'postcss' | 'lightningcss') {
  return {
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

        export default defineConfig({
          css: ${transformer === 'postcss' ? '{}' : "{ transformer: 'lightningcss' }"},
          build: { cssMinify: false },
          plugins: [
            tailwindcss(),
            {
              name: 'recolor',
              transform(code, id) {
                if (id.includes('.css')) {
                  return code.replace(/red/g, 'blue')
                }
              },
            },
          ],
        })
      `,
      'index.html': html`
        <head>
          <link rel="stylesheet" href="./src/index.css" />
        </head>
        <body>
          <div class="foo">Hello, world!</div>
        </body>
      `,
      'src/index.css': css`
        @import 'tailwindcss/theme' theme(reference);
        @import 'tailwindcss/utilities';

        .foo {
          color: red;
        }
      `,
    },
  }
}

for (let transformer of ['postcss', 'lightningcss'] as const) {
  describe(transformer, () => {
    test(`production build`, createSetup(transformer), async ({ fs, exec }) => {
      await exec('pnpm vite build')

      let files = await fs.glob('dist/**/*.css')
      expect(files).toHaveLength(1)
      let [filename] = files[0]

      await fs.expectFileToContain(filename, [
        css`
          .foo {
            color: blue;
          }
        `,
      ])
    })

    test(`dev mode`, createSetup(transformer), async ({ spawn, getFreePort, fs }) => {
      let port = await getFreePort()
      await spawn(`pnpm vite dev --port ${port}`)

      await retryAssertion(async () => {
        let styles = await fetchStyles(port, '/index.html')
        expect(styles).toContain(css`
          .foo {
            color: blue;
          }
        `)
      })

      await retryAssertion(async () => {
        await fs.write(
          'src/index.css',
          css`
            @import 'tailwindcss/theme' theme(reference);
            @import 'tailwindcss/utilities';

            .foo {
              background-color: red;
            }
          `,
        )

        let styles = await fetchStyles(port)
        expect(styles).toContain(css`
          .foo {
            background-color: blue;
          }
        `)
      })
    })

    test('watch mode', createSetup(transformer), async ({ spawn, fs }) => {
      await spawn(`pnpm vite build --watch`)

      await retryAssertion(async () => {
        let files = await fs.glob('dist/**/*.css')
        expect(files).toHaveLength(1)
        let [, styles] = files[0]

        expect(styles).toContain(css`
          .foo {
            color: blue;
          }
        `)
      })

      await retryAssertion(async () => {
        await fs.write(
          'src/index.css',
          css`
            @import 'tailwindcss/theme' theme(reference);
            @import 'tailwindcss/utilities';

            .foo {
              background-color: red;
            }
          `,
        )

        let files = await fs.glob('dist/**/*.css')
        expect(files).toHaveLength(1)
        let [, styles] = files[0]

        expect(styles).toContain(css`
          .foo {
            background-color: blue;
          }
        `)
      })
    })
  })
}
