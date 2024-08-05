import path from 'node:path'
import { candidate, css, html, js, json, test, yaml } from '../utils'

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
      'project-a/src/index.css': css`
        @import 'tailwindcss/utilities';
        @content '../../project-b/src/**/*.js';
        @plugin '../plugin.js';
      `,
      'project-a/src/index.js': js`
        const className = "content-['project-a/src/index.js']"
        module.exports = { className }
      `,
      'project-b/src/index.js': js`
        const className = "content-['project-b/src/index.js']"
        module.exports = { className }
      `,
    },
  },
  async ({ root, fs, exec }) => {
    await exec('pnpm tailwindcss --input src/index.css --output dist/out.css', {
      cwd: path.join(root, 'project-a'),
    })

    await fs.expectFileToContain('project-a/dist/out.css', [
      candidate`underline`,
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
          class="underline 2xl:font-bold hocus:underline inverted:flex"
        ></div>
      `,
      'project-a/plugin.js': js`
        module.exports = function ({ addVariant }) {
          addVariant('inverted', '@media (inverted-colors: inverted)')
          addVariant('hocus', ['&:focus', '&:hover'])
        }
      `,
      'project-a/src/index.css': css`
        @import 'tailwindcss/utilities';
        @content '../../project-b/src/**/*.js';
        @plugin '../plugin.js';
      `,
      'project-a/src/index.js': js`
        const className = "content-['project-a/src/index.js']"
        module.exports = { className }
      `,
      'project-b/src/index.js': js`
        const className = "content-['project-b/src/index.js']"
        module.exports = { className }
      `,
    },
  },
  async ({ root, fs, spawn }) => {
    await spawn('pnpm tailwindcss --input src/index.css --output dist/out.css --watch', {
      cwd: path.join(root, 'project-a'),
    })

    await fs.expectFileToContain('project-a/dist/out.css', [
      candidate`underline`,
      candidate`content-['project-a/src/index.js']`,
      candidate`content-['project-b/src/index.js']`,
      candidate`inverted:flex`,
      candidate`hocus:underline`,
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
  },
)
