import { expect } from 'vitest'
import { css, html, json, stripTailwindComment, test, ts } from '../utils'

async function fetchCSS(pathname: string, port: number) {
  const start = Date.now()
  let error
  while (Date.now() - start < 5000) {
    await new Promise((resolve) => setTimeout(resolve, 100))
    try {
      // We need to fetch the main index.html file to populate the list of
      // candidates.
      let body = await fetch(`http://localhost:${port}`)
      // Make sure the main request is garbage collected.
      body.blob()

      let response = await fetch(`http://localhost:${port}${pathname}`, {
        headers: {
          Accept: 'text/css',
        },
      })
      if (response.status === 200) {
        return response.text()
      }
    } catch (e) {
      error = e
    }
  }
  throw error
}

test(
  'builds with Vite',
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
            "vite": "^5.3.5"
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
          <link rel="stylesheet" href="./src/index.css">
        </head>
        <body>
          <div class="underline m-2">Hello, world!</div>
        </body>
      `,
      'src/index.css': css`
        @import 'tailwindcss/theme' reference;
        @import 'tailwindcss/utilities';
      `,
    },
  },
  async ({ fs, exec }) => {
    await exec('pnpm vite build')

    expect.assertions(2)
    for (let [path, content] of await fs.glob('dist/**/*.css')) {
      expect(path).toMatch(/\.css$/)
      expect(stripTailwindComment(content)).toMatchInlineSnapshot(
        `
        ".m-2 {
          margin: var(--spacing-2, .5rem);
        }

        .underline {
          text-decoration-line: underline;
        }"
      `,
      )
    }
  },
)

test(
  'works with Vite in dev mode',
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
            "vite": "^5.3.5"
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
          <link rel="stylesheet" href="./src/index.css">
        </head>
        <body>
          <div class="underline m-2">Hello, world!</div>
        </body>
      `,
      'src/index.css': css`
        @import 'tailwindcss/theme' reference;
        @import 'tailwindcss/utilities';
      `,
    },
  },
  async ({ spawn, getFreePort }) => {
    let port = await getFreePort()
    spawn(`pnpm vite dev --port ${port}`)

    const css = await fetchCSS('/src/index.css', port)

    expect(stripTailwindComment(css)).toMatchInlineSnapshot(
      `
      ".m-2 {
        margin: var(--spacing-2, 0.5rem);
      }
      .underline {
        text-decoration-line: underline;
      }"
    `,
    )
  },
)
