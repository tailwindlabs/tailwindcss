import path from 'node:path'
import { describe, expect } from 'vitest'
import {
  candidate,
  css,
  fetchStyles,
  html,
  js,
  json,
  retryAssertion,
  test,
  ts,
  yaml,
} from '../utils'
;['postcss', 'lightningcss'].forEach((transformer) => {
  describe.concurrent(transformer, () => {
    test(
      `production build`,
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
              css: ${transformer === 'postcss' ? '{}' : "{ transformer: 'lightningcss' }"},
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
      `dev mode`,
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
              css: ${transformer === 'postcss' ? '{}' : "{ transformer: 'lightningcss' }"},
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
          'project-a/about.html': html`
          <head>
              <link rel="stylesheet" href="./src/index.css" />
            </head>
            <body>
              <div class="font-bold">Tailwind Labs</div>
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
        await spawn(`pnpm vite dev --port ${port}`, {
          cwd: path.join(root, 'project-a'),
        })

        // Candidates are resolved lazily, so the first visit of index.html
        // will only have candidates from this file.
        await retryAssertion(async () => {
          let css = await fetchStyles(port, '/index.html')
          expect(css).toContain(candidate`underline`)
          expect(css).not.toContain(candidate`font-bold`)
        })

        // Going to about.html will extend the candidate list to include
        // candidates from about.html.
        await retryAssertion(async () => {
          let css = await fetchStyles(port, '/about.html')
          expect(css).toContain(candidate`underline`)
          expect(css).toContain(candidate`font-bold`)
        })

        // Updates are additive and cause new candidates to be added.
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
        await retryAssertion(async () => {
          let css = await fetchStyles(port)
          expect(css).toContain(candidate`underline`)
          expect(css).toContain(candidate`font-bold`)
          expect(css).toContain(candidate`m-2`)
        })

        // Manually added `@source`s are watched and trigger a rebuild
        await fs.write(
          'project-b/src/index.js',
          js`
            const className = "[.changed_&]:content-['project-b/src/index.js']"
            module.exports = { className }
          `,
        )
        await retryAssertion(async () => {
          let css = await fetchStyles(port)
          expect(css).toContain(candidate`underline`)
          expect(css).toContain(candidate`font-bold`)
          expect(css).toContain(candidate`m-2`)
          expect(css).toContain(candidate`[.changed_&]:content-['project-b/src/index.js']`)
        })

        // After updates to the CSS file, all previous candidates should still be in
        // the generated CSS
        await fs.write(
          'project-a/src/index.css',
          css`
            ${await fs.read('project-a/src/index.css')}

            .red {
              color: red;
            }
          `,
        )
        await retryAssertion(async () => {
          let css = await fetchStyles(port)
          expect(css).toContain(candidate`red`)
          expect(css).toContain(candidate`m-2`)
          expect(css).toContain(candidate`underline`)
          expect(css).toContain(candidate`[.changed_&]:content-['project-b/src/index.js']`)
          expect(css).toContain(candidate`font-bold`)
        })
      },
    )

    test(
      'watch mode',
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
      async ({ root, spawn, fs }) => {
        await spawn(`pnpm vite build --watch`, {
          cwd: path.join(root, 'project-a'),
        })

        let filename = ''
        await retryAssertion(async () => {
          let files = await fs.glob('project-a/dist/**/*.css')
          expect(files).toHaveLength(1)
          filename = files[0][0]
        })

        await fs.expectFileToContain(filename, [candidate`underline`])

        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Updates are additive and cause new candidates to be added.
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
        await retryAssertion(async () => {
          let files = await fs.glob('project-a/dist/**/*.css')
          expect(files).toHaveLength(1)
          let [, css] = files[0]
          expect(css).toContain(candidate`underline`)
          expect(css).toContain(candidate`m-2`)
        })

        // Manually added `@source`s are watched and trigger a rebuild
        await fs.write(
          'project-b/src/index.js',
          js`
            const className = "[.changed_&]:content-['project-b/src/index.js']"
            module.exports = { className }
          `,
        )
        await retryAssertion(async () => {
          let files = await fs.glob('project-a/dist/**/*.css')
          expect(files).toHaveLength(1)
          let [, css] = files[0]
          expect(css).toContain(candidate`underline`)
          expect(css).toContain(candidate`m-2`)
          expect(css).toContain(candidate`[.changed_&]:content-['project-b/src/index.js']`)
        })

        // After updates to the CSS file, all previous candidates should still be in
        // the generated CSS
        await fs.write(
          'project-a/src/index.css',
          css`
            ${await fs.read('project-a/src/index.css')}

            .red {
              color: red;
            }
          `,
        )
        await retryAssertion(async () => {
          let files = await fs.glob('project-a/dist/**/*.css')
          expect(files).toHaveLength(1)
          let [, css] = files[0]
          expect(css).toContain(candidate`underline`)
          expect(css).toContain(candidate`m-2`)
          expect(css).toContain(candidate`[.changed_&]:content-['project-b/src/index.js']`)
          expect(css).toContain(candidate`red`)
        })
      },
    )
  })
})
