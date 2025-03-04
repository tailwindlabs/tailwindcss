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

test('dev mode', SETUP, async ({ fs, spawn, expect }) => {
  let process = await spawn('pnpm nuxt dev', {
    env: {
      TEST: 'false', // VERY IMPORTANT OTHERWISE YOU WON'T GET OUTPUT
      NODE_ENV: 'development',
    },
  })

  let url = ''
  await process.onStdout((m) => {
    let match = /Local:\s*(http.*)\//.exec(m)
    if (match) url = match[1]
    return Boolean(url)
  })

  await process.onStdout((m) => m.includes('server warmed up in'))

  await retryAssertion(async () => {
    let css = await fetchStyles(url)
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

    let css = await fetchStyles(url)
    expect(css).toContain(candidate`underline`)
    expect(css).toContain(candidate`font-bold`)
  })
})

test('build', SETUP, async ({ spawn, exec, expect }) => {
  await exec('pnpm nuxt build')
  // The Nuxt preview server does not automatically assign a free port if 3000
  // is taken, so we use a random port instead.
  let process = await spawn(`pnpm nuxt preview --port 8724`, {
    env: {
      TEST: 'false',
      NODE_ENV: 'development',
    },
  })

  let url = ''
  await process.onStdout((m) => {
    let match = /Listening on\s*(http.*)\/?/.exec(m)
    if (match) url = match[1].replace('http://[::]', 'http://127.0.0.1')
    return m.includes('Listening on')
  })

  await retryAssertion(async () => {
    let css = await fetchStyles(url)
    expect(css).toContain(candidate`underline`)
  })
})
