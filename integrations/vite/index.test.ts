import path from 'node:path'
import { expect } from 'vitest'
import { candidate, css, fetchStylesFromIndex, html, js, json, test, ts, yaml } from '../utils'

test(
  'production build',
  {
    fs: {
      'package.json': json`{}`,
      'pnpm-workspace.yaml': yaml`
        #
        packages:
          - project-a
      `,
      'project-a/package.json': json`
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
      'project-a/vite.config.ts': ts`
        import tailwindcss from '@tailwindcss/vite'
        import { defineConfig } from 'vite'

        export default defineConfig({
          build: { cssMinify: false },
          plugins: [tailwindcss()],
        })
      `,
      'project-a/index.html': html`
        <head>
          <link rel="stylesheet" href="./src/index.css" />
        </head>
        <body>
          <div class="underline m-2">Hello, world!</div>
        </body>
      `,
      'project-a/src/index.css': css`
        @import 'tailwindcss/theme' theme(reference);
        @import 'tailwindcss/utilities';
        @source '../../project-b/src/**/*.js';
      `,
      'project-b/src/index.js': js`
        const className = "content-['project-b/src/index.js']"
        module.exports = { className }
      `,
    },
  },
  async ({ root, fs, exec }) => {
    await exec('pnpm vite build', { cwd: path.join(root, 'project-a') })

    let files = await fs.glob('project-a/dist/**/*.css')
    expect(files).toHaveLength(1)
    let [filename] = files[0]

    await fs.expectFileToContain(filename, [
      candidate`underline`,
      candidate`m-2`,
      candidate`content-['project-b/src/index.js']`,
    ])
  },
)

test(
  'dev mode',
  {
    fs: {
      'package.json': json`{}`,
      'pnpm-workspace.yaml': yaml`
        #
        packages:
          - project-a
      `,
      'project-a/package.json': json`
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
      'project-a/vite.config.ts': ts`
        import tailwindcss from '@tailwindcss/vite'
        import { defineConfig } from 'vite'

        export default defineConfig({
          build: { cssMinify: false },
          plugins: [tailwindcss()],
        })
      `,
      'project-a/index.html': html`
        <head>
          <link rel="stylesheet" href="./src/index.css" />
        </head>
        <body>
          <div class="underline">Hello, world!</div>
        </body>
      `,
      'project-a/src/index.css': css`
        @import 'tailwindcss/theme' theme(reference);
        @import 'tailwindcss/utilities';
        @source '../../project-b/src/**/*.js';
      `,
      'project-b/src/index.js': js`
        const className = "content-['project-b/src/index.js']"
        module.exports = { className }
      `,
    },
  },
  async ({ root, spawn, getFreePort, fs }) => {
    let port = await getFreePort()
    let process = await spawn(`pnpm vite dev --port ${port}`, {
      cwd: path.join(root, 'project-a'),
    })

    await process.onStdout((message) => message.includes('ready in'))

    let css = await fetchStylesFromIndex(port)
    expect(css).toContain(candidate`underline`)

    await fs.write(
      'project-a/index.html',
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

    css = await fetchStylesFromIndex(port)
    expect(css).toContain(candidate`m-2`)

    await fs.write(
      'project-b/src/index.js',
      js`
        const className = "[.changed_&]:content-['project-b/src/index.js']"
        module.exports = { className }
      `,
    )
    await process.onStdout((message) => message.includes('page reload'))

    css = await fetchStylesFromIndex(port)
    expect(css).toContain(candidate`[.changed_&]:content-['project-b/src/index.js']`)
  },
)
