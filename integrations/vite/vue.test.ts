import { stripVTControlCharacters } from 'node:util'
import { candidate, css, fetchStyles, html, json, retryAssertion, test, ts } from '../utils'

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

{
  const VUE_COMPONENT_COUNT = 1_000

  let vueComponentsWithReferences = Object.fromEntries(
    Array.from({ length: VUE_COMPONENT_COUNT }, (_, idx) => [
      `src/components/Component${idx}.vue`,
      html`
        <template>
          <div class="content-['component-${idx}']">Component ${idx}</div>
        </template>

        <style>
          @reference '../main.css';

          .component-${idx} {
            @apply text-red-500;
          }
        </style>
      `,
    ]),
  )

  let vueComponentImports = Array.from(
    { length: VUE_COMPONENT_COUNT },
    (_, idx) => `import Component${idx} from './components/Component${idx}.vue'`,
  ).join('\n')

  let vueComponentUsages = Array.from(
    { length: VUE_COMPONENT_COUNT },
    (_, idx) => `<Component${idx} class="component-${idx}" />`,
  ).join('\n')

  test(
    'production build with many Vue style blocks referencing the main stylesheet',
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
        'src/main.css': css`@import 'tailwindcss';`,
        'src/main.ts': ts`
          import { createApp } from 'vue'
          import './main.css'
          import App from './App.vue'

          createApp(App).mount('#app')
        `,
        'src/App.vue': html`
          <script setup>
            ${vueComponentImports}
          </script>

          <template>${vueComponentUsages}</template>
        `,
        ...vueComponentsWithReferences,
      },
    },
    async ({ fs, exec, expect }) => {
      await exec('pnpm vite build')

      let files = await fs.glob('dist/**/*.css')
      expect(files).toHaveLength(1)

      await fs.expectFileToContain(files[0][0], [
        candidate`content-['component-0']`,
        candidate`component-0`,
        candidate`content-['component-99']`,
        candidate`component-99`,
        candidate`content-['component-999']`,
        candidate`component-999`,
      ])
    },
  )
}

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
      await exec('pnpm vite build', {}, { ignoreStdErr: true })
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

// https://github.com/tailwindlabs/tailwindcss/issues/20320
test(
  'editing a scanned `.vue` file that is not loaded as a module does not trigger a full reload',
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
            "@vitejs/plugin-vue": "^6",
            "@tailwindcss/vite": "workspace:^",
            "vite": "^8"
          }
        }
      `,
      'vite.config.ts': ts`
        import fs from 'node:fs'
        import path from 'node:path'
        import { defineConfig } from 'vite'
        import vue from '@vitejs/plugin-vue'
        import tailwindcss from '@tailwindcss/vite'

        export default defineConfig({
          plugins: [
            vue(),
            tailwindcss(),
            {
              // Log update and full-reload HMR payloads to a file so the
              // test can assert on them. Custom events are not logged
              // because \`@vitejs/plugin-vue\` sends a \`file-changed\` event
              // for every file change, including changes to the log file
              // itself, which would cause an infinite feedback loop.
              name: 'hmr-wiretap',
              configureServer(server) {
                let logFile = path.resolve('hmr.log')
                fs.writeFileSync(logFile, '')
                for (let environment of Object.values(server.environments)) {
                  let send = environment.hot.send.bind(environment.hot)
                  environment.hot.send = (payload) => {
                    if (payload.type === 'update' || payload.type === 'full-reload') {
                      fs.appendFileSync(logFile, JSON.stringify(payload) + '\\n')
                    }
                    return send(payload)
                  }
                }
              },
            },
          ],
        })
      `,
      'index.html': html`
        <!doctype html>
        <html>
          <head>
            <link rel="stylesheet" href="./src/index.css" />
          </head>
          <body>
            <div id="app"></div>
            <script type="module" src="./src/main.ts"></script>
          </body>
        </html>
      `,
      'src/index.css': css`@import 'tailwindcss';`,
      'src/main.ts': ts`
        import { createApp } from 'vue'
        import App from './App.vue'

        createApp(App).mount('#app')
      `,
      'src/App.vue': html`
        <template>
          <div class="content-['src/App.vue']">Hello Vue!</div>
        </template>
      `,

      // This file is scanned by Tailwind but never imported, so it is not
      // part of the loaded module graph (e.g. a lazy route that hasn't been
      // visited yet)
      'src/LazyRoute.vue': html`
        <template>
          <div class="content-['src/LazyRoute.vue']">Lazy</div>
        </template>
      `,
    },
  },
  async ({ spawn, fs, expect }) => {
    let process = await spawn('pnpm vite dev')
    await process.onStdout((m) => m.includes('ready in'))

    let url = ''
    await process.onStdout((m) => {
      let match = /Local:\s*(http.*)\//.exec(m)
      if (match) url = match[1]
      return Boolean(url)
    })

    await retryAssertion(async () => {
      let styles = await fetchStyles(url, '/index.html')
      expect(styles).toContain(candidate`content-['src/App.vue']`)
      expect(styles).toContain(candidate`content-['src/LazyRoute.vue']`)
    })

    // Load `main.ts` and `App.vue` as real modules, like a browser visiting
    // the page would
    await fetch(`${url}/src/main.ts`)
    await fetch(`${url}/src/App.vue`)

    // Changing the scanned but unloaded `.vue` file should not trigger a
    // full reload, but new classes should still apply
    await fs.write(
      'src/LazyRoute.vue',
      html`
        <template>
          <div class="content-['updated:src/LazyRoute.vue']">Lazy</div>
        </template>
      `,
    )

    await retryAssertion(async () => {
      let styles = await fetchStyles(url, '/index.html')
      expect(styles).toContain(candidate`content-['updated:src/LazyRoute.vue']`)
    })
    expect(await fs.read('hmr.log')).not.toContain('full-reload')
  },
)
