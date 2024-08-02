import { expect } from 'vitest'
import { css, html, json, stripTailwindComment, test, ts } from '../utils'

async function fetchCSS(pathname: string, port: number) {
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
  return response.text()
}

test(
  'works with production builds',
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
          <link rel="stylesheet" href="./src/index.css" />
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

    let files = await fs.glob('dist/**/*.css')
    expect(files).toHaveLength(1)
    let [, content] = files[0]
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
  },
)

test(
  'works with dev builds and live reloads',
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
          <link rel="stylesheet" href="./src/index.css" />
        </head>
        <body>
          <div class="underline">Hello, world!</div>
        </body>
      `,
      'src/index.css': css`
        @import 'tailwindcss/theme' reference;
        @import 'tailwindcss/utilities';
      `,
    },
  },
  async ({ spawn, getFreePort, fs }) => {
    let port = await getFreePort()
    let process = await spawn(`pnpm vite dev --port ${port}`)

    await process.onStdout((message) => message.includes('ready in'))

    let css = await fetchCSS('/src/index.css', port)
    expect(stripTailwindComment(css)).toMatchInlineSnapshot(
      `
      ".underline {
        text-decoration-line: underline;
      }"
    `,
    )

    await fs.write(
      'index.html',
      html`
        <head>
          <link rel="stylesheet" href="./src/index.css" />
        </head>
        <body>
          <div class="underline m-2">Hello, world!</div>
        </body>
      `,
    )
    await process.onStdout((message) => message.includes('page reload'))

    css = await fetchCSS('/src/index.css', port)
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
