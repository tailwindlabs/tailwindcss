import os from 'node:os'
import path from 'node:path'
import { describe } from 'vitest'
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
