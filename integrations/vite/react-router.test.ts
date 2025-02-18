import { candidate, css, fetchStyles, json, retryAssertion, test, ts, txt } from '../utils'

const WORKSPACE = {
  'package.json': json`
    {
      "type": "module",
      "dependencies": {
        "@react-router/dev": "^7",
        "@react-router/node": "^7",
        "@react-router/serve": "^7",
        "@tailwindcss/vite": "workspace:^",
        "@types/node": "^20",
        "@types/react-dom": "^19",
        "@types/react": "^19",
        "isbot": "^5",
        "react-dom": "^19",
        "react-router": "^7",
        "react": "^19",
        "tailwindcss": "workspace:^",
        "vite": "^5"
      }
    }
  `,
  'react-router.config.ts': ts`
    import type { Config } from '@react-router/dev/config'
    export default { ssr: true } satisfies Config
  `,
  'vite.config.ts': ts`
    import { defineConfig } from 'vite'
    import { reactRouter } from '@react-router/dev/vite'
    import tailwindcss from '@tailwindcss/vite'

    export default defineConfig({
      plugins: [tailwindcss(), reactRouter()],
    })
  `,
  'app/routes/home.tsx': ts`
    export default function Home() {
      return <h1 className="font-bold">Welcome to React Router</h1>
    }
  `,
  'app/app.css': css`@import 'tailwindcss';`,
  'app/routes.ts': ts`
    import { type RouteConfig, index } from '@react-router/dev/routes'
    export default [index('routes/home.tsx')] satisfies RouteConfig
  `,
  'app/root.tsx': ts`
    import { Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router'
    import './app.css'
    export function Layout({ children }: { children: React.ReactNode }) {
      return (
        <html lang="en">
          <head>
            <meta charSet="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <Meta />
            <Links />
          </head>
          <body>
            {children}
            <ScrollRestoration />
            <Scripts />
          </body>
        </html>
      )
    }

    export default function App() {
      return <Outlet />
    }
  `,
}

test('dev mode', { fs: WORKSPACE }, async ({ fs, spawn, expect }) => {
  let process = await spawn('pnpm react-router dev')

  let url = ''
  await process.onStdout((m) => {
    let match = /Local:\s*(http.*)\//.exec(m)
    if (match) url = match[1]
    return Boolean(url)
  })

  await retryAssertion(async () => {
    let css = await fetchStyles(url)
    expect(css).toContain(candidate`font-bold`)
  })

  await retryAssertion(async () => {
    await fs.write(
      'app/routes/home.tsx',
      ts`
        export default function Home() {
          return <h1 className="font-bold underline">Welcome to React Router</h1>
        }
      `,
    )

    let css = await fetchStyles(url)
    expect(css).toContain(candidate`underline`)
    expect(css).toContain(candidate`font-bold`)
  })
})

test('build mode', { fs: WORKSPACE }, async ({ spawn, exec, expect }) => {
  await exec('pnpm react-router build')
  let process = await spawn('pnpm react-router-serve ./build/server/index.js')

  let url = ''
  await process.onStdout((m) => {
    let match = /\[react-router-serve\]\s*(http.*)\ \/?/.exec(m)
    if (match) url = match[1]
    return url != ''
  })

  await retryAssertion(async () => {
    let css = await fetchStyles(url)
    expect(css).toContain(candidate`font-bold`)
  })
})

test(
  'build mode using ?url stylesheet imports should only build one stylesheet (requires `file-system` scanner)',
  {
    fs: {
      ...WORKSPACE,
      'app/root.tsx': ts`
        import { Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router'
        import styles from './app.css?url'
        export const links: Route.LinksFunction = () => [{ rel: 'stylesheet', href: styles }]
        export function Layout({ children }: { children: React.ReactNode }) {
          return (
            <html lang="en">
              <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <Meta />
                <Links />
              </head>
              <body class="dark">
                {children}
                <ScrollRestoration />
                <Scripts />
              </body>
            </html>
          )
        }

        export default function App() {
          return <Outlet />
        }
      `,
      'vite.config.ts': ts`
        import { defineConfig } from 'vite'
        import { reactRouter } from '@react-router/dev/vite'
        import tailwindcss from '@tailwindcss/vite'

        export default defineConfig({
          plugins: [tailwindcss(), reactRouter()],
        })
      `,
      '.gitignore': txt`
        node_modules/
        build/
      `,
    },
  },
  async ({ fs, exec, expect }) => {
    await exec('pnpm react-router build')

    let files = await fs.glob('build/client/assets/**/*.css')

    expect(files).toHaveLength(1)
    let [filename] = files[0]

    await fs.expectFileToContain(filename, [candidate`font-bold`])
  },
)
