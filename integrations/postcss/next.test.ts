import { describe } from 'vitest'
import { candidate, css, fetchStyles, js, json, retryAssertion, test } from '../utils'

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
        export default {
          plugins: {
            '@tailwindcss/postcss': {},
          },
        }
      `,
      'next.config.mjs': js`export default {}`,
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
        import styles from './page.module.css'
        export default function Page() {
          return (
            <h1 className={styles.heading + ' text-3xl font-bold underline'}>Hello, Next.js!</h1>
          )
        }
      `,
      'app/page.module.css': css`
        @reference './globals.css';
        .heading {
          @apply text-red-500 animate-ping;
        }
      `,
      'app/globals.css': css`
        @reference 'tailwindcss/theme';
        @import 'tailwindcss/utilities';
      `,
    },
  },
  async ({ fs, exec, expect }) => {
    await exec('pnpm next build')

    let files = await fs.glob('.next/static/css/**/*.css')
    expect(files).toHaveLength(2)

    let globalCss: string | null = null
    let moduleCss: string | null = null
    for (let [filename, content] of files) {
      if (content.includes('@keyframes page_ping')) moduleCss = filename
      else globalCss = filename
    }

    await fs.expectFileToContain(globalCss!, [
      candidate`underline`,
      candidate`font-bold`,
      candidate`text-3xl`,
    ])

    await fs.expectFileToContain(moduleCss!, [
      'color:var(--color-red-500,oklch(.637 .237 25.331)',
      'animation:var(--animate-ping,ping 1s cubic-bezier(0,0,.2,1) infinite)',
      /@keyframes page_ping.*{75%,to{transform:scale\(2\);opacity:0}/,
    ])
  },
)

describe.each(['turbo', 'webpack'])('%s', (bundler) => {
  test(
    'dev mode',
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
          export default {
            plugins: {
              '@tailwindcss/postcss': {},
            },
          }
        `,
        'next.config.mjs': js`export default {}`,
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
          import styles from './page.module.css'
          export default function Page() {
            return <h1 className={styles.heading + ' underline'}>Hello, Next.js!</h1>
          }
        `,
        'app/page.module.css': css`
          @reference './globals.css';
          .heading {
            @apply text-red-500 animate-ping content-['module'];
          }
        `,
        'app/globals.css': css`
          @reference 'tailwindcss/theme';
          @import 'tailwindcss/utilities';
        `,
      },
    },
    async ({ fs, spawn, expect }) => {
      let process = await spawn(`pnpm next dev ${bundler === 'turbo' ? '--turbo' : ''}`)

      let url = ''
      await process.onStdout((m) => {
        let match = /Local:\s*(http.*)/.exec(m)
        if (match) url = match[1]
        return Boolean(url)
      })

      await process.onStdout((m) => m.includes('Ready in'))

      await retryAssertion(async () => {
        let css = await fetchStyles(url)
        expect(css).toContain(candidate`underline`)
        expect(css).toContain('content: var(--tw-content)')
        expect(css).toContain('@keyframes')
      })

      await fs.write(
        'app/page.js',
        js`
          import styles from './page.module.css'
          export default function Page() {
            return <h1 className={styles.heading + ' underline bg-red-500'}>Hello, Next.js!</h1>
          }
        `,
      )
      await process.onStdout((m) => m.includes('Compiled in'))

      await retryAssertion(async () => {
        let css = await fetchStyles(url)
        expect(css).toContain(candidate`underline`)
        expect(css).toContain(candidate`bg-red-500`)
        expect(css).toContain('content: var(--tw-content)')
        expect(css).toContain('@keyframes')
      })
    },
  )
})

test(
  'should scan dynamic route segments',
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
        export default {
          plugins: {
            '@tailwindcss/postcss': {},
          },
        }
      `,
      'next.config.mjs': js`export default {}`,
      'app/a/[slug]/page.js': js`
        export default function Page() {
          return <h1 className="content-['[slug]']">Hello, Next.js!</h1>
        }
      `,
      'app/b/[...slug]/page.js': js`
        export default function Page() {
          return <h1 className="content-['[...slug]']">Hello, Next.js!</h1>
        }
      `,
      'app/c/[[...slug]]/page.js': js`
        export default function Page() {
          return <h1 className="content-['[[...slug]]']">Hello, Next.js!</h1>
        }
      `,
      'app/d/(theme)/page.js': js`
        export default function Page() {
          return <h1 className="content-['(theme)']">Hello, Next.js!</h1>
        }
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
      'app/globals.css': css`
        @import 'tailwindcss/utilities' source(none);
        @source './**/*.{js,ts,jsx,tsx,mdx}';
      `,
    },
  },
  async ({ fs, exec, expect }) => {
    await exec('pnpm next build')

    let files = await fs.glob('.next/static/css/**/*.css')
    expect(files).toHaveLength(1)
    let [filename] = files[0]

    await fs.expectFileToContain(filename, [
      candidate`content-['[slug]']`,
      candidate`content-['[...slug]']`,
      candidate`content-['[[...slug]]']`,
      candidate`content-['(theme)']`,
    ])
  },
)
