import { candidate, css, html, js, json, test, ts } from '../utils'

test(
  'sveltekit build resolves package plugins',
  {
    fs: {
      'package.json': json`
        {
          "type": "module",
          "scripts": {
            "prepare": "svelte-kit sync || echo ''"
          },
          "dependencies": {
            "svelte": "^5",
            "tailwindcss": "workspace:^"
          },
          "devDependencies": {
            "@sveltejs/adapter-auto": "^6",
            "@sveltejs/kit": "^2",
            "@tailwindcss/forms": "^0.5.11",
            "@tailwindcss/vite": "workspace:^",
            "vite": "^8"
          }
        }
      `,
      'svelte.config.js': js`
        import adapter from '@sveltejs/adapter-auto'

        export default {
          kit: {
            adapter: adapter(),
          },
        }
      `,
      'vite.config.ts': ts`
        import tailwindcss from '@tailwindcss/vite'
        import { sveltekit } from '@sveltejs/kit/vite'
        import { defineConfig } from 'vite'

        export default defineConfig({
          build: { cssMinify: false },
          plugins: [tailwindcss(), sveltekit()],
        })
      `,
      'src/app.html': html`
        <!doctype html>
        <html lang="en">
          <head>
            %sveltekit.head%
          </head>
          <body data-sveltekit-preload-data="hover">
            <div style="display: contents">%sveltekit.body%</div>
          </body>
        </html>
      `,
      'src/routes/+layout.svelte': html`
        <script>
          import '../app.css'
        </script>

        <slot />
      `,
      'src/routes/+page.svelte': html`
        <div class="form-input">Hello, world!</div>
      `,
      'src/app.css': css`
        @import 'tailwindcss';
        @plugin '@tailwindcss/forms';
      `,
    },
  },
  async ({ exec, fs, expect }) => {
    await exec('pnpm vite build')

    let files = await fs.glob('.svelte-kit/output/client/**/*.css')
    expect(files.length).toBeGreaterThan(0)

    await fs.expectFileToContain(files[0][0], [candidate`form-input`])
  },
)
