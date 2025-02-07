import { candidate, css, fetchStyles, html, js, retryAssertion, test, ts, txt } from '../utils'

const WORKSPACE = {
  fs: {
    'package.json': txt`
    {
      "type": "module",
      "dependencies": {
        "tailwind-merge": "^2",
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
      import { defineConfig } from 'vite'

      export default defineConfig({
        build: { cssMinify: false },
        plugins: [tailwindcss()],
      })
    `,
    'index.html': html`
      <head>
        <link rel="stylesheet" href="./src/index.css" />
        <script type="module" src="./src/index.js"></script>
      </head>
    `,
    'src/index.js': js`
      import { twMerge } from 'tailwind-merge'

      twMerge('underline')

      console.log('underline')
    `,
    'src/index.css': css`@import 'tailwindcss/utilities' layer(utilities);`,
  },
}

test(
  'does not scan tailwind-merge in production builds',
  WORKSPACE,
  async ({ fs, exec, expect }) => {
    await exec('pnpm vite build')

    let files = await fs.glob('dist/**/*.css')
    expect(files).toHaveLength(1)
    let [, content] = files[0]

    expect(content).toMatchInlineSnapshot(`
      "@layer utilities {
        .underline {
          text-decoration-line: underline;
        }
      }
      "
    `)
  },
)

test('does not scan tailwind-merge in dev builds', WORKSPACE, async ({ spawn, expect }) => {
  let process = await spawn('pnpm vite dev')
  await process.onStdout((m) => m.includes('ready in'))

  let url = ''
  await process.onStdout((m) => {
    let match = /Local:\s*(http.*)\//.exec(m)
    if (match) url = match[1]
    return Boolean(url)
  })

  await retryAssertion(async () => {
    let styles = await fetchStyles(url, '/index.html')

    expect(styles).not.toContain(candidate`flex`)
  })
})
