import { candidate, css, fetchStyles, html, json, retryAssertion, test, ts, txt } from '../utils'

test(
  'dev mode',
  {
    fs: {
      'package.json': json`
        {
          "type": "module",
          "dependencies": {
            "preact": "^10"
          },
          "devDependencies": {
            "@preact/preset-vite": "^2",
            "@tailwindcss/vite": "workspace:^",
            "tailwindcss": "workspace:^",
            "vite": "^8"
          }
        }
      `,
      'vite.config.ts': ts`
        import fs from 'node:fs'
        import path from 'node:path'
        import preact from '@preact/preset-vite'
        import tailwindcss from '@tailwindcss/vite'
        import { defineConfig } from 'vite'

        export default defineConfig({
          plugins: [
            tailwindcss(),
            preact(),
            {
              // Log all HMR payloads to a file so the test can assert on them
              name: 'hmr-wiretap',
              configureServer(server) {
                let logFile = path.resolve('hmr.log')
                fs.writeFileSync(logFile, '')
                for (let environment of Object.values(server.environments)) {
                  let send = environment.hot.send.bind(environment.hot)
                  environment.hot.send = (payload) => {
                    fs.appendFileSync(logFile, JSON.stringify(payload) + '\\n')
                    return send(payload)
                  }
                }
              },
            },
          ],
        })
      `,
      'index.html': html`
        <html>
          <head>
            <link rel="stylesheet" href="./src/index.css" />
          </head>
          <body>
            <div id="app"></div>
            <script type="module" src="./src/main.tsx"></script>
          </body>
        </html>
      `,
      'src/main.tsx': ts`
        import { render } from 'preact'
        import { App } from './app'

        render(<App />, document.getElementById('app')!)
      `,
      'src/app.tsx': ts`
        import { useState } from 'preact/hooks'

        export function App() {
          const [count, setCount] = useState(0)
          return (
            <button className="underline" onClick={() => setCount((c) => c + 1)}>
              Count: {count}
            </button>
          )
        }
      `,
      'src/index.css': css`@import 'tailwindcss';`,
    },
  },
  async ({ fs, spawn, expect }) => {
    let process = await spawn('pnpm vite dev')
    await process.onStdout((m) => m.includes('ready in'))

    let url = ''
    await process.onStdout((m) => {
      let match = /Local:\s*(http.*)\//.exec(m)
      if (match) url = match[1]
      return Boolean(url)
    })

    await retryAssertion(async () => {
      let styles = await fetchStyles(url)
      expect(styles).toContain(candidate`underline`)
    })

    // Load the component modules, like a browser visiting the page would
    await fetch(`${url}/src/main.tsx`)
    await fetch(`${url}/src/app.tsx`)

    // Editing a component keeps HMR intact: new classes are delivered through
    // a regular update, not a full page reload (which would lose all state)
    {
      await fs.write(
        'src/app.tsx',
        ts`
          import { useState } from 'preact/hooks'

          export function App() {
            const [count, setCount] = useState(0)
            return (
              <button className="underline flex" onClick={() => setCount((c) => c + 1)}>
                Count: {count}
              </button>
            )
          }
        `,
      )

      await retryAssertion(async () => {
        let styles = await fetchStyles(url)
        expect(styles).toContain(candidate`underline`)
        expect(styles).toContain(candidate`flex`)
      })
      expect(await fs.read('hmr.log')).toContain('"type":"update"')
      expect(await fs.read('hmr.log')).not.toContain('full-reload')
    }

    // Changing a scanned file that is not part of the module graph (e.g.
    // `package.json`, which package managers and other tooling write to while
    // the dev server is running) should not trigger a full reload either —
    // that would destroy client state. New candidates should still be picked
    // up because the file is a watch dependency of the CSS root, so the CSS
    // hot-updates through Vite's regular pipeline.
    //
    // https://github.com/tailwindlabs/tailwindcss/issues/20411
    {
      await fs.write(
        'package.json',
        txt`
          {
            "type": "module",
            "description": "content-['package.json']",
            "dependencies": {
              "preact": "^10"
            },
            "devDependencies": {
              "@preact/preset-vite": "^2",
              "@tailwindcss/vite": "workspace:^",
              "tailwindcss": "workspace:^",
              "vite": "^8"
            }
          }
        `,
      )

      await retryAssertion(async () => {
        let styles = await fetchStyles(url)
        expect(styles).toContain(candidate`content-['package.json']`)
      })
      expect(await fs.read('hmr.log')).not.toContain('full-reload')
    }
  },
)
