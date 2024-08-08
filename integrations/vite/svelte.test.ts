import { expect } from 'vitest'
import { candidate, html, json, test, ts } from '../utils'

test(
  'production build',
  {
    fs: {
      'package.json': json`
        {
          "type": "module",
          "dependencies": {
            "svelte": "^4.2.18",
            "tailwindcss": "workspace:^"
          },
          "devDependencies": {
            "@sveltejs/vite-plugin-svelte": "^3.1.1",
            "@tailwindcss/vite": "workspace:^",
            "vite": "^5.3.5"
          }
        }
      `,
      'vite.config.ts': ts`
        import { defineConfig } from 'vite'
        import { svelte, vitePreprocess } from '@sveltejs/vite-plugin-svelte'
        import tailwindcss from '@tailwindcss/vite'

        export default defineConfig({
          plugins: [
            svelte({
              preprocess: [vitePreprocess()],
            }),
            tailwindcss(),
          ],
        })
      `,
      'index.html': html`
        <!doctype html>
        <html>
          <body>
            <div id="app"></div>
            <script type="module" src="./src/main.ts"></script>
          </body>
        </html>
      `,
      'src/main.ts': ts`
        import App from './App.svelte'
        const app = new App({
          target: document.body,
        })
      `,
      'src/App.svelte': html`
        <script>
          let name = 'world'
        </script>

        <h1 class="foo underline">Hello {name}!</h1>

        <style global>
          @import 'tailwindcss/utilities';
          @import 'tailwindcss/theme' theme(reference);
          .foo {
            @apply text-red-500;
          }
        </style>
    `,
    },
  },
  async ({ fs, exec }) => {
    await exec('pnpm vite build')

    let files = await fs.glob('dist/**/*.css')
    expect(files).toHaveLength(1)

    await fs.expectFileToContain(files[0][0], [candidate`underline`, candidate`foo`])
  },
)
