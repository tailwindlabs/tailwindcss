import { candidate, css, fetchStyles, js, json, retryAssertion, test, ts } from '../utils'

const WORKSPACE = {
  'package.json': json`
    {
      "type": "module",
      "dependencies": {
        "@solidjs/start": "^1",
        "solid-js": "^1",
        "vinxi": "^0",
        "@tailwindcss/vite": "workspace:^",
        "tailwindcss": "workspace:^"
      }
    }
  `,
  'jsconfig.json': json`
    {
      "compilerOptions": {
        "jsx": "preserve",
        "jsxImportSource": "solid-js"
      }
    }
  `,
  'app.config.js': ts`
    import { defineConfig } from '@solidjs/start/config'
    import tailwindcss from '@tailwindcss/vite'

    export default defineConfig({
      vite: {
        plugins: [tailwindcss()],
      },
    })
  `,
  'src/entry-server.jsx': js`
    // @refresh reload
    import { createHandler, StartServer } from '@solidjs/start/server'

    export default createHandler(() => (
      <StartServer
        document={({ assets, children, scripts }) => (
          <html lang="en">
            <head>{assets}</head>
            <body>
              <div id="app">{children}</div>
              {scripts}
            </body>
          </html>
        )}
      />
    ))
  `,
  'src/entry-client.jsx': js`
    // @refresh reload
    import { mount, StartClient } from '@solidjs/start/client'

    mount(() => <StartClient />, document.getElementById('app'))
  `,
  'src/app.jsx': js`
    import './app.css'
    export default function App() {
      return <h1 class="underline">Hello world!</h1>
    }
  `,
  'src/app.css': css`@import 'tailwindcss';`,
}

test(
  'dev mode',
  {
    fs: WORKSPACE,
  },
  async ({ fs, spawn, expect }) => {
    let process = await spawn('pnpm vinxi dev', {
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

    await retryAssertion(async () => {
      let css = await fetchStyles(url)
      expect(css).toContain(candidate`underline`)
    })

    await retryAssertion(async () => {
      await fs.write(
        'src/app.jsx',
        js`
          import './app.css'
          export default function App() {
            return <h1 class="underline font-bold">Hello world!</h1>
          }
        `,
      )

      let css = await fetchStyles(url)
      expect(css).toContain(candidate`underline`)
      expect(css).toContain(candidate`font-bold`)
    })
  },
)
