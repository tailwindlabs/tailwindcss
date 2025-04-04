import { describe } from 'vitest'
import { candidate, css, fetchStyles, js, json, jsx, retryAssertion, test, txt } from '../utils'

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
          @apply text-red-500 animate-ping skew-7;
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
      'color:var(--color-red-500,oklch(63.7% .237 25.331)',
      'animation:var(--animate-ping,ping 1s cubic-bezier(0,0,.2,1) infinite)',
      /@keyframes page_ping.*{75%,to{transform:scale\(2\);opacity:0}/,
      '--tw-skew-x:skewX(7deg);',
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
            @apply text-red-500 animate-ping skew-7 content-['module'];
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
        expect(css).toContain('--tw-skew-x: skewX(7deg);')
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

test(
  'changes to CSS files should pick up new CSS variables (if any)',
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
        export default function Page() {
          return <div className="flex"></div>
        }
      `,
      'unrelated.module.css': css`
        .module {
          color: var(--color-blue-500);
        }
      `,
      'app/globals.css': css`
        @import 'tailwindcss/theme';
        @import 'tailwindcss/utilities';
      `,
    },
  },
  async ({ spawn, exec, fs, expect }) => {
    // Generate the initial build so output CSS files exist on disk
    await exec('pnpm next build')

    // NOTE: We are writing to an output CSS file which is not being ignored by
    // `.gitignore` nor marked with `@source not`. This should not result in an
    // infinite loop.
    let process = await spawn(`pnpm next dev`)

    let url = ''
    await process.onStdout((m) => {
      let match = /Local:\s*(http.*)/.exec(m)
      if (match) url = match[1]
      return Boolean(url)
    })

    await process.onStdout((m) => m.includes('Ready in'))

    await retryAssertion(async () => {
      let css = await fetchStyles(url)
      expect(css).toContain(candidate`flex`)
      expect(css).toContain('--color-blue-500:')
      expect(css).not.toContain('--color-red-500:')
    })

    await fs.write(
      'unrelated.module.css',
      css`
        .module {
          color: var(--color-blue-500);
          background-color: var(--color-red-500);
        }
      `,
    )
    await process.onStdout((m) => m.includes('Compiled in'))

    await retryAssertion(async () => {
      let css = await fetchStyles(url)
      expect(css).toContain(candidate`flex`)
      expect(css).toContain('--color-blue-500:')
      expect(css).toContain('--color-red-500:')
    })
  },
)

test(
  'changes to `public/` should not trigger an infinite loop',
  {
    fs: {
      'package.json': json`
        {
          "dependencies": {
            "react": "^18",
            "react-dom": "^18",
            "next": "^15",
            "@ducanh2912/next-pwa": "^10.2.9"
          },
          "devDependencies": {
            "@tailwindcss/postcss": "workspace:^",
            "tailwindcss": "workspace:^"
          }
        }
      `,
      '.gitignore': txt`
        .next/
        public/workbox-*.js
        public/sw.js
      `,
      'postcss.config.mjs': js`
        export default {
          plugins: {
            '@tailwindcss/postcss': {},
          },
        }
      `,
      'next.config.mjs': js`
        import withPWA from '@ducanh2912/next-pwa'

        const pwaConfig = {
          dest: 'public',
          register: true,
          skipWaiting: true,
          reloadOnOnline: false,
          cleanupOutdatedCaches: true,
          clientsClaim: true,
          maximumFileSizeToCacheInBytes: 20 * 1024 * 1024,
        }

        const nextConfig = {}

        const configWithPWA = withPWA(pwaConfig)(nextConfig)

        export default configWithPWA
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
          return <div className="flex"></div>
        }
      `,
      'app/globals.css': css`
        @import 'tailwindcss/theme';
        @import 'tailwindcss/utilities';
      `,
    },
  },
  async ({ spawn, fs, expect }) => {
    let process = await spawn('pnpm next dev')

    let url = ''
    await process.onStdout((m) => {
      let match = /Local:\s*(http.*)/.exec(m)
      if (match) url = match[1]
      return Boolean(url)
    })

    await process.onStdout((m) => m.includes('Ready in'))

    await retryAssertion(async () => {
      let css = await fetchStyles(url)
      expect(css).toContain(candidate`flex`)
      expect(css).not.toContain(candidate`underline`)
    })

    await fs.write(
      'app/page.js',
      jsx`
        export default function Page() {
          return <div className="flex underline"></div>
        }
      `,
    )
    await process.onStdout((m) => m.includes('Compiled in'))

    await retryAssertion(async () => {
      let css = await fetchStyles(url)
      expect(css).toContain(candidate`flex`)
      expect(css).toContain(candidate`underline`)
    })
    // Flush all existing messages in the queue
    process.flush()

    // Fetch the styles one more time, to ensure we see the latest version of
    // the CSS
    await fetchStyles(url)

    // At this point, no changes should triger a compile step. If we see any
    // changes, there is an infinite loop because we (the user) didn't write any
    // files to disk.
    //
    // Ensure there are no more changes in stdout (signaling no infinite loop)
    let result = await Promise.race([
      // If this succeeds, it means that it saw another change which indicates
      // an infinite loop.
      process.onStdout((m) => m.includes('Compiled in')).then(() => 'infinite loop detected'),

      // There should be no changes in stdout
      new Promise((resolve) => setTimeout(() => resolve('no infinite loop detected'), 2_000)),
    ])
    expect(result).toBe('no infinite loop detected')
  },
)
