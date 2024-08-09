import { expect } from 'vitest'
import { candidate, css, js, json, test } from '../utils'

test(
  'production build',
  {
    fs: {
      'package.json': json`
        {
          "dependencies": {
            "react": "^18",
            "react-dom": "^18",
            "next": "14.2.5"
          },
          "devDependencies": {
            "@tailwindcss/postcss": "workspace:^",
            "tailwindcss": "workspace:^"
          }
        }
      `,
      'postcss.config.mjs': js`
        /** @type {import('postcss-load-config').Config} */
        const config = {
          plugins: {
            '@tailwindcss/postcss': {},
          },
        }

        export default config
      `,
      'next.config.mjs': js`
        /** @type {import('next').NextConfig} */
        const nextConfig = {}

        export default nextConfig
      `,
      'app/layout.js': js`
        import './globals.css'

        export default function RootLayout({ children }) {
          return (
            <html>
              <body>{children}</body>
            </html>
          )
        }
      `,
      'app/page.js': js`
        export default function Page() {
          return <h1 className="text-3xl font-bold underline">Hello, Next.js!</h1>
        }
      `,
      'app/globals.css': css`
        @import 'tailwindcss/theme' theme(reference);
        @import 'tailwindcss/utilities';
      `,
    },
  },
  async ({ fs, exec }) => {
    await exec('pnpm next build')

    let files = await fs.glob('.next/static/css/**/*.css')
    expect(files).toHaveLength(1)
    let [filename] = files[0]

    await fs.expectFileToContain(filename, [
      candidate`underline`,
      candidate`font-bold`,
      candidate`text-3xl`,
    ])
  },
)

test(
  'dev mode',
  {
    fs: {
      'package.json': json`
        {
          "dependencies": {
            "react": "^18",
            "react-dom": "^18",
            "next": "14.2.5"
          },
          "devDependencies": {
            "@tailwindcss/postcss": "workspace:^",
            "tailwindcss": "workspace:^"
          }
        }
      `,
      'postcss.config.mjs': js`
        /** @type {import('postcss-load-config').Config} */
        const config = {
          plugins: {
            '@tailwindcss/postcss': {},
          },
        }

        export default config
      `,
      'next.config.mjs': js`
        /** @type {import('next').NextConfig} */
        const nextConfig = {}

        export default nextConfig
      `,
      'app/layout.js': js`
        import './globals.css'

        export default function RootLayout({ children }) {
          return (
            <html>
              <body>{children}</body>
            </html>
          )
        }
      `,
      'app/page.js': js`
        export default function Page() {
          return <h1 className="underline">Hello, Next.js!</h1>
        }
      `,
      'app/globals.css': css`
        @import 'tailwindcss/theme' theme(reference);
        @import 'tailwindcss/utilities';
      `,
    },
  },
  async ({ fs, spawn, getFreePort }) => {
    let port = await getFreePort()
    let process = await spawn(`pnpm next dev --port ${port}`)

    await process.onStdout((message) => message.includes('Ready in'))

    let css = await fetchCSS('/_next/static/css/app/layout.css', port)
    expect(css).toContain(candidate`underline`)

    await fs.write(
      'app/page.js',
      js`
        export default function Page() {
          return <h1 className="underline text-red-500">Hello, Next.js!</h1>
        }
      `,
    )
    await process.onStdout((message) => message.includes('Compiled in'))

    css = await fetchCSS('/_next/static/css/app/layout.css', port)
    expect(css).toContain(candidate`underline`)
    expect(css).toContain(candidate`text-red-500`)
  },
)

async function fetchCSS(path: string, port: number) {
  // We need to fetch the main index.html file, to simulate a real browser.
  let body = await fetch(`http://localhost:${port}`)
  // Make sure the main request is garbage collected.
  body.blob()

  let response = await fetch(`http://localhost:${port}${path}`, {
    headers: {
      Accept: 'text/css',
    },
  })
  let text = await response.text()
  return text
}
