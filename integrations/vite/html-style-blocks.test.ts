import { html, json, test, ts } from '../utils'

test(
  'transforms html style blocks',
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
            "vite": "^6"
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
          <body>
            <div class="foo"></div>
            <style>
              .foo {
                @apply underline;
              }
            </style>
          </body>
        </html>
      `,
    },
  },
  async ({ fs, exec, expect }) => {
    await exec('pnpm vite build')

    expect(await fs.dumpFiles('dist/*.html')).toMatchInlineSnapshot(`
      "
      --- dist/index.html ---
      <!doctype html>
      <html>
        <body>
          <div class="foo"></div>
          <style>.foo{text-decoration-line:underline}</style>
        </body>
      </html>
      "
    `)
  },
)
