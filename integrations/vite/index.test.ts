import path from 'node:path'
import { describe } from 'vitest'
import { candidate, css, html, js, json, retryAssertion, test, ts, txt, yaml } from '../utils'

describe.each(['postcss', 'lightningcss'])('%s', (transformer) => {
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
        'project-a/package.json': txt`
          {
            "type": "module",
            "dependencies": {
              "@tailwindcss/vite": "workspace:^",
              "tailwindcss": "workspace:^"
            },
            "devDependencies": {
              ${transformer === 'lightningcss' ? `"lightningcss": "^1.26.0",` : ''}
              "vite": "^6"
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
        'project-a/tailwind.config.js': js`
          export default {
            content: ['../project-b/src/**/*.js'],
          }
        `,
        'project-a/src/index.css': css`
          @import 'tailwindcss/theme' theme(reference);
          @import 'tailwindcss/utilities';
          @config '../tailwind.config.js';
          @source '../../project-b/src/**/*.html';
        `,
        'project-b/src/index.html': html`
          <div class="flex" />
        `,
        'project-b/src/index.js': js`
          const className = "content-['project-b/src/index.js']"
          module.exports = { className }
        `,
      },
    },
    async ({ root, fs, exec, expect }) => {
      await exec('pnpm vite build', { cwd: path.join(root, 'project-a') })

      let files = await fs.glob('project-a/dist/**/*.css')
      expect(files).toHaveLength(1)
      let [filename] = files[0]

      await fs.expectFileToContain(filename, [
        candidate`underline`,
        candidate`m-2`,
        candidate`flex`,
        candidate`content-['project-b/src/index.js']`,
      ])
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
        'project-a/package.json': txt`
          {
            "type": "module",
            "dependencies": {
              "@tailwindcss/vite": "workspace:^",
              "tailwindcss": "workspace:^"
            },
            "devDependencies": {
              ${transformer === 'lightningcss' ? `"lightningcss": "^1.26.0",` : ''}
              "vite": "^6"
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
            <div class="underline text-primary">Hello, world!</div>
          </body>
        `,
        'project-a/tailwind.config.js': js`
          export default {
            content: ['../project-b/src/**/*.js'],
          }
        `,
        'project-a/src/index.css': css`
          @import 'tailwindcss/theme' theme(reference);
          @import 'tailwindcss/utilities';
          @import './custom-theme.css';
          @config '../tailwind.config.js';
          @source '../../project-b/src/**/*.html';
        `,
        'project-a/src/custom-theme.css': css`
          /* Will be overwritten later */
          @theme {
            --color-primary: black;
          }
        `,
        'project-b/src/index.html': html`
          <div class="flex" />
        `,
        'project-b/src/index.js': js`
          const className = "content-['project-b/src/index.js']"
          module.exports = { className }
        `,
      },
    },
    async ({ root, spawn, fs, expect }) => {
      let process = await spawn('pnpm vite build --watch', {
        cwd: path.join(root, 'project-a'),
      })
      await process.onStdout((m) => m.includes('built in'))

      let filename = ''
      await retryAssertion(async () => {
        let files = await fs.glob('project-a/dist/**/*.css')
        expect(files).toHaveLength(1)
        filename = files[0][0]
      })

      await fs.expectFileToContain(filename, [
        candidate`underline`,
        candidate`flex`,
        css`
          .text-primary {
            color: var(--color-primary);
          }
        `,
      ])

      await retryAssertion(async () => {
        await fs.write(
          'project-a/src/custom-theme.css',
          css`
            /* Overriding the primary color */
            @theme {
              --color-primary: red;
            }
          `,
        )

        let files = await fs.glob('project-a/dist/**/*.css')
        expect(files).toHaveLength(1)
        let [, styles] = files[0]

        expect(styles).toContain(css`
          .text-primary {
            color: var(--color-primary);
          }
        `)
      })

      await retryAssertion(async () => {
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

        let files = await fs.glob('project-a/dist/**/*.css')
        expect(files).toHaveLength(1)
        let [, styles] = files[0]
        expect(styles).toContain(candidate`underline`)
        expect(styles).toContain(candidate`flex`)
        expect(styles).toContain(candidate`m-2`)
      })

      await retryAssertion(async () => {
        // Manually added `@source`s are watched and trigger a rebuild
        await fs.write(
          'project-b/src/index.js',
          js`
            const className = "[.changed_&]:content-['project-b/src/index.js']"
            module.exports = { className }
          `,
        )

        let files = await fs.glob('project-a/dist/**/*.css')
        expect(files).toHaveLength(1)
        let [, styles] = files[0]
        expect(styles).toContain(candidate`underline`)
        expect(styles).toContain(candidate`flex`)
        expect(styles).toContain(candidate`m-2`)
        expect(styles).toContain(candidate`[.changed_&]:content-['project-b/src/index.js']`)
      })

      await retryAssertion(async () => {
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

        let files = await fs.glob('project-a/dist/**/*.css')
        expect(files).toHaveLength(1)
        let [, styles] = files[0]
        expect(styles).toContain(candidate`underline`)
        expect(styles).toContain(candidate`flex`)
        expect(styles).toContain(candidate`m-2`)
        expect(styles).toContain(candidate`[.changed_&]:content-['project-b/src/index.js']`)
        expect(styles).toContain(candidate`red`)
      })
    },
  )

  test(
    `source(none) disables looking at the module graph`,
    {
      fs: {
        'package.json': json`{}`,
        'pnpm-workspace.yaml': yaml`
          #
          packages:
            - project-a
        `,
        'project-a/package.json': txt`
          {
            "type": "module",
            "dependencies": {
              "@tailwindcss/vite": "workspace:^",
              "tailwindcss": "workspace:^"
            },
            "devDependencies": {
              ${transformer === 'lightningcss' ? `"lightningcss": "^1.26.0",` : ''}
              "vite": "^6"
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
          @import 'tailwindcss' source(none);
          @source '../../project-b/src/**/*.html';
        `,
        'project-b/src/index.html': html`
          <div class="flex" />
        `,
        'project-b/src/index.js': js`
          const className = "content-['project-b/src/index.js']"
          module.exports = { className }
        `,
      },
    },
    async ({ root, fs, exec, expect }) => {
      await exec('pnpm vite build', { cwd: path.join(root, 'project-a') })

      let files = await fs.glob('project-a/dist/**/*.css')
      expect(files).toHaveLength(1)
      let [filename] = files[0]

      // `underline` and `m-2` are only present from files in the module graph
      // which we've explicitly disabled with source(none) so they should not
      // be present
      await fs.expectFileNotToContain(filename, [
        //
        candidate`underline`,
        candidate`m-2`,
      ])

      // The files from `project-b` should be included because there is an
      // explicit `@source` directive for it
      await fs.expectFileToContain(filename, [
        //
        candidate`flex`,
      ])

      // The explicit source directive only covers HTML files, so the JS file
      // should not be included
      await fs.expectFileNotToContain(filename, [
        //
        candidate`content-['project-b/src/index.js']`,
      ])
    },
  )

  test(
    `source("…") filters the module graph`,
    {
      fs: {
        'package.json': json`{}`,
        'pnpm-workspace.yaml': yaml`
          #
          packages:
            - project-a
        `,
        'project-a/package.json': txt`
          {
            "type": "module",
            "dependencies": {
              "@tailwindcss/vite": "workspace:^",
              "tailwindcss": "workspace:^"
            },
            "devDependencies": {
              ${transformer === 'lightningcss' ? `"lightningcss": "^1.26.0",` : ''}
              "vite": "^6"
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
            <link rel="stylesheet" href="/src/index.css" />
          </head>
          <body>
            <div class="underline m-2 content-['project-a/index.html']">Hello, world!</div>
            <script type="module" src="/app/index.js"></script>
          </body>
        `,
        'project-a/app/index.js': js`
          const className = "content-['project-a/app/index.js']"
          export default { className }
        `,
        'project-a/src/index.css': css`
          @import 'tailwindcss' source('../app');
          @source '../../project-b/src/**/*.html';
        `,
        'project-b/src/index.html': html`
          <div
            class="content-['project-b/src/index.html']"
          />
        `,
        'project-b/src/index.js': js`
          const className = "content-['project-b/src/index.js']"
          module.exports = { className }
        `,
      },
    },
    async ({ root, fs, exec, expect }) => {
      await exec('pnpm vite build', { cwd: path.join(root, 'project-a') })

      let files = await fs.glob('project-a/dist/**/*.css')
      expect(files).toHaveLength(1)
      let [filename] = files[0]

      // `underline` and `m-2` are present in files in the module graph but
      // we've filtered the module graph such that we only look in
      // `./app/**/*` so they should not be present
      await fs.expectFileNotToContain(filename, [
        //
        candidate`underline`,
        candidate`m-2`,
        candidate`content-['project-a/index.html']`,
      ])

      // We've filtered the module graph to only look in ./app/**/* so the
      // candidates from that project should be present
      await fs.expectFileToContain(filename, [
        //
        candidate`content-['project-a/app/index.js']`,
      ])

      // Even through we're filtering the module graph explicit sources are
      // additive and as such files from `project-b` should be included
      // because there is an explicit `@source` directive for it
      await fs.expectFileToContain(filename, [
        //
        candidate`content-['project-b/src/index.html']`,
      ])

      // The explicit source directive only covers HTML files, so the JS file
      // should not be included
      await fs.expectFileNotToContain(filename, [
        //
        candidate`content-['project-b/src/index.js']`,
      ])
    },
  )

  test(
    `source("…") must be a directory`,
    {
      fs: {
        'package.json': json`{}`,
        'pnpm-workspace.yaml': yaml`
          #
          packages:
            - project-a
        `,
        'project-a/package.json': txt`
          {
            "type": "module",
            "dependencies": {
              "@tailwindcss/vite": "workspace:^",
              "tailwindcss": "workspace:^"
            },
            "devDependencies": {
              ${transformer === 'lightningcss' ? `"lightningcss": "^1.26.0",` : ''}
              "vite": "^6"
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
            <link rel="stylesheet" href="/src/index.css" />
          </head>
          <body>
            <div class="underline m-2 content-['project-a/index.html']">Hello, world!</div>
            <script type="module" src="/app/index.js"></script>
          </body>
        `,
        'project-a/app/index.js': js`
          const className = "content-['project-a/app/index.js']"
          export default { className }
        `,
        'project-a/src/index.css': css`
          @import 'tailwindcss' source('../i-do-not-exist');
          @source '../../project-b/src/**/*.html';
        `,
        'project-b/src/index.html': html`
          <div
            class="content-['project-b/src/index.html']"
          />
        `,
        'project-b/src/index.js': js`
          const className = "content-['project-b/src/index.js']"
          module.exports = { className }
        `,
      },
    },
    async ({ root, fs, exec, expect }) => {
      await expect(() =>
        exec('pnpm vite build', { cwd: path.join(root, 'project-a') }, { ignoreStdErr: true }),
      ).rejects.toThrowError('The `source(../i-do-not-exist)` does not exist')

      let files = await fs.glob('project-a/dist/**/*.css')
      expect(files).toHaveLength(0)
    },
  )
})
