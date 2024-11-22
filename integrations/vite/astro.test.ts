import { candidate, fetchStyles, html, json, retryAssertion, test, ts } from '../utils'

test(
  'dev mode',
  {
    fs: {
      'package.json': json`
        {
          "type": "module",
          "dependencies": {
            "astro": "^4.15.2",
            "@tailwindcss/vite": "workspace:^",
            "tailwindcss": "workspace:^"
          }
        }
      `,
      'astro.config.mjs': ts`
        import tailwindcss from '@tailwindcss/vite'
        import { defineConfig } from 'astro/config'

        // https://astro.build/config
        export default defineConfig({
          vite: {
            plugins: [tailwindcss()],
          },
        })
      `,
      'src/pages/index.astro': html`
       <div class="underline">Hello, world!</div>

        <style is:global>
          @import 'tailwindcss';
        </style>
      `,
    },
  },
  async ({ fs, spawn, getFreePort, expect }) => {
    let port = await getFreePort()
    await spawn(`pnpm astro dev --port ${port}`)

    await retryAssertion(async () => {
      let css = await fetchStyles(port)
      expect(css).toContain(candidate`underline`)
    })

    await retryAssertion(async () => {
      await fs.write(
        'src/pages/index.astro',
        html`
          <div class="underline font-bold">Hello, world!</div>

          <style is:global>
            @import 'tailwindcss';
          </style>
      `,
      )

      let css = await fetchStyles(port)
      expect(css).toContain(candidate`underline`)
      expect(css).toContain(candidate`font-bold`)
    })
  },
)
