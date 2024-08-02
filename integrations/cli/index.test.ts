import path from 'node:path'
import { expect } from 'vitest'
import { css, html, js, json, stripTailwindComment, test, yaml } from '../utils'

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
        const className = "content-['a/src/index.js']"
        module.exports = { className }
      `,
      'project-b/src/index.js': js`
        const className = "content-['b/src/index.js']"
        module.exports = { className }
      `,
    },
  },
  async ({ root, fs, exec }) => {
    await exec('pnpm tailwindcss --input src/index.css --output dist/out.css', {
      cwd: path.join(root, 'project-a'),
    })

    expect(stripTailwindComment(await fs.read('project-a/dist/out.css'))).toMatchInlineSnapshot(`
      ".underline {
        text-decoration-line: underline;
      }
      .content-\\[\\'a\\/src\\/index\\.js\\'\\] {
        --tw-content: 'a/src/index.js';
        content: var(--tw-content);
      }
      .content-\\[\\'b\\/src\\/index\\.js\\'\\] {
        --tw-content: 'b/src/index.js';
        content: var(--tw-content);
      }
      .inverted\\:flex {
        @media (inverted-colors: inverted) {
          display: flex;
        }
      }
      .hocus\\:underline {
        &:focus {
          text-decoration-line: underline;
        }
        &:hover {
          text-decoration-line: underline;
        }
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
      }"
    `)
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
        const className = "content-['a/src/index.js']"
        module.exports = { className }
      `,
      'project-b/src/index.js': js`
        const className = "content-['b/src/index.js']"
        module.exports = { className }
      `,
    },
  },
  async ({ root, fs, spawn }) => {
    let process = await spawn(
      'pnpm tailwindcss --input src/index.css --output dist/out.css --watch',
      { cwd: path.join(root, 'project-a') },
    )
    await process.onStderr((message) => message.includes('Done'))

    expect(stripTailwindComment(await fs.read('project-a/dist/out.css'))).toMatchInlineSnapshot(`
      ".underline {
        text-decoration-line: underline;
      }
      .content-\\[\\'a\\/src\\/index\\.js\\'\\] {
        --tw-content: 'a/src/index.js';
        content: var(--tw-content);
      }
      .content-\\[\\'b\\/src\\/index\\.js\\'\\] {
        --tw-content: 'b/src/index.js';
        content: var(--tw-content);
      }
      .inverted\\:flex {
        @media (inverted-colors: inverted) {
          display: flex;
        }
      }
      .hocus\\:underline {
        &:focus {
          text-decoration-line: underline;
        }
        &:hover {
          text-decoration-line: underline;
        }
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
      }"
    `)

    await fs.waitForOutputFileChange('project-a/dist/out.css', async () => {
      await fs.write(
        'project-a/src/index.js',
        js`
          const className = "[.changed_&]:content-['project-a/src/index.js']"
          module.exports = { className }
        `,
      )
    })

    expect(stripTailwindComment(await fs.read('project-a/dist/out.css'))).toMatchInlineSnapshot(`
      ".underline {
        text-decoration-line: underline;
      }
      .content-\\[\\'a\\/src\\/index\\.js\\'\\] {
        --tw-content: 'a/src/index.js';
        content: var(--tw-content);
      }
      .content-\\[\\'b\\/src\\/index\\.js\\'\\] {
        --tw-content: 'b/src/index.js';
        content: var(--tw-content);
      }
      .inverted\\:flex {
        @media (inverted-colors: inverted) {
          display: flex;
        }
      }
      .hocus\\:underline {
        &:focus {
          text-decoration-line: underline;
        }
        &:hover {
          text-decoration-line: underline;
        }
      }
      .\\[\\.changed_\\&\\]\\:content-\\[\\'project-a\\/src\\/index\\.js\\'\\] {
        .changed & {
          --tw-content: 'project-a/src/index.js';
          content: var(--tw-content);
        }
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
      }"
    `)

    await fs.waitForOutputFileChange('project-a/dist/out.css', async () => {
      await fs.write(
        'project-b/src/index.js',
        js`
          const className = "[.changed_&]:content-['project-b/src/index.js']"
          module.exports = { className }
        `,
      )
    })

    expect(stripTailwindComment(await fs.read('project-a/dist/out.css'))).toMatchInlineSnapshot(`
      ".underline {
        text-decoration-line: underline;
      }
      .content-\\[\\'a\\/src\\/index\\.js\\'\\] {
        --tw-content: 'a/src/index.js';
        content: var(--tw-content);
      }
      .content-\\[\\'b\\/src\\/index\\.js\\'\\] {
        --tw-content: 'b/src/index.js';
        content: var(--tw-content);
      }
      .inverted\\:flex {
        @media (inverted-colors: inverted) {
          display: flex;
        }
      }
      .hocus\\:underline {
        &:focus {
          text-decoration-line: underline;
        }
        &:hover {
          text-decoration-line: underline;
        }
      }
      .\\[\\.changed_\\&\\]\\:content-\\[\\'project-a\\/src\\/index\\.js\\'\\] {
        .changed & {
          --tw-content: 'project-a/src/index.js';
          content: var(--tw-content);
        }
      }
      .\\[\\.changed_\\&\\]\\:content-\\[\\'project-b\\/src\\/index\\.js\\'\\] {
        .changed & {
          --tw-content: 'project-b/src/index.js';
          content: var(--tw-content);
        }
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
      }"
    `)
  },
)
