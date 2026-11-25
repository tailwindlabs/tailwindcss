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
    let process = await spawn('pnpm next dev')

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

// https://github.com/tailwindlabs/tailwindcss/issues/20659
test(
  '@tailwindcss/turbopack loader works with CSS modules (dev)',
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
        import styles from './page.module.css'

        export default function Page() {
          return <div className={styles.box + ' flex'}>Hello, Next.js!</div>
        }
      `,
      'app/page.module.css': css`
        @reference 'tailwindcss';

        .box {
          @apply underline;
        }
      `,
      'app/globals.css': css` @import 'tailwindcss'; `,
    },
  },
  async ({ spawn, expect }) => {
    let process = await spawn('pnpm next dev')

    let url = ''
    await process.onStdout((message) => {
      let match = /Local:\s*(http.*)/.exec(message)
      if (match) url = match[1]
      return Boolean(url)
    })

    await process.onStdout((message) => message.includes('Ready in'))

    await retryAssertion(async () => {
      let html = await fetch(url).then((response) => response.text())
      let className = /class="(\S*box\S*) flex"/.exec(html)?.[1]
      expect(className).toBeDefined()
      expect(className).not.toBe('box')

      let styles = await fetchStyles(url)
      expect(styles).toContain(candidate`flex`)
      expect(styles).toContain(`.${className}`)
      expect(styles).toContain('text-decoration-line: underline')
    })
  },
)

// https://github.com/tailwindlabs/tailwindcss/issues/20581
test(
  '@tailwindcss/turbopack loader picks up changes to the CSS file (dev)',
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
      'app/globals.css': css`
        @import 'tailwindcss';

        .custom-1 {
          color: red;
        }
      `,
    },
  },
  async ({ fs, spawn, expect }) => {
    let process = await spawn('pnpm next dev')

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
      expect(styles).toContain(candidate`custom-1`)
    })

    // Turbopack can run the loader with the previous version of the CSS file
    // first, which must not leave the served CSS one edit behind
    for (let i = 2; i <= 4; i++) {
      await fs.write(
        'app/globals.css',
        css`
          @import 'tailwindcss';

          .custom-${i} {
            color: red;
          }
        `,
      )

      await retryAssertion(async () => {
        let styles = await fetchStyles(url)
        expect(styles).toContain(candidate`flex`)
        expect(styles).toContain(candidate`custom-${i}`)
        expect(styles).not.toContain(candidate`custom-${i - 1}`)
      })
    }
  },
)

test(
  '@tailwindcss/turbopack loader watches files that a full rebuild adds (dev)',
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
              },
            },
          },
        }
      `,
      'app/layout.js': jsx`
        import '../styles/globals.css'

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
      // The styles are outside of `source(…)`, so only the loader can make
      // Turbopack watch them
      'styles/globals.css': css` @import 'tailwindcss' source('../app'); `,
      'styles/buttons.css': css`
        .btn-1 {
          color: red;
        }
      `,
    },
  },
  async ({ fs, spawn, expect }) => {
    let process = await spawn('pnpm next dev')

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
      expect(styles).not.toContain(candidate`btn-1`)
    })

    // Import a file that the previous build didn't know about
    await fs.write(
      'styles/globals.css',
      css`
        @import 'tailwindcss' source('../app');
        @import './buttons.css';
      `,
    )

    await retryAssertion(async () => {
      let styles = await fetchStyles(url)
      expect(styles).toContain(candidate`flex`)
      expect(styles).toContain(candidate`btn-1`)
    })

    // A change to the new file must cause a rebuild
    await fs.write(
      'styles/buttons.css',
      css`
        .btn-2 {
          color: red;
        }
      `,
    )

    await retryAssertion(async () => {
      let styles = await fetchStyles(url)
      expect(styles).toContain(candidate`flex`)
      expect(styles).toContain(candidate`btn-2`)
      expect(styles).not.toContain(candidate`btn-1`)
    })
  },
)

test(
  '@tailwindcss/turbopack loader with only @variant (dev)',
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
              },
            },
          },
        }
      `,
      'app/layout.js': jsx`
        import './globals.css'
        import './button.css'

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
          return <button className="btn flex">Hello, Next.js!</button>
        }
      `,
      'app/globals.css': css` @import 'tailwindcss'; `,
      'app/button.css': css`
        .btn {
          color: black;
          @variant hover {
            color: red;
          }
        }
      `,
    },
  },
  async ({ spawn, expect }) => {
    let process = await spawn('pnpm next dev')

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
      expect(styles).toContain('.btn')
      expect(styles).not.toContain('@variant')
      expect(styles).toContain('(hover: hover)')
    })
  },
)
