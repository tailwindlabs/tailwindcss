import { expect } from 'vitest'
import { candidate, css, fetchStylesFromIndex, js, json, test } from '../utils'

test(
  'production build',
  {
    fs: {
      'package.json': json`
        {
          "dependencies": {
            "react": "^18",
            "react-dom": "^18",
            "next": "^14"
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
;['turbo', 'webpack'].forEach((bundler) => {
  test(
    `dev mode (${bundler})`,
    {
      fs: {
        'package.json': json`
          {
            "dependencies": {
              "react": "^18",
              "react-dom": "^18",
              "next": "^14"
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
      let process = await spawn(
        `pnpm next dev ${bundler === 'turbo' ? '--turbo' : ''} --port ${port}`,
      )

      await process.onStdout((message) => message.includes('Ready in'))

      let css = await fetchStylesFromIndex(port)
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

      css = await fetchStylesFromIndex(port)
      expect(css).toContain(candidate`underline`)
      expect(css).toContain(candidate`text-red-500`)
    },
  )
})
