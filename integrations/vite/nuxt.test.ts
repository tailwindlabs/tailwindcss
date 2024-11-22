import { candidate, css, fetchStyles, html, json, retryAssertion, test, ts } from '../utils'

const SETUP = {
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
}

test('dev mode', SETUP, async ({ fs, spawn, getFreePort, expect }) => {
  let port = await getFreePort()
  await spawn(`pnpm nuxt dev --port ${port}`)

  await retryAssertion(async () => {
    let css = await fetchStyles(port)
    expect(css).toContain(candidate`underline`)
  })

  await retryAssertion(async () => {
    await fs.write(
      'app.vue',
      html`
          <template>
          <div class="underline font-bold">Hello world!</div>
        </template>
        `,
    )

    let css = await fetchStyles(port)
    expect(css).toContain(candidate`underline`)
    expect(css).toContain(candidate`font-bold`)
  })
})

test('build', SETUP, async ({ spawn, getFreePort, exec, expect }) => {
  let port = await getFreePort()
  await exec(`pnpm nuxt build`)
  await spawn(`pnpm nuxt preview`, {
    env: {
      PORT: `${port}`,
    },
  })

  await retryAssertion(async () => {
    let css = await fetchStyles(port)
    expect(css).toContain(candidate`underline`)
  })
})
