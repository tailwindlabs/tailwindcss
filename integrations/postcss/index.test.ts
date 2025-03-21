import path from 'node:path'
import { candidate, css, html, js, json, test, ts, yaml } from '../utils'

test(
  'production build (string)',
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
            "postcss": "^8",
            "postcss-cli": "^10",
            "tailwindcss": "workspace:^",
            "@tailwindcss/postcss": "workspace:^"
          }
        }
      `,
      'project-a/postcss.config.js': js`
        module.exports = {
          plugins: {
            '@tailwindcss/postcss': {},
          },
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
        const className = "content-['a/src/index.js']"
        module.exports = { className }
      `,
      'project-b/src/index.html': html`
        <div class="flex" />
      `,
      'project-b/src/index.js': js`
        const className = "content-['b/src/index.js']"
        module.exports = { className }
      `,
    },
  },
  async ({ root, fs, exec }) => {
    await exec('pnpm postcss src/index.css --output dist/out.css', {
      cwd: path.join(root, 'project-a'),
    })

    await fs.expectFileToContain('project-a/dist/out.css', [
      candidate`underline`,
      candidate`flex`,
      candidate`content-['a/src/index.js']`,
      candidate`content-['b/src/index.js']`,
      candidate`inverted:flex`,
      candidate`hocus:underline`,
    ])
  },
)

test(
  'production build with `postcss-import` (string)',
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
            "postcss": "^8",
            "postcss-cli": "^10",
            "postcss-import": "^16",
            "tailwindcss": "workspace:^",
            "@tailwindcss/postcss": "workspace:^"
          }
        }
      `,
      'project-a/postcss.config.js': js`
        module.exports = {
          plugins: {
            'postcss-import': {},
            '@tailwindcss/postcss': {},
          },
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
        const className = "content-['a/src/index.js']"
        module.exports = { className }
      `,
      'project-b/src/index.html': html`
        <div class="flex" />
      `,
      'project-b/src/index.js': js`
        const className = "content-['b/src/index.js']"
        module.exports = { className }
      `,
    },
  },
  async ({ root, fs, exec }) => {
    await exec('pnpm postcss src/index.css --output dist/out.css', {
      cwd: path.join(root, 'project-a'),
    })

    await fs.expectFileToContain('project-a/dist/out.css', [
      candidate`underline`,
      candidate`flex`,
      candidate`content-['a/src/index.js']`,
      candidate`content-['b/src/index.js']`,
      candidate`inverted:flex`,
      candidate`hocus:underline`,
    ])
  },
)

test(
  'production build (ESM)',
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
            "postcss": "^8",
            "postcss-cli": "^10",
            "tailwindcss": "workspace:^",
            "@tailwindcss/postcss": "workspace:^"
          }
        }
      `,
      'project-a/postcss.config.mjs': js`
        import tailwindcss from '@tailwindcss/postcss'
        export default {
          plugins: [tailwindcss()],
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
        const className = "content-['a/src/index.js']"
        module.exports = { className }
      `,
      'project-b/src/index.html': html`
        <div class="flex" />
      `,
      'project-b/src/index.js': js`
        const className = "content-['b/src/index.js']"
        module.exports = { className }
      `,
    },
  },
  async ({ root, fs, exec }) => {
    await exec('pnpm postcss src/index.css --output dist/out.css', {
      cwd: path.join(root, 'project-a'),
    })

    await fs.expectFileToContain('project-a/dist/out.css', [
      candidate`underline`,
      candidate`flex`,
      candidate`content-['a/src/index.js']`,
      candidate`content-['b/src/index.js']`,
      candidate`inverted:flex`,
      candidate`hocus:underline`,
    ])
  },
)

test(
  'production build (CJS)',
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
            "postcss": "^8",
            "postcss-cli": "^10",
            "tailwindcss": "workspace:^",
            "@tailwindcss/postcss": "workspace:^"
          }
        }
      `,
      'project-a/postcss.config.cjs': js`
        let tailwindcss = require('@tailwindcss/postcss')
        module.exports = {
          plugins: [tailwindcss()],
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
        const className = "content-['a/src/index.js']"
        module.exports = { className }
      `,
      'project-b/src/index.html': html`
        <div class="flex" />
      `,
      'project-b/src/index.js': js`
        const className = "content-['b/src/index.js']"
        module.exports = { className }
      `,
    },
  },
  async ({ root, fs, exec }) => {
    await exec('pnpm postcss src/index.css --output dist/out.css', {
      cwd: path.join(root, 'project-a'),
    })

    await fs.expectFileToContain('project-a/dist/out.css', [
      candidate`underline`,
      candidate`flex`,
      candidate`content-['a/src/index.js']`,
      candidate`content-['b/src/index.js']`,
      candidate`inverted:flex`,
      candidate`hocus:underline`,
    ])
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
            "@tailwindcss/postcss": "workspace:^",
            "plugin-cjs": "workspace:*",
            "plugin-cts": "workspace:*",
            "plugin-esm": "workspace:*",
            "plugin-mts": "workspace:*",
            "postcss": "^8",
            "postcss-cli": "^10",
            "tailwindcss": "workspace:^"
          }
        }
      `,
      'project-cjs/postcss.config.cjs': js`
        let tailwindcss = require('@tailwindcss/postcss')
        module.exports = {
          plugins: [tailwindcss()],
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
            "@tailwindcss/postcss": "workspace:^",
            "plugin-cjs": "workspace:*",
            "plugin-cts": "workspace:*",
            "plugin-esm": "workspace:*",
            "plugin-mts": "workspace:*",
            "postcss": "^8",
            "postcss-cli": "^10",
            "tailwindcss": "workspace:^"
          }
        }
      `,
      'project-esm/postcss.config.mjs': js`
        import tailwindcss from '@tailwindcss/postcss'
        export default {
          plugins: [tailwindcss()],
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
    await exec(`pnpm postcss src/index.css --output dist/out.css`, {
      cwd: path.join(root, 'project-cjs'),
    })
    await exec(`pnpm postcss src/index.css --output dist/out.css`, {
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
            "postcss": "^8",
            "postcss-cli": "^10",
            "tailwindcss": "workspace:^",
            "@tailwindcss/postcss": "workspace:^"
          }
        }
      `,
      'project-a/postcss.config.js': js`
        module.exports = {
          plugins: {
            '@tailwindcss/postcss': {},
          },
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
        const className = "content-['a/src/index.js']"
        module.exports = { className }
      `,
      'project-b/src/index.html': html`
        <div class="flex" />
      `,
      'project-b/src/index.js': js`
        const className = "content-['b/src/index.js']"
        module.exports = { className }
      `,
      'project-c/src/index.js': js`
        const className = "content-['c/src/index.js']"
        module.exports = { className }
      `,
    },
  },
  async ({ root, fs, spawn }) => {
    let process = await spawn(
      'pnpm postcss src/index.css --output dist/out.css --watch --verbose',
      { cwd: path.join(root, 'project-a') },
    )
    await process.onStderr((message) => message.includes('Waiting for file changes...'))

    await fs.expectFileToContain('project-a/dist/out.css', [
      candidate`underline`,
      candidate`flex`,
      candidate`content-['a/src/index.js']`,
      candidate`content-['b/src/index.js']`,
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

    // Adding a new @source directive will scan for new candidates
    await fs.write(
      'project-a/src/index.css',
      css`
        @import 'tailwindcss/utilities';
        @import './custom-theme.css';
        @config '../tailwind.config.js';
        @source '../../project-b/src/**/*.html';
        @plugin '../plugin.js';
        @source '../../project-c/src/**/*.js';
      `,
    )
    await fs.expectFileToContain('project-a/dist/out.css', [candidate`content-['c/src/index.js']`])
  },
)
