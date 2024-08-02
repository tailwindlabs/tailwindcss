import path from 'node:path'
import { describe, expect } from 'vitest'
import { css, html, js, json, stripTailwindComment, test, txt, yaml } from '../utils'

test(
  'works with production builds',
  {
    fs: {
      'package.json': json` {} `,
      'pnpm-workspace.yaml': yaml`
        #
        packages:
          - a
      `,
      'a/package.json': json`
        {
          "dependencies": {
            "tailwindcss": "workspace:^",
            "@tailwindcss/cli": "workspace:^"
          }
        }
      `,
      'a/index.html': html`
        <div
          class="underline 2xl:font-bold hocus:underline inverted:flex"
        ></div>
      `,
      'a/plugin.js': js`
        module.exports = function ({ addVariant }) {
          addVariant('inverted', '@media (inverted-colors: inverted)')
          addVariant('hocus', ['&:focus', '&:hover'])
        }
      `,
      'a/src/index.css': css`
        @import 'tailwindcss/utilities';
        @content '../../b/src/**/*.js';
        @plugin '../plugin.js';
      `,
      'a/src/index.js': js`
        const className = "content-['a/src/index.js']"
        module.exports = { className }
      `,
      'b/src/index.js': js`
        const className = "content-['b/src/index.js']"
        module.exports = { className }
      `,
    },
  },
  async ({ root, fs, exec }) => {
    await exec('pnpm tailwindcss --input src/index.css --output dist/out.css', {
      cwd: path.join(root, 'a'),
    })

    expect(stripTailwindComment(await fs.read('a/dist/out.css'))).toMatchInlineSnapshot(`
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

describe('watch mode', () => {
  test(
    'updates the artifacts on changes',
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
        'src/index.html': html`
          <div class="underline"></div>
        `,
        'src/index.css': css`
          @import 'tailwindcss/theme' reference;
          @import 'tailwindcss/utilities';
        `,
        '.gitignore': txt`
         node_modules/
       `,
      },
    },
    async ({ fs, spawn }) => {
      let process = await spawn(
        'pnpm tailwindcss --input src/index.css --output dist/out.css --watch',
      )
      await process.onStderr((message) => message.includes('Done'))

      expect(stripTailwindComment(await fs.read('dist/out.css'))).toMatchInlineSnapshot(`
        ".underline {
          text-decoration-line: underline;
        }"
      `)

      await fs.write('index.html', html`
        <div class="underline m-2"></div>
      `)
      await process.onStderr((message) => message.includes('Done'))

      expect(stripTailwindComment(await fs.read('dist/out.css'))).toMatchInlineSnapshot(`
        ".m-2 {
          margin: var(--spacing-2, 0.5rem);
        }
        .underline {
          text-decoration-line: underline;
        }"
      `)
    },
  )
})
