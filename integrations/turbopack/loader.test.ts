import { candidate, css, fetchStyles, js, json, jsx, retryAssertion, test } from '../utils'

test(
  '@tailwindcss/turbopack loader (dev)',
  {
    timeout: 120_000,
    fs: {
      'package.json': json`
        {
          "dependencies": {
            "next": "^16.2.7",
            "react": "^19.2.7",
            "react-dom": "^19.2.7",
            "tailwindcss": "workspace:^",
            "@tailwindcss/turbopack": "workspace:^"
          }
        }
      `,
      'next.config.mjs': js`
        export default {
          turbopack: {
            rules: {
              '*.css': {
                loaders: ['@tailwindcss/turbopack'],
                as: '*.css',
              },
            },
          },
        }
      `,
      'app/layout.js': jsx`
        import './globals.css'

        export default function RootLayout({ children }) {
          return (
            <html>
              <body>{children}</body>
            </html>
          )
        }
      `,
      'app/page.js': jsx`
        export default function Page() {
          return <div className="flex">Hello, Next.js!</div>
        }
      `,
      'app/globals.css': css` @import 'tailwindcss'; `,
    },
  },
  async ({ fs, spawn, expect }) => {
    let process = await spawn('pnpm next dev --turbopack')

    let url = ''
    await process.onStdout((message) => {
      let match = /Local:\s*(http.*)/.exec(message)
      if (match) url = match[1]
      return Boolean(url)
    })

    await process.onStdout((message) => message.includes('Ready in'))

    await retryAssertion(async () => {
      let styles = await fetchStyles(url)
      expect(styles).toContain(candidate`flex`)
      expect(styles).not.toContain(candidate`underline`)
    })

    await fs.write(
      'app/page.js',
      jsx`
        export default function Page() {
          return <div className="flex underline">Hello, Next.js!</div>
        }
      `,
    )

    await retryAssertion(async () => {
      let styles = await fetchStyles(url)
      expect(styles).toContain(candidate`flex`)
      expect(styles).toContain(candidate`underline`)
    })
  },
)
