import dedent from 'dedent'
import os from 'node:os'
import path from 'node:path'
import { describe } from 'vitest'
import { candidate, css, html, js, json, test, ts, yaml } from '../utils'

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
            class="underline 2xl:font-bold hocus:underline inverted:flex *:flex **:flex"
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
        candidate`*:flex`,
        candidate`**:flex`,
      ])
    },
  )

  test(
    'production build — read input from stdin',
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
            class="underline 2xl:font-bold hocus:underline inverted:flex *:flex **:flex"
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
      await exec(
        `${command} --input - --output dist/out.css`,
        { cwd: path.join(root, 'project-a') },
        {
          stdin: css`
            @import 'tailwindcss/utilities';
            @config './tailwind.config.js';
            @source '../project-b/src/**/*.html';
            @plugin './plugin.js';
          `,
        },
      )

      await fs.expectFileToContain('project-a/dist/out.css', [
        candidate`underline`,
        candidate`flex`,
        candidate`content-['project-a/src/index.js']`,
        candidate`content-['project-b/src/index.js']`,
        candidate`inverted:flex`,
        candidate`hocus:underline`,
        candidate`*:flex`,
        candidate`**:flex`,
      ])
    },
  )

  test(
    'production build — (write to stdout)',
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
            class="underline 2xl:font-bold hocus:underline inverted:flex *:flex **:flex"
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
    async ({ root, expect, exec }) => {
      let stdout = await exec(`${command} --input src/index.css --output -`, {
        cwd: path.join(root, 'project-a'),
      })

      expect(stdout).toContain(candidate`underline`)
      expect(stdout).toContain(candidate`flex`)
      expect(stdout).toContain(candidate`content-['project-a/src/index.js']`)
      expect(stdout).toContain(candidate`content-['project-b/src/index.js']`)
      expect(stdout).toContain(candidate`inverted:flex`)
      expect(stdout).toContain(candidate`hocus:underline`)
      expect(stdout).toContain(candidate`*:flex`)
      expect(stdout).toContain(candidate`**:flex`)
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
      let process = await spawn(`${command} --input src/index.css --output dist/out.css --watch`, {
        cwd: path.join(root, 'project-a'),
      })
      await process.onStderr((m) => m.includes('Done in'))

      await fs.expectFileToContain('project-a/dist/out.css', [
        candidate`underline`,
        candidate`flex`,
        candidate`content-['project-a/src/index.js']`,
        candidate`content-['project-b/src/index.js']`,
        candidate`inverted:flex`,
        candidate`hocus:underline`,
        css`
          .text-primary {
            color: var(--color-primary);
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
            color: var(--color-primary);
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

      await fs.expectFileToContain('project-a/dist/out.css', [css``])
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

  test(
    'module resolution using CJS, ESM, CTS, and MTS',
    {
      fs: {
        'package.json': json`{}`,
        'pnpm-workspace.yaml': yaml`
          #
          packages:
            - project-cjs
            - project-esm
            - plugin-cjs
            - plugin-esm
            - plugin-cts
            - plugin-mts
        `,
        'project-cjs/package.json': json`
          {
            "type": "commonjs",
            "dependencies": {
              "tailwindcss": "workspace:^",
              "@tailwindcss/cli": "workspace:^",
              "plugin-cjs": "workspace:*",
              "plugin-esm": "workspace:*",
              "plugin-cts": "workspace:*",
              "plugin-mts": "workspace:*"
            }
          }
        `,
        'project-cjs/index.html': html`
          <div class="cjs esm cts mts"></div>
        `,
        'project-cjs/src/index.css': css`
          @import 'tailwindcss/utilities';
          @plugin 'plugin-cjs';
          @plugin 'plugin-esm';
          @plugin 'plugin-cts';
          @plugin 'plugin-mts';
        `,

        'project-esm/package.json': json`
          {
            "type": "module",
            "dependencies": {
              "tailwindcss": "workspace:^",
              "@tailwindcss/cli": "workspace:^",
              "plugin-cjs": "workspace:*",
              "plugin-esm": "workspace:*",
              "plugin-cts": "workspace:*",
              "plugin-mts": "workspace:*"
            }
          }
        `,
        'project-esm/index.html': html`
          <div class="cjs esm cts mts"></div>
        `,
        'project-esm/src/index.css': css`
          @import 'tailwindcss/utilities';
          @plugin 'plugin-cjs';
          @plugin 'plugin-esm';
          @plugin 'plugin-cts';
          @plugin 'plugin-mts';
        `,

        'plugin-cjs/package.json': json`
          {
            "name": "plugin-cjs",
            "type": "commonjs",
            "exports": {
              ".": {
                "require": "./index.cjs"
              }
            }
          }
        `,
        'plugin-cjs/index.cjs': js`
          module.exports = function ({ addUtilities }) {
            addUtilities({ '.cjs': { content: '"cjs"' } })
          }
        `,

        'plugin-esm/package.json': json`
          {
            "name": "plugin-esm",
            "type": "module",
            "exports": {
              ".": {
                "import": "./index.mjs"
              }
            }
          }
        `,
        'plugin-esm/index.mjs': js`
          export default function ({ addUtilities }) {
            addUtilities({ '.esm': { content: '"esm"' } })
          }
        `,

        'plugin-cts/package.json': json`
          {
            "name": "plugin-cts",
            "type": "commonjs",
            "exports": {
              ".": {
                "require": "./index.cts"
              }
            }
          }
        `,
        'plugin-cts/index.cts': ts`
          export default function ({ addUtilities }) {
            addUtilities({ '.cts': { content: '"cts"' as const } })
          }
        `,

        'plugin-mts/package.json': json`
          {
            "name": "plugin-mts",
            "type": "module",
            "exports": {
              ".": {
                "import": "./index.mts"
              }
            }
          }
        `,
        'plugin-mts/index.mts': ts`
          export default function ({ addUtilities }) {
            addUtilities({ '.mts': { content: '"mts"' as const } })
          }
        `,
      },
    },
    async ({ root, fs, exec }) => {
      await exec(`${command} --input src/index.css --output dist/out.css`, {
        cwd: path.join(root, 'project-cjs'),
      })
      await exec(`${command} --input src/index.css --output dist/out.css`, {
        cwd: path.join(root, 'project-esm'),
      })

      await fs.expectFileToContain('./project-cjs/dist/out.css', [
        candidate`cjs`,
        candidate`esm`,
        candidate`cts`,
        candidate`mts`,
      ])
      await fs.expectFileToContain('./project-esm/dist/out.css', [
        candidate`cjs`,
        candidate`esm`,
        candidate`cts`,
        candidate`mts`,
      ])
    },
  )

  test(
    'git ignore files outside of a repo are not considered',
    {
      fs: {
        // Ignore everything in the "home" directory
        'home/.gitignore': '*',

        // Only ignore files called ignore-*.html in the actual git repo
        'home/project/.gitignore': 'ignore-*.html',

        'home/project/package.json': json`
          {
            "type": "module",
            "dependencies": {
              "tailwindcss": "workspace:^",
              "@tailwindcss/cli": "workspace:^"
            }
          }
        `,

        'home/project/src/index.css': css` @import 'tailwindcss'; `,
        'home/project/src/index.html': html`
          <div
            class="content-['index.html']"
          ></div>
        `,
        'home/project/src/ignore-1.html': html`
          <div
            class="content-['ignore-1.html']"
          ></div>
        `,
        'home/project/src/ignore-2.html': html`
          <div
            class="content-['ignore-2.html']"
          ></div>
        `,
      },

      installDependencies: false,
    },
    async ({ fs, root, exec }) => {
      await exec(`pnpm install --ignore-workspace`, {
        cwd: path.join(root, 'home/project'),
      })

      // No git repo = all ignore files are considered
      await exec(`${command} --input src/index.css --output dist/out.css`, {
        cwd: path.join(root, 'home/project'),
      })

      await fs.expectFileNotToContain('./home/project/dist/out.css', [
        candidate`content-['index.html']`,
        candidate`content-['ignore-1.html']`,
        candidate`content-['ignore-2.html']`,
      ])

      // Make home/project a git repo
      // Only ignore files within the repo are considered
      await exec(`git init`, {
        cwd: path.join(root, 'home/project'),
      })

      await exec(`${command} --input src/index.css --output dist/out.css`, {
        cwd: path.join(root, 'home/project'),
      })

      await fs.expectFileToContain('./home/project/dist/out.css', [
        candidate`content-['index.html']`,
      ])

      await fs.expectFileNotToContain('./home/project/dist/out.css', [
        candidate`content-['ignore-1.html']`,
        candidate`content-['ignore-2.html']`,
      ])
    },
  )
})

test(
  'auto source detection kitchen sink',
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
      'index.css': css`
        @reference 'tailwindcss/theme';

        /* (1) */
        /* - Only './src' should be auto-scanned, not the current working directory */
        /* - .gitignore'd paths should be ignored (node_modules) */
        /* - Binary extensions should be ignored (jpg, zip) */
        @import 'tailwindcss/utilities' source('./src');

        /* (2) */
        /* - All HTML and JSX files in 'ignored/components' should be scanned */
        /* - All other extensions should be ignored */
        @source "./ignored/components/*.{html,jsx}";

        /* (3) */
        /* - './components' should be auto-scanned in addition to './src' */
        /* - './components/ignored.html' should still be ignored */
        /* - Binary extensions in './components' should be ignored */
        @source "./components";

        /* (4) */
        /* - './pages' should be auto-scanned */
        /* - Only '.html' files should be included */
        /* - './page/ignored.html' should be ignored */
        @source "./pages/**/*.html";
      `,

      '.gitignore': dedent`
        /src/ignored
        /ignored
        /components/ignored.html
        /pages/ignored.html
      `,

      // (1)
      'index.html': 'content-["index.html"] content-["BAD"]', // "Root" source is in `./src`
      'src/index.html': 'content-["src/index.html"]',
      'src/nested/index.html': 'content-["src/nested/index.html"]',
      'src/index.jpg': 'content-["src/index.jpg"] content-["BAD"]',
      'src/nested/index.tar': 'content-["src/nested/index.tar"] content-["BAD"]',
      'src/ignored/index.html': 'content-["src/ignored/index.html"] content-["BAD"]',

      // (2)
      'ignored/components/my-component.html': 'content-["ignored/components/my-component.html"]',
      'ignored/components/my-component.jsx': 'content-["ignored/components/my-component.jsx"]',

      // Ignored and not explicitly listed by (2)
      'ignored/components/my-component.tsx':
        'content-["ignored/components/my-component.tsx"] content-["BAD"]',
      'ignored/components/nested/my-component.html':
        'content-["ignored/components/nested/my-component.html"] content-["BAD"]',

      // (3)
      'components/my-component.tsx': 'content-["components/my-component.tsx"]',
      'components/nested/my-component.tsx': 'content-["components/nested/my-component.tsx"]',
      'components/ignored.html': 'content-["components/ignored.html"] content-["BAD"]',

      // (4)
      'pages/foo.html': 'content-["pages/foo.html"]',
      'pages/nested/foo.html': 'content-["pages/nested/foo.html"]',
      'pages/ignored.html': 'content-["pages/ignored.html"] content-["BAD"]',
      'pages/foo.jsx': 'content-["pages/foo.jsx"] content-["BAD"]',
      'pages/nested/foo.jsx': 'content-["pages/nested/foo.jsx"] content-["BAD"]',
    },
  },
  async ({ fs, exec, expect }) => {
    await exec('pnpm tailwindcss --input index.css --output dist/out.css')

    expect(await fs.dumpFiles('./dist/*.css')).toMatchInlineSnapshot(`
      "
      --- ./dist/out.css ---
      .content-\\[\\"components\\/my-component\\.tsx\\"\\] {
        --tw-content: "components/my-component.tsx";
        content: var(--tw-content);
      }
      .content-\\[\\"components\\/nested\\/my-component\\.tsx\\"\\] {
        --tw-content: "components/nested/my-component.tsx";
        content: var(--tw-content);
      }
      .content-\\[\\"ignored\\/components\\/my-component\\.html\\"\\] {
        --tw-content: "ignored/components/my-component.html";
        content: var(--tw-content);
      }
      .content-\\[\\"ignored\\/components\\/my-component\\.jsx\\"\\] {
        --tw-content: "ignored/components/my-component.jsx";
        content: var(--tw-content);
      }
      .content-\\[\\"pages\\/foo\\.html\\"\\] {
        --tw-content: "pages/foo.html";
        content: var(--tw-content);
      }
      .content-\\[\\"pages\\/nested\\/foo\\.html\\"\\] {
        --tw-content: "pages/nested/foo.html";
        content: var(--tw-content);
      }
      .content-\\[\\"src\\/index\\.html\\"\\] {
        --tw-content: "src/index.html";
        content: var(--tw-content);
      }
      .content-\\[\\"src\\/nested\\/index\\.html\\"\\] {
        --tw-content: "src/nested/index.html";
        content: var(--tw-content);
      }
      @property --tw-content {
        syntax: "*";
        inherits: false;
        initial-value: "";
      }
      "
    `)
  },
)

test(
  'auto source detection in depth, source(…) and `@source` can be configured to use auto source detection (build + watch mode)',
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
        @reference 'tailwindcss/theme';

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
        @source '../../project-d/node_modules/my-lib-2/src/*.{html,js}';

        /* bar.html is git ignored, but explicitly listed here to scan */
        @source '../../project-d/src/bar.html';

        /* Project E's source ends with '..' */
        @source '../../project-e/nested/..';
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

      'project-d/src/.gitignore': dedent`
        foo.html
        bar.html
      `,

      // Project D, foo.html is ignored by the gitignore file.
      'project-d/src/foo.html': html`
        <div
          class="content-['SHOULD-NOT-EXIST-IN-OUTPUT'] content-['project-d/src/foo.html']"
        ></div>
      `,

      // Project D, bar.html is ignored by the gitignore file. But explicitly
      // listed as a `@source` glob.
      'project-d/src/bar.html': html`
        <div
          class="content-['project-d/src/bar.html']"
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

      // Project E's `@source "project-e/nested/.."` ends with `..`, which
      // should look for files in `project-e` itself.
      'project-e/index.html': html`<div class="content-['project-e/index.html']"></div>`,
      'project-e/nested/index.html': html`<div
          class="content-['project-e/nested/index.html']"
        ></div>`,
    },
  },
  async ({ fs, exec, spawn, root, expect }) => {
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
      .content-\\[\\'project-d\\/src\\/bar\\.html\\'\\] {
        --tw-content: 'project-d/src/bar.html';
        content: var(--tw-content);
      }
      .content-\\[\\'project-d\\/src\\/index\\.html\\'\\] {
        --tw-content: 'project-d/src/index.html';
        content: var(--tw-content);
      }
      .content-\\[\\'project-e\\/index\\.html\\'\\] {
        --tw-content: 'project-e/index.html';
        content: var(--tw-content);
      }
      .content-\\[\\'project-e\\/nested\\/index\\.html\\'\\] {
        --tw-content: 'project-e/nested/index.html';
        content: var(--tw-content);
      }
      @property --tw-content {
        syntax: "*";
        inherits: false;
        initial-value: "";
      }
      "
    `)

    // Watch mode tests
    let process = await spawn(
      'pnpm tailwindcss --input src/index.css --output dist/out.css --watch',
      {
        cwd: path.join(root, 'project-a'),
      },
    )
    await process.onStderr((m) => m.includes('Done in'))

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

    // Creating new files in the "root" of auto source detected folders
    await fs.write(
      'project-b/new-file.html',
      html`<div class="[.created_&]:content-['project-b/new-file.html']"></div>`,
    )
    await fs.write(
      'project-b/new-folder/new-file.html',
      html`<div class="[.created_&]:content-['project-b/new-folder/new-file.html']"></div>`,
    )
    await fs.write(
      'project-c/new-file.html',
      html`<div class="[.created_&]:content-['project-c/new-file.html']"></div>`,
    )
    await fs.write(
      'project-c/new-folder/new-file.html',
      html`<div class="[.created_&]:content-['project-c/new-folder/new-file.html']"></div>`,
    )
    await fs.expectFileToContain('./project-a/dist/out.css', [
      candidate`[.created_&]:content-['project-b/new-file.html']`,
      candidate`[.created_&]:content-['project-b/new-folder/new-file.html']`,
      candidate`[.created_&]:content-['project-c/new-file.html']`,
      candidate`[.created_&]:content-['project-c/new-folder/new-file.html']`,
    ])
  },
)

test(
  'auto source detection disabled',
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
      'index.css': css`
        @reference 'tailwindcss/theme';

        /* (1) */
        /* - Only './src' should be auto-scanned, not the current working directory */
        /* - .gitignore'd paths should be ignored (node_modules) */
        /* - Binary extensions should be ignored (jpg, zip) */
        @import 'tailwindcss/utilities' source(none);

        /* (2) */
        /* - './pages' should be auto-scanned */
        /* - Only '.html' files should be included */
        /* - './page/ignored.html' should be ignored */
        @source "./pages/**/*.html";
      `,

      '.gitignore': dedent`
        /src/ignored
        /pages/ignored.html
      `,

      // (1)
      'index.html': 'content-["index.html"] content-["BAD"]', // "Root" source is in `./src`
      'src/index.html': 'content-["src/index.html"] content-["BAD"]',
      'src/nested/index.html': 'content-["src/nested/index.html"] content-["BAD"]',
      'src/index.jpg': 'content-["src/index.jpg"] content-["BAD"]',
      'src/nested/index.tar': 'content-["src/nested/index.tar"] content-["BAD"]',
      'src/ignored/index.html': 'content-["src/ignored/index.html"] content-["BAD"]',

      // (4)
      'pages/foo.html': 'content-["pages/foo.html"]',
      'pages/nested/foo.html': 'content-["pages/nested/foo.html"]',
      'pages/ignored.html': 'content-["pages/ignored.html"] content-["BAD"]',
      'pages/foo.jsx': 'content-["pages/foo.jsx"] content-["BAD"]',
      'pages/nested/foo.jsx': 'content-["pages/nested/foo.jsx"] content-["BAD"]',
    },
  },
  async ({ fs, exec, expect }) => {
    await exec('pnpm tailwindcss --input index.css --output dist/out.css')

    expect(await fs.dumpFiles('./dist/*.css')).toMatchInlineSnapshot(`
      "
      --- ./dist/out.css ---
      .content-\\[\\"pages\\/foo\\.html\\"\\] {
        --tw-content: "pages/foo.html";
        content: var(--tw-content);
      }
      .content-\\[\\"pages\\/nested\\/foo\\.html\\"\\] {
        --tw-content: "pages/nested/foo.html";
        content: var(--tw-content);
      }
      @property --tw-content {
        syntax: "*";
        inherits: false;
        initial-value: "";
      }
      "
    `)
  },
)

test(
  '@theme reference should never emit values',
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
      'src/index.css': css`
        @reference "tailwindcss";

        .keep-me {
          color: red;
        }
      `,
    },
  },
  async ({ fs, spawn, expect }) => {
    let process = await spawn(
      `pnpm tailwindcss --input src/index.css --output dist/out.css --watch`,
    )
    await process.onStderr((m) => m.includes('Done in'))

    expect(await fs.dumpFiles('./dist/*.css')).toMatchInlineSnapshot(`
      "
      --- ./dist/out.css ---
      .keep-me {
        color: red;
      }
      "
    `)

    await fs.write(
      './src/index.css',
      css`
        @reference "tailwindcss";

        /* Not a reference! */
        @theme {
          --color-pink: pink;
        }

        .keep-me {
          color: red;
        }
      `,
    )
    expect(await fs.dumpFiles('./dist/*.css')).toMatchInlineSnapshot(`
      "
      --- ./dist/out.css ---
      .keep-me {
        color: red;
      }
      "
    `)
  },
)

test(
  'emit CSS variables if used outside of utilities',
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
      'src/index.css': css`
        @import 'tailwindcss/utilities';
        @theme {
          --color-blue-500: blue;
        }
      `,
      'src/index.ts': ts`
        function MyComponent() {
          return <motion.div />
        }
      `,
    },
  },
  async ({ fs, spawn, expect }) => {
    let process = await spawn(
      'pnpm tailwindcss --input src/index.css --output dist/out.css --watch',
    )
    await process.onStderr((m) => m.includes('Done in'))

    // No CSS variables are used, so nothing should be generated yet.
    expect(await fs.dumpFiles('./dist/*.css')).toMatchInlineSnapshot(`
      "
      --- ./dist/out.css ---
      <EMPTY>
      "
    `)

    // Use a CSS variable in JS/TS land, now it should be generated.
    await fs.write(
      './src/index.ts',
      ts`
        function MyComponent() {
          return <motion.div animate={{ backgroundColor: 'var(--color-blue-500)' }} />
        }
      `,
    )

    fs.expectFileToContain(
      './dist/out.css',
      css`
        :root,
        :host {
          --color-blue-500: blue;
        }
      `,
    )
  },
)

test(
  'can read files with UTF-8 files with BOM',
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
      'index.css': withBOM(css`
        @reference 'tailwindcss/theme.css';
        @import 'tailwindcss/utilities';
      `),
      'index.html': withBOM(html`
        <div class="underline"></div>
      `),
    },
  },
  async ({ fs, exec, expect }) => {
    await exec('pnpm tailwindcss --input index.css --output dist/out.css')

    expect(await fs.dumpFiles('./dist/*.css')).toMatchInlineSnapshot(`
      "
      --- ./dist/out.css ---
      .underline {
        text-decoration-line: underline;
      }
      "
    `)
  },
)

test(
  'fails when reading files with UTF-16 files with BOM',
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
    },
  },
  async ({ fs, exec, expect }) => {
    await fs.write(
      'index.css',
      withBOM(css`
        @reference 'tailwindcss/theme.css';
        @import 'tailwindcss/utilities';
      `),
      'utf16le',
    )
    await fs.write(
      'index.html',
      withBOM(html`
        <div class="underline"></div>
      `),
      'utf16le',
    )

    await expect(exec('pnpm tailwindcss --input index.css --output dist/out.css')).rejects.toThrow(
      /Invalid declaration:/,
    )
  },
)

function withBOM(text: string): string {
  return '\uFEFF' + text
}
