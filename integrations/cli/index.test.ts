import os from 'node:os'
import path from 'node:path'
import { describe, expect } from 'vitest'
import { candidate, css, html, js, json, test, yaml } from '../utils'

const STANDALONE_BINARY = (() => {
  switch (os.platform()) {
    case 'win32':
      return 'tailwindcss-windows-x64.exe'
    case 'darwin':
      return os.arch() === 'x64' ? 'tailwindcss-macos-x64' : 'tailwindcss-macos-arm64'
    case 'linux':
      return os.arch() === 'x64' ? 'tailwindcss-linux-x64' : 'tailwindcss-linux-arm64'
    default:
      throw new Error(`Unsupported platform: ${os.platform()} ${os.arch()}`)
  }
})()

describe.each([
  ['CLI', 'pnpm tailwindcss'],
  [
    'Standalone CLI',
    path.resolve(__dirname, `../../packages/@tailwindcss-standalone/dist/${STANDALONE_BINARY}`),
  ],
])('%s', (_, command) => {
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
            "dependencies": {
              "tailwindcss": "workspace:^",
              "@tailwindcss/cli": "workspace:^"
            }
          }
        `,
        'project-a/index.html': html`
          <div
            class="underline 2xl:font-bold hocus:underline inverted:flex"
          ></div>
        `,
        'project-a/plugin.js': js`
          module.exports = function ({ addVariant }) {
            addVariant('inverted', '@media (inverted-colors: inverted)')
            addVariant('hocus', ['&:focus', '&:hover'])
          }
        `,
        'project-a/tailwind.config.js': js`
          module.exports = {
            content: ['../project-b/src/**/*.js'],
          }
        `,
        'project-a/src/index.css': css`
          @import 'tailwindcss/utilities';
          @config '../tailwind.config.js';
          @source '../../project-b/src/**/*.html';
          @plugin '../plugin.js';
        `,
        'project-a/src/index.js': js`
          const className = "content-['project-a/src/index.js']"
          module.exports = { className }
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
    async ({ root, fs, exec }) => {
      await exec(`${command} --input src/index.css --output dist/out.css`, {
        cwd: path.join(root, 'project-a'),
      })

      await fs.expectFileToContain('project-a/dist/out.css', [
        candidate`underline`,
        candidate`flex`,
        candidate`content-['project-a/src/index.js']`,
        candidate`content-['project-b/src/index.js']`,
        candidate`inverted:flex`,
        candidate`hocus:underline`,
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
        'project-a/package.json': json`
          {
            "dependencies": {
              "tailwindcss": "workspace:^",
              "@tailwindcss/cli": "workspace:^"
            }
          }
        `,
        'project-a/index.html': html`
          <div
            class="underline 2xl:font-bold hocus:underline inverted:flex text-primary"
          ></div>
        `,
        'project-a/plugin.js': js`
          module.exports = function ({ addVariant }) {
            addVariant('inverted', '@media (inverted-colors: inverted)')
            addVariant('hocus', ['&:focus', '&:hover'])
          }
        `,
        'project-a/tailwind.config.js': js`
          module.exports = {
            content: ['../project-b/src/**/*.js'],
          }
        `,
        'project-a/src/index.css': css`
          @import 'tailwindcss/utilities';
          @import './custom-theme.css';
          @config '../tailwind.config.js';
          @source '../../project-b/src/**/*.html';
          @plugin '../plugin.js';
        `,
        'project-a/src/custom-theme.css': css`
          /* Will be overwritten later */
          @theme {
            --color-primary: black;
          }
        `,
        'project-a/src/index.js': js`
          const className = "content-['project-a/src/index.js']"
          module.exports = { className }
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
    async ({ root, fs, spawn }) => {
      await spawn(`${command} --input src/index.css --output dist/out.css --watch`, {
        cwd: path.join(root, 'project-a'),
      })

      await fs.expectFileToContain('project-a/dist/out.css', [
        candidate`underline`,
        candidate`flex`,
        candidate`content-['project-a/src/index.js']`,
        candidate`content-['project-b/src/index.js']`,
        candidate`inverted:flex`,
        candidate`hocus:underline`,
        css`
          .text-primary {
            color: var(--color-primary, black);
          }
        `,
      ])

      await fs.write(
        'project-a/src/index.js',
        js`
          const className = "[.changed_&]:content-['project-a/src/index.js']"
          module.exports = { className }
        `,
      )
      await fs.expectFileToContain('project-a/dist/out.css', [
        candidate`[.changed_&]:content-['project-a/src/index.js']`,
      ])

      await fs.write(
        'project-b/src/index.js',
        js`
          const className = "[.changed_&]:content-['project-b/src/index.js']"
          module.exports = { className }
        `,
      )
      await fs.expectFileToContain('project-a/dist/out.css', [
        candidate`[.changed_&]:content-['project-b/src/index.js']`,
      ])

      await fs.write(
        'project-a/src/custom-theme.css',
        css`
          /* Overriding the primary color */
          @theme {
            --color-primary: red;
          }
        `,
      )

      await fs.expectFileToContain('project-a/dist/out.css', [
        css`
          .text-primary {
            color: var(--color-primary, red);
          }
        `,
      ])

      await fs.write(
        'project-a/src/index.css',
        css`
          @import 'tailwindcss/utilities';
          @theme {
            --color-*: initial;
          }
        `,
      )

      await fs.expectFileToContain('project-a/dist/out.css', [
        css`
          :root {
          }
        `,
      ])
    },
  )

  test(
    'production build (stdin)',
    {
      fs: {
        'package.json': json`
          {
            "dependencies": {
              "tailwindcss": "workspace:^",
              "@tailwindcss/cli": "workspace:^"
            }
          }
        `,
        'index.html': html`
          <div class="underline"></div>
        `,
        'src/index.css': css`@import 'tailwindcss';`,
      },
    },
    async ({ fs, exec }) => {
      await exec(`${command} --input=- --output dist/out.css < src/index.css`)

      await fs.expectFileToContain('dist/out.css', [candidate`underline`])
    },
  )
})

test(
  'source(…) and `@source` can be configured to use auto source detection (build + watch mode)',
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
          "dependencies": {
            "tailwindcss": "workspace:^",
            "@tailwindcss/cli": "workspace:^"
          }
        }
      `,
      'project-a/src/index.css': css`
        @import 'tailwindcss/theme' theme(reference);

        /* Run auto-content detection in ../../project-b */
        @import 'tailwindcss/utilities' source('../../project-b');

        /* Explicitly using node_modules in the @source allows git ignored folders */
        @source '../node_modules/{my-lib-1,my-lib-2}/src/**/*.html';

        /* We typically ignore these extensions, but now include them explicitly */
        @source './logo.{jpg,png}';

        /* Project C should apply auto source detection */
        @source '../../project-c';

        /* Project D should apply auto source detection rules, such as ignoring node_modules */
        @source '../../project-d/**/*.{html,js}';
        @source '../../project-d/**/*.bin';

        /* Same as above, but my-lib-2 _should_ be includes */
        @source '../../project-d/node_modules/my-lib-2/*.{html,js}';
      `,

      // Project A is the current folder, but we explicitly configured
      // `source(project-b)`, therefore project-a should not be included in
      // the output.
      'project-a/src/index.html': html`
        <div
          class="content-['SHOULD-NOT-EXIST-IN-OUTPUT'] content-['project-a/src/index.html']"
        ></div>
      `,

      // Project A explicitly includes an extension we usually ignore,
      // therefore it should be included in the output.
      'project-a/src/logo.jpg': html`
        <div
          class="content-['project-a/src/logo.jpg']"
        ></div>
      `,

      // Project A explicitly includes node_modules/{my-lib-1,my-lib-2},
      // therefore these files should be included in the output.
      'project-a/node_modules/my-lib-1/src/index.html': html`
        <div
          class="content-['project-a/node_modules/my-lib-1/src/index.html']"
        ></div>
      `,
      'project-a/node_modules/my-lib-2/src/index.html': html`
        <div
          class="content-['project-a/node_modules/my-lib-2/src/index.html']"
        ></div>
      `,

      // Project B is the configured `source(…)`, therefore auto source
      // detection should include known extensions and folders in the output.
      'project-b/src/index.html': html`
        <div
          class="content-['project-b/src/index.html']"
        ></div>
      `,

      // Project B is the configured `source(…)`, therefore auto source
      // detection should apply and node_modules should not be included in the
      // output.
      'project-b/node_modules/my-lib-3/src/index.html': html`
        <div
          class="content-['SHOULD-NOT-EXIST-IN-OUTPUT'] content-['project-b/node_modules/my-lib-3/src/index.html']"
        ></div>
      `,

      // Project C should apply auto source detection, therefore known
      // extensions and folders should be included in the output.
      'project-c/src/index.html': html`
        <div
          class="content-['project-c/src/index.html']"
        ></div>
      `,

      // Project C should apply auto source detection, therefore known ignored
      // extensions should not be included in the output.
      'project-c/src/logo.jpg': html`
        <div
          class="content-['SHOULD-NOT-EXIST-IN-OUTPUT'] content-['project-c/src/logo.jpg']"
        ></div>
      `,

      // Project C should apply auto source detection, therefore node_modules
      // should not be included in the output.
      'project-c/node_modules/my-lib-1/src/index.html': html`
        <div
          class="content-['SHOULD-NOT-EXIST-IN-OUTPUT'] content-['project-c/node_modules/my-lib-1/src/index.html']"
        ></div>
      `,

      // Project D should apply auto source detection rules, such as ignoring
      // node_modules.
      'project-d/node_modules/my-lib-1/src/index.html': html`
        <div
          class="content-['SHOULD-NOT-EXIST-IN-OUTPUT'] content-['project-d/node_modules/my-lib-1/src/index.html']"
        ></div>
      `,

      // Project D has an explicit glob containing node_modules, thus should include the html file
      'project-d/node_modules/my-lib-2/src/index.html': html`
        <div
          class="content-['project-d/node_modules/my-lib-2/src/index.html']"
        ></div>
      `,

      // Project D should look for files with the extensions html and js.
      'project-d/src/index.html': html`
        <div
          class="content-['project-d/src/index.html']"
        ></div>
      `,

      // Project D should have a binary file even though we ignore binary files
      // by default, but it's explicitly listed.
      'project-d/my-binary-file.bin': html`
        <div
          class="content-['project-d/my-binary-file.bin']"
        ></div>
      `,
    },
  },
  async ({ fs, exec, spawn, root }) => {
    await exec('pnpm tailwindcss --input src/index.css --output dist/out.css', {
      cwd: path.join(root, 'project-a'),
    })

    expect(await fs.dumpFiles('./project-a/dist/*.css')).toMatchInlineSnapshot(`
      "
      --- ./project-a/dist/out.css ---
      .content-\\[\\'project-a\\/node_modules\\/my-lib-1\\/src\\/index\\.html\\'\\] {
        --tw-content: 'project-a/node modules/my-lib-1/src/index.html';
        content: var(--tw-content);
      }
      .content-\\[\\'project-a\\/node_modules\\/my-lib-2\\/src\\/index\\.html\\'\\] {
        --tw-content: 'project-a/node modules/my-lib-2/src/index.html';
        content: var(--tw-content);
      }
      .content-\\[\\'project-a\\/src\\/logo\\.jpg\\'\\] {
        --tw-content: 'project-a/src/logo.jpg';
        content: var(--tw-content);
      }
      .content-\\[\\'project-b\\/src\\/index\\.html\\'\\] {
        --tw-content: 'project-b/src/index.html';
        content: var(--tw-content);
      }
      .content-\\[\\'project-c\\/src\\/index\\.html\\'\\] {
        --tw-content: 'project-c/src/index.html';
        content: var(--tw-content);
      }
      .content-\\[\\'project-d\\/my-binary-file\\.bin\\'\\] {
        --tw-content: 'project-d/my-binary-file.bin';
        content: var(--tw-content);
      }
      .content-\\[\\'project-d\\/node_modules\\/my-lib-2\\/src\\/index\\.html\\'\\] {
        --tw-content: 'project-d/node modules/my-lib-2/src/index.html';
        content: var(--tw-content);
      }
      .content-\\[\\'project-d\\/src\\/index\\.html\\'\\] {
        --tw-content: 'project-d/src/index.html';
        content: var(--tw-content);
      }
      @supports (-moz-orient: inline) {
        @layer base {
          *, ::before, ::after, ::backdrop {
            --tw-content: "";
          }
        }
      }
      @property --tw-content {
        syntax: "*";
        inherits: false;
        initial-value: "";
      }
      "
    `)

    // Watch mode tests
    await spawn('pnpm tailwindcss --input src/index.css --output dist/out.css --watch', {
      cwd: path.join(root, 'project-a'),
    })

    // Changes to project-a should not be included in the output, we changed the
    // base folder to project-b.
    await fs.write(
      'project-a/src/index.html',
      html`<div class="[.changed_&]:content-['project-a/src/index.html']"></div>`,
    )
    await fs.expectFileNotToContain('./project-a/dist/out.css', [
      candidate`[.changed_&]:content-['project-a/src/index.html']`,
    ])

    // Changes to this file should be included, because we explicitly listed
    // them using `@source`.
    await fs.write(
      'project-a/src/logo.jpg',
      html`<div class="[.changed_&]:content-['project-a/src/logo.jpg']"></div>`,
    )
    await fs.expectFileToContain('./project-a/dist/out.css', [
      candidate`[.changed_&]:content-['project-a/src/logo.jpg']`,
    ])

    // Changes to these files should be included, because we explicitly listed
    // them using `@source`.
    await fs.write(
      'project-a/node_modules/my-lib-1/src/index.html',
      html`<div
          class="[.changed_&]:content-['project-a/node_modules/my-lib-1/src/index.html']"
        ></div>`,
    )
    await fs.expectFileToContain('./project-a/dist/out.css', [
      candidate`[.changed_&]:content-['project-a/node_modules/my-lib-1/src/index.html']`,
    ])
    await fs.write(
      'project-a/node_modules/my-lib-2/src/index.html',
      html`<div
          class="[.changed_&]:content-['project-a/node_modules/my-lib-2/src/index.html']"
        ></div>`,
    )
    await fs.expectFileToContain('./project-a/dist/out.css', [
      candidate`[.changed_&]:content-['project-a/node_modules/my-lib-2/src/index.html']`,
    ])

    // Changes to this file should be included, because we changed the base to
    // `project-b`.
    await fs.write(
      'project-b/src/index.html',
      html`<div class="[.changed_&]:content-['project-b/src/index.html']"></div>`,
    )
    await fs.expectFileToContain('./project-a/dist/out.css', [
      candidate`[.changed_&]:content-['project-b/src/index.html']`,
    ])

    // Changes to this file should not be included. We did change the base to
    // `project-b`, but we still apply the auto source detection rules which
    // ignore `node_modules`.
    await fs.write(
      'project-b/node_modules/my-lib-3/src/index.html',
      html`<div
          class="[.changed_&]:content-['project-b/node_modules/my-lib-3/src/index.html']"
        ></div>`,
    )
    await fs.expectFileNotToContain('./project-a/dist/out.css', [
      candidate`[.changed_&]:content-['project-b/node_modules/my-lib-3/src/index.html']`,
    ])

    // Project C was added explicitly via `@source`, therefore changes to these
    // files should be included.
    await fs.write(
      'project-c/src/index.html',
      html`<div class="[.changed_&]:content-['project-c/src/index.html']"></div>`,
    )
    await fs.expectFileToContain('./project-a/dist/out.css', [
      candidate`[.changed_&]:content-['project-c/src/index.html']`,
    ])

    // Except for these files, since they are ignored by the default auto source
    // detection rules.
    await fs.write(
      'project-c/src/logo.jpg',
      html`<div class="[.changed_&]:content-['project-c/src/logo.jpg']"></div>`,
    )
    await fs.expectFileNotToContain('./project-a/dist/out.css', [
      candidate`[.changed_&]:content-['project-c/src/logo.jpg']`,
    ])
    await fs.write(
      'project-c/node_modules/my-lib-1/src/index.html',
      html`<div
          class="[.changed_&]:content-['project-c/node_modules/my-lib-1/src/index.html']"
        ></div>`,
    )
    await fs.expectFileNotToContain('./project-a/dist/out.css', [
      candidate`[.changed_&]:content-['project-c/node_modules/my-lib-1/src/index.html']`,
    ])
  },
)
