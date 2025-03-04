import { candidate, css, fetchStyles, html, json, retryAssertion, test, ts } from '../utils'

test(
  `production build`,
  {
    fs: {
      'package.json': json`
        {
          "type": "module",
          "dependencies": {
            "@tailwindcss/vite": "workspace:^",
            "tailwindcss": "workspace:^"
          },
          "devDependencies": {
            "vite": "^6"
          }
        }
      `,
      'vite.config.ts': ts`
        import tailwindcss from '@tailwindcss/vite'
        import path from 'node:path'
        import { defineConfig } from 'vite'

        export default defineConfig({
          build: {
            cssMinify: false,
            rollupOptions: {
              input: {
                root1: path.resolve(__dirname, 'root1.html'),
                root2: path.resolve(__dirname, 'root2.html'),
              },
            },
          },
          plugins: [tailwindcss()],
        })
      `,
      'root1.html': html`
        <head>
          <link rel="stylesheet" href="./src/root1.css" />
        </head>
        <body>
          <div class="one:underline two:underline">Hello, world!</div>
        </body>
      `,
      'src/shared.css': css`
        @reference 'tailwindcss/theme';
        @import 'tailwindcss/utilities';
      `,
      'src/root1.css': css`
        @import './shared.css';
        @custom-variant one (&:is([data-root='1']));
      `,
      'root2.html': html`
        <head>
          <link rel="stylesheet" href="./src/root2.css" />
        </head>
        <body>
          <div class="one:underline two:underline">Hello, world!</div>
        </body>
      `,
      'src/root2.css': css`
        @import './shared.css';
        @custom-variant two (&:is([data-root='2']));
      `,
    },
  },
  async ({ fs, exec, expect }) => {
    await exec('pnpm vite build')

    let files = await fs.glob('dist/**/*.css')
    expect(files).toHaveLength(2)

    let root1 = files.find(([filename]) => filename.includes('root1'))
    let root2 = files.find(([filename]) => filename.includes('root2'))

    expect(root1).toBeDefined()
    expect(root2).toBeDefined()

    expect(root1![1]).toContain(candidate`one:underline`)
    expect(root1![1]).not.toContain(candidate`two:underline`)

    expect(root2![1]).not.toContain(candidate`one:underline`)
    expect(root2![1]).toContain(candidate`two:underline`)
  },
)

test(
  'dev mode',
  {
    fs: {
      'package.json': json`
        {
          "type": "module",
          "dependencies": {
            "@tailwindcss/vite": "workspace:^",
            "tailwindcss": "workspace:^"
          },
          "devDependencies": {
            "vite": "^6"
          }
        }
      `,
      'vite.config.ts': ts`
        import tailwindcss from '@tailwindcss/vite'
        import path from 'node:path'
        import { defineConfig } from 'vite'

        export default defineConfig({
          build: { cssMinify: false },
          plugins: [tailwindcss()],
        })
      `,
      'root1.html': html`
        <head>
          <link rel="stylesheet" href="./src/root1.css" />
        </head>
        <body>
          <div class="one:underline two:underline">Hello, world!</div>
        </body>
      `,
      'src/shared.css': css`
        @reference 'tailwindcss/theme';
        @import 'tailwindcss/utilities';
      `,
      'src/root1.css': css`
        @import './shared.css';
        @custom-variant one (&:is([data-root='1']));
      `,
      'root2.html': html`
        <head>
          <link rel="stylesheet" href="./src/root2.css" />
        </head>
        <body>
          <div class="one:underline two:underline">Hello, world!</div>
        </body>
      `,
      'src/root2.css': css`
        @import './shared.css';
        @custom-variant two (&:is([data-root='2']));
      `,
    },
  },
  async ({ spawn, expect }) => {
    let process = await spawn('pnpm vite dev')
    await process.onStdout((m) => m.includes('ready in'))

    let url = ''
    await process.onStdout((m) => {
      let match = /Local:\s*(http.*)\//.exec(m)
      if (match) url = match[1]
      return Boolean(url)
    })

    // Candidates are resolved lazily, so the first visit of index.html
    // will only have candidates from this file.
    await retryAssertion(async () => {
      let styles = await fetchStyles(url, '/root1.html')
      expect(styles).toContain(candidate`one:underline`)
      expect(styles).not.toContain(candidate`two:underline`)
    })

    // Going to about.html will extend the candidate list to include
    // candidates from about.html.
    await retryAssertion(async () => {
      let styles = await fetchStyles(url, '/root2.html')
      expect(styles).not.toContain(candidate`one:underline`)
      expect(styles).toContain(candidate`two:underline`)
    })
  },
)
