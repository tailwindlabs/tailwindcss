import { describe } from 'vitest'
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

describe.each(Object.keys(variantConfig))('%s', (variant) => {
  test(
    `can not use \`tailwindcss\` as a postcss module`,
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
    async ({ exec, expect }) => {
      expect(
        exec('pnpm postcss src/index.css --output dist/out.css', undefined, { ignoreStdErr: true }),
      ).rejects.toThrowError(
        `It looks like you're trying to use \`tailwindcss\` directly as a PostCSS plugin. The PostCSS plugin has moved to a separate package, so to continue using Tailwind CSS with PostCSS you'll need to install \`@tailwindcss/postcss\` and update your PostCSS configuration.`,
      )
    },
  )
})
