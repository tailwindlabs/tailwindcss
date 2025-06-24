import { stripVTControlCharacters } from 'node:util'
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
            "vite": "^7"
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
          @import 'tailwindcss';
          .foo {
            @apply text-red-500;
          }
        </style>
        <style scoped>
          @import 'tailwindcss' reference;
          :deep(.bar) {
            color: red;
          }
        </style>
        <template>
          <div class="underline foo bar">Hello Vue!</div>
        </template>
      `,
    },
  },
  async ({ fs, exec, expect }) => {
    await exec('pnpm vite build')

    let files = await fs.glob('dist/**/*.css')
    expect(files).toHaveLength(1)

    await fs.expectFileToContain(files[0][0], [candidate`underline`, candidate`foo`])
    await fs.expectFileToContain(files[0][0], ['.bar{'])
  },
)

test(
  'error when using `@apply` without `@reference`',
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
            "vite": "^7"
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
        <template>
          <div class="foo">Hello Vue!</div>
        </template>

        <style>
          .foo {
            @apply text-red-500;
          }
        </style>
      `,
    },
  },
  async ({ exec, expect }) => {
    expect.assertions(1)

    try {
      await exec('pnpm vite build')
    } catch (error) {
      let [, message] =
        /error during build:([\s\S]*?)file:/g.exec(
          stripVTControlCharacters(error.message.replace(/\r?\n/g, '\n')),
        ) ?? []
      expect(message.trim()).toMatchInlineSnapshot(
        `"[@tailwindcss/vite:generate:build] Cannot apply unknown utility class \`text-red-500\`. Are you using CSS modules or similar and missing \`@reference\`? https://tailwindcss.com/docs/functions-and-directives#reference-directive"`,
      )
    }
  },
)
