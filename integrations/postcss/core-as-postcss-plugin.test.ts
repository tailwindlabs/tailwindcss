import { afterEach, beforeEach } from 'node:test'
import { expect, vi } from 'vitest'
import { css, js, json, test } from '../utils'

const variantConfig = {
  string: {
    'postcss.config.js': js`
      module.exports = {
        plugins: {
          tailwindcss: {},
        },
      }
    `,
  },
  ESM: {
    'postcss.config.mjs': js`
      import tailwindcss from 'tailwindcss'
      export default {
        plugins: [tailwindcss()],
      }
    `,
  },
  CJS: {
    'postcss.config.cjs': js`
      let tailwindcss = require('tailwindcss')
      module.exports = {
        plugins: [tailwindcss()],
      }
    `,
  },
}

let originalConsoleError: typeof console.error
beforeEach(() => {
  originalConsoleError = console.error
  console.error = vi.fn()
})
afterEach(() => {
  console.error = originalConsoleError
})

for (let variant of ['string', 'ESM', 'CJS']) {
  test(
    `can not use \`tailwindcss\` as a postcss module (${variant})`,
    {
      fs: {
        ...variantConfig[variant],
        'package.json': json`
          {
            "dependencies": {
              "postcss": "^8",
              "postcss-cli": "^10",
              "tailwindcss": "workspace:^"
            }
          }
        `,
        'src/index.css': css`@import 'tailwindcss';`,
      },
    },
    async ({ exec }) => {
      expect(
        exec('pnpm postcss src/index.css --output dist/out.css', undefined, { ignoreStdErr: true }),
      ).rejects
        .toThrowError(`It looks like you're trying to use the \`tailwindcss\` package as a PostCSS plugin. This is no longer possible since Tailwind CSS v4.

If you want to continue to use Tailwind CSS with PostCSS, please install \`@tailwindcss/postcss\` and change your PostCSS config file.`)
    },
  )
}
