import { expect } from 'vitest'
import { candidate, css, fetchStyles, html, json, retryAssertion, test, ts } from '../utils'

test(
  'dev mode',
  {
    fs: {
      'package.json': json`
        {
          "type": "module",
          "dependencies": {
            "@tailwindcss/vite": "workspace:^",
            "nuxt": "^3.13.1",
            "tailwindcss": "workspace:^",
            "vue": "latest"
          }
        }
      `,
      'nuxt.config.ts': ts`
        import tailwindcss from '@tailwindcss/vite'

        // https://nuxt.com/docs/api/configuration/nuxt-config
        export default defineNuxtConfig({
          vite: {
            plugins: [tailwindcss()],
          },

          css: ['~/assets/css/main.css'],
          devtools: { enabled: true },
          compatibilityDate: '2024-08-30',
        })
      `,
      'app.vue': html`
        <template>
          <div class="underline">Hello world!</div>
        </template>
      `,
      'assets/css/main.css': css`@import 'tailwindcss';`,
    },
  },
  async ({ fs, spawn, getFreePort }) => {
    let port = await getFreePort()
    await spawn(`pnpm nuxt dev --port ${port}`)

    await retryAssertion(async () => {
      let css = await fetchStyles(port)
      expect(css).toContain(candidate`underline`)
    })

    await fs.write(
      'app.vue',
      html`
        <template>
          <div class="underline font-bold">Hello world!</div>
        </template>
      `,
    )
    await retryAssertion(async () => {
      let css = await fetchStyles(port)
      expect(css).toContain(candidate`underline`)
      expect(css).toContain(candidate`font-bold`)
    })
  },
)
