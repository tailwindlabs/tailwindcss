import { candidate, css, fetchStyles, json, retryAssertion, test, ts } from '../utils'

test(
  'dev mode',
  {
    fs: {
      'package.json': json`
        {
          "type": "module",
          "dependencies": {
            "@builder.io/qwik": "^1",
            "@builder.io/qwik-city": "^1",
            "vite": "^5",
            "@tailwindcss/vite": "workspace:^",
            "tailwindcss": "workspace:^"
          }
        }
      `,
      'vite.config.ts': ts`
        import { defineConfig } from 'vite'
        import { qwikVite } from '@builder.io/qwik/optimizer'
        import { qwikCity } from '@builder.io/qwik-city/vite'
        import tailwindcss from '@tailwindcss/vite'

        export default defineConfig(() => {
          return {
            plugins: [tailwindcss(), qwikCity(), qwikVite()],
          }
        })
      `,
      'src/root.tsx': ts`
        import { component$ } from '@builder.io/qwik'
        import { QwikCityProvider, RouterOutlet } from '@builder.io/qwik-city'

        import './global.css'

        export default component$(() => {
          return (
            <QwikCityProvider>
              <head></head>
              <body>
                <RouterOutlet />
              </body>
            </QwikCityProvider>
          )
        })
      `,
      'src/global.css': css`@import 'tailwindcss/utilities.css';`,
      'src/entry.ssr.tsx': ts`
        import { renderToStream, type RenderToStreamOptions } from '@builder.io/qwik/server'
        import Root from './root'

        export default function (opts: RenderToStreamOptions) {
          return renderToStream(<Root />, opts)
        }
      `,
      'src/routes/index.tsx': ts`
        import { component$ } from '@builder.io/qwik'

        export default component$(() => {
          return <h1 class="underline">Hello World!</h1>
        })
      `,
    },
  },
  async ({ fs, spawn, expect }) => {
    let process = await spawn('pnpm vite --mode ssr')
    await process.onStdout((m) => m.includes('ready in'))

    let url = ''
    await process.onStdout((m) => {
      console.log(m)
      let match = /Local:\s*(http.*)\//.exec(m)
      if (match) url = match[1]
      return Boolean(url)
    })

    await retryAssertion(async () => {
      let css = await fetchStyles(url)
      expect(css).toContain(candidate`underline`)
    })

    await retryAssertion(async () => {
      await fs.write(
        'src/routes/index.tsx',
        ts`
          import { component$ } from '@builder.io/qwik'

          export default component$(() => {
            return <h1 class="underline flex">Hello World!</h1>
          })
        `,
      )

      let css = await fetchStyles(url)
      expect(css).toContain(candidate`underline`)
      expect(css).toContain(candidate`flex`)
    })
  },
)
