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
            "vue": "^3.4.37",
            "tailwindcss": "workspace:^"
          },
          "devDependencies": {
            "@vitejs/plugin-vue": "^5.1.2",
            "@tailwindcss/vite": "workspace:^",
            "vite": "^5.3.5"
          }
        }
      `,
      'vite.config.ts': ts`
        import { defineConfig } from 'vite'
        import vue from '@vitejs/plugin-vue'
        import tailwindcss from '@tailwindcss/vite'

        export default defineConfig({
          plugins: [vue(), tailwindcss()],
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
        import { createApp } from 'vue'
        import App from './App.vue'

        createApp(App).mount('#app')
      `,
      'src/App.vue': html`
        <style>
          @import 'tailwindcss/utilities';
          @import 'tailwindcss/theme' theme(reference);
          .foo {
            @apply text-red-500;
          }
        </style>

        <template>
          <div class="underline foo">Hello Vue!</div>
        </template>
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
